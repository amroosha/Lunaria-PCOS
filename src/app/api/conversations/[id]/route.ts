import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getChatConfig } from "@/lib/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Params = { params: Promise<{ id: string }> };

async function resolveOwnedConversation(idParam: string) {
  if (!getChatConfig().historyEnabled) {
    return {
      error: Response.json(
        { error: "history_disabled", message: "Chat history is not enabled on this site." },
        { status: 403 },
      ),
    } as const;
  }
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: Response.json({ error: "unauthorized", message: "Please sign in." }, { status: 401 }),
    } as const;
  }
  if (!UUID_RE.test(idParam)) {
    return {
      error: Response.json({ error: "not_found", message: "Conversation not found." }, { status: 404 }),
    } as const;
  }

  // Ownership is enforced in the query itself: id AND user_id must both match.
  const [conversation] = await db
    .select({ id: conversations.id, title: conversations.title })
    .from(conversations)
    .where(and(eq(conversations.id, idParam), eq(conversations.userId, user.id)))
    .limit(1);

  if (!conversation) {
    return {
      error: Response.json({ error: "not_found", message: "Conversation not found." }, { status: 404 }),
    } as const;
  }
  return { conversation } as const;
}

/** Fetch one of the signed-in user's conversations with its messages. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = await resolveOwnedConversation(id);
  if ("error" in result) return result.error;

  const rows = await db
    .select({ id: messages.id, role: messages.role, content: messages.content, createdAt: messages.createdAt })
    .from(messages)
    .where(eq(messages.conversationId, result.conversation.id))
    .orderBy(asc(messages.createdAt))
    .limit(500);

  return Response.json({ conversation: result.conversation, messages: rows });
}

/** Delete one of the signed-in user's conversations (messages cascade). */
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = await resolveOwnedConversation(id);
  if ("error" in result) return result.error;

  await db.delete(conversations).where(eq(conversations.id, result.conversation.id));
  return Response.json({ ok: true });
}
