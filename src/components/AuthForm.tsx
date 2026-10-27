"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AuthState } from "@/app/actions/auth";

interface AuthFormProps {
  mode: "login" | "register";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p role="alert" className="m-0 rounded-xl border border-coral-200 bg-coral-50 px-3 py-2 text-sm text-coral-700">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className="mt-1 block w-full rounded-xl border border-plum-200 bg-white px-3.5 py-2.5 text-[16px] text-plum-900 shadow-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="mt-1 block w-full rounded-xl border border-plum-200 bg-white px-3.5 py-2.5 text-[16px] text-plum-900 shadow-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:text-sm"
          placeholder={isLogin ? "Your password" : "At least 8 characters"}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "One moment…" : isLogin ? "Sign in" : "Create account"}
      </button>

      <p className="m-0 text-center text-sm text-ink-500">
        {isLogin ? (
          <>
            New here?{" "}
            <Link href="/register" className="font-medium text-brand-700 hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-700 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
