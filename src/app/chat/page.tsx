import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ChatApp } from "@/components/chat/ChatApp";
import { getCurrentUser } from "@/lib/auth";
import { getPublicChatConfig } from "@/lib/config";
import { getProviderStatus } from "@/lib/provider-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat",
  description: "A private, one-to-one conversation about PCOS and women's health. General education, not medical advice.",
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  // Only non-secret configuration is passed to the browser.
  const config = getPublicChatConfig();

  let user: { email: string } | null = null;
  if (config.historyEnabled) {
    // History mode: conversations are saved, so sign-in is required.
    const current = await getCurrentUser();
    if (!current) redirect("/login?next=/chat");
    user = { email: current.email };
  }

  const [status, params] = await Promise.all([getProviderStatus(), searchParams]);
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuery = typeof rawQuery === "string" ? rawQuery.slice(0, 1000) : null;

  return <ChatApp config={config} status={status} user={user} variant="page" initialQuery={initialQuery} />;
}
