"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  normalizeEmail,
  validatePassword,
  verifyPassword,
} from "@/lib/auth";
import { getChatConfig } from "@/lib/config";

export interface AuthState {
  error?: string;
}

const GENERIC_LOGIN_ERROR = "That email and password combination didn't match.";

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!getChatConfig().historyEnabled) redirect("/chat");

  const email = normalizeEmail(formData.get("email"));
  const password = validatePassword(formData.get("password"));
  if (!email) return { error: "Please enter a valid email address." };
  if (!password) return { error: "Passwords must be between 8 and 200 characters." };

  try {
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return { error: "An account with this email already exists. Try signing in." };

    const passwordHash = await hashPassword(password);
    const [created] = await db.insert(users).values({ email, passwordHash }).returning({ id: users.id });
    await createSession(created.id);
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === "23505") return { error: "An account with this email already exists. Try signing in." };
    console.error("[auth] register failed:", error);
    return { error: "We couldn't create your account right now. Please try again." };
  }

  redirect("/chat");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!getChatConfig().historyEnabled) redirect("/chat");

  const email = normalizeEmail(formData.get("email"));
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  if (!email || !password) return { error: GENERIC_LOGIN_ERROR };

  try {
    const [user] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const ok = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !ok) return { error: GENERIC_LOGIN_ERROR };

    await createSession(user.id);
  } catch (error) {
    console.error("[auth] login failed:", error);
    return { error: "We couldn't sign you in right now. Please try again." };
  }

  redirect("/chat");
}

export async function logoutAction(): Promise<void> {
  try {
    await destroySession();
  } catch (error) {
    console.error("[auth] logout failed:", error);
  }
  redirect("/");
}

/** Permanently deletes the account and, via cascade, every conversation and message. */
export async function deleteAccountAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    try {
      await db.delete(users).where(eq(users.id, user.id));
      await destroySession();
    } catch (error) {
      console.error("[auth] delete account failed:", error);
    }
  }
  redirect("/");
}
