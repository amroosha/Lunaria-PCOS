import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { AIProviderError, streamAssistantReply, type ChatMessage } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { getChatConfig } from "@/lib/config";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type StreamEvent =
  | { type: "meta"; conversationId: string; title: string }
  | { type: "text"; delta: string }
  | { type: "error"; message: string }
  | { type: "done" };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonError(status: number, error: string, message: string, extra: Record<string, unknown> = {}) {
  return Response.json({ error, message, ...extra }, { status });
}

function makeTitle(text: string): string {
  const firstLine = text.split("\n").find((line) => line.trim().length > 0) ?? "New conversation";
  const compact = firstLine.replace(/\s+/g, " ").trim();
  return compact.length > 60 ? `${compact.slice(0, 57).trimEnd()}…` : compact;
}

export async function POST(request: Request) {
  const config = getChatConfig();

  if (!config.provider) {
    return jsonError(
      503,
      "not_configured",
      "The AI connection is not configured yet. Add an API key on the server to enable chat.",
    );
  }

  const limit = checkRateLimit(getClientKey(request), config.rateLimitPerMinute);
  if (!limit.allowed) {
    return jsonError(
      429,
      "rate_limited",
      `You're sending messages a little quickly. Please wait ${limit.retryAfterSeconds}s and try again.`,
      { retryAfterSeconds: limit.retryAfterSeconds },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "bad_request", "The request body must be JSON.");
  }
  const payload = (body ?? {}) as Record<string, unknown>;

  const provider = config.provider;
  let context: ChatMessage[];
  let persistence: { conversationId: string; title: string; userText: string } | null = null;

  if (config.historyEnabled) {
    /* ---------------- history mode: sign-in required, data scoped to user ---------------- */
    const user = await getCurrentUser();
    if (!user) {
      return jsonError(401, "unauthorized", "Please sign in to chat. Your conversations are saved privately to your account.");
    }

    const text = typeof payload.message === "string" ? payload.message.trim() : "";
    if (!text) return jsonError(400, "bad_request", "Please type a message first.");
    if (text.length > config.maxMessageChars) {
      return jsonError(400, "bad_request", `Messages are limited to ${config.maxMessageChars} characters.`);
    }

    let conversationId: string;
    let title: string;

    if (typeof payload.conversationId === "string" && payload.conversationId.length > 0) {
      if (!UUID_RE.test(payload.conversationId)) {
        return jsonError(400, "bad_request", "Invalid conversation id.");
      }
      // Ownership check: the conversation must belong to the signed-in user.
      const [owned] = await db
        .select({ id: conversations.id, title: conversations.title })
        .from(conversations)
        .where(and(eq(conversations.id, payload.conversationId), eq(conversations.userId, user.id)))
        .limit(1);
      if (!owned) return jsonError(404, "not_found", "That conversation could not be found.");
      conversationId = owned.id;
      title = owned.title;
    } else {
      title = makeTitle(text);
      const [created] = await db
        .insert(conversations)
        .values({ userId: user.id, title })
        .returning({ id: conversations.id });
      conversationId = created.id;
    }

    const prior = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(config.maxContextMessages);
    prior.reverse();

    // The user message is saved together with the reply (see `finally` below) so a
    // failed provider call can simply be retried without leaving duplicate rows.
    context = [...prior, { role: "user", content: text }];
    persistence = { conversationId, title, userText: text };
  } else {
    /* ---------------- ephemeral mode: context lives only in the visitor's browser ---------------- */
    const raw = Array.isArray(payload.messages) ? payload.messages : null;
    if (!raw || raw.length === 0) return jsonError(400, "bad_request", "Please type a message first.");

    const cleaned: ChatMessage[] = [];
    for (const item of raw) {
      const entry = item as { role?: unknown; content?: unknown };
      if ((entry.role !== "user" && entry.role !== "assistant") || typeof entry.content !== "string") {
        return jsonError(400, "bad_request", "Malformed message in conversation.");
      }
      const content = entry.content.trim();
      if (!content) continue;
      const cap = entry.role === "user" ? config.maxMessageChars : config.maxMessageChars * 4;
      cleaned.push({ role: entry.role, content: content.slice(0, cap) });
    }

    const last = cleaned[cleaned.length - 1];
    if (!last || last.role !== "user") {
      return jsonError(400, "bad_request", "The last message must come from you.");
    }
    if (last.content.length > config.maxMessageChars) {
      return jsonError(400, "bad_request", `Messages are limited to ${config.maxMessageChars} characters.`);
    }
    context = cleaned.slice(-config.maxContextMessages);
  }

  /* ---------------- stream the reply ---------------- */
  const upstream = new AbortController();
  const onClientAbort = () => upstream.abort();
  request.signal.addEventListener("abort", onClientAbort);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          /* client already disconnected */
        }
      };

      let assistantText = "";
      try {
        if (persistence) {
          send({ type: "meta", conversationId: persistence.conversationId, title: persistence.title });
        }

        for await (const delta of streamAssistantReply(provider, config.systemPrompt, context, upstream.signal)) {
          assistantText += delta;
          send({ type: "text", delta });
        }

        send({ type: "done" });
      } catch (error) {
        if (!upstream.signal.aborted) {
          const message =
            error instanceof AIProviderError
              ? error.message
              : "Something went wrong while talking to the AI. Please try again.";
          send({ type: "error", message });
          console.error("[chat] provider error:", error instanceof Error ? error.message : error);
        }
      } finally {
        request.signal.removeEventListener("abort", onClientAbort);

        if (persistence && assistantText.trim().length > 0) {
          try {
            await db.insert(messages).values({
              conversationId: persistence.conversationId,
              role: "user",
              content: persistence.userText,
            });
            await db.insert(messages).values({
              conversationId: persistence.conversationId,
              role: "assistant",
              content: assistantText,
            });
            await db
              .update(conversations)
              .set({ updatedAt: new Date() })
              .where(eq(conversations.id, persistence.conversationId));
          } catch (dbError) {
            console.error("[chat] failed to save assistant message:", dbError);
          }
        }

        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
    cancel() {
      upstream.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
