import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { getPublicChatConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const config = getPublicChatConfig();
  if (!config.historyEnabled) redirect("/chat");
  if (await getCurrentUser()) redirect("/chat");

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue your private conversations.">
      <AuthForm mode="login" action={loginAction} />
    </AuthCard>
  );
}
