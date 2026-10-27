import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { conversations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getChatConfig } from "@/lib/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function guard() {
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
  return { user } as const;
}

/** List the signed-in user's own conversations (never anyone else's). */
export async function GET() {
  const result = await guard();
  if ("error" in result) return result.error;

  const rows = await db
    .select({ id: conversations.id, title: conversations.title, updatedAt: conversations.updatedAt })
    .from(conversations)
    .where(eq(conversations.userId, result.user.id))
    .orderBy(desc(conversations.updatedAt))
    .limit(200);

  return Response.json({ conversations: rows });
}

/** Delete ALL of the signed-in user's conversations and messages. */
export async function DELETE() {
  const result = await guard();
  if ("error" in result) return result.error;

  await db.delete(conversations).where(eq(conversations.userId, result.user.id));
  return Response.json({ ok: true });
}
