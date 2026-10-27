import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { registerAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { getPublicChatConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const config = getPublicChatConfig();
  if (!config.historyEnabled) redirect("/chat");
  if (await getCurrentUser()) redirect("/chat");

  return (
    <AuthCard
      title="Create your account"
      subtitle="This site saves chat history privately, so an account keeps your conversations yours alone."
    >
      <AuthForm mode="register" action={registerAction} />
    </AuthCard>
  );
}
