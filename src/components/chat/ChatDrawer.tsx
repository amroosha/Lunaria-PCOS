"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";

import { ChatApp } from "@/components/chat/ChatApp";
import { useChatLauncher } from "@/components/chat/ChatProvider";
import { LogoMark } from "@/components/Logo";
import type { ProviderStatus, PublicChatConfig } from "@/lib/types";

interface ChatDrawerProps {
  config: PublicChatConfig;
  status: ProviderStatus;
  user: { email: string } | null;
}

/** Slide-over chat panel: full-screen on phones, a right-hand column on desktop. */
export function ChatDrawer({ config, status, user }: ChatDrawerProps) {
  const launcher = useChatLauncher();
  const open = launcher?.open ?? false;
  const closeChat = launcher?.closeChat;
  const close = useCallback(() => closeChat?.(), [closeChat]);

  // Lock page scroll and support Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!launcher || !open) return null;

  const needsSignIn = config.historyEnabled && !user;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Private chat">
      <button
        type="button"
        onClick={close}
        className="absolute inset-0 bg-plum-950/40 backdrop-blur-[2px] transition-opacity"
        aria-label="Close chat"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col overflow-hidden bg-cream-50 shadow-[-24px_0_60px_-30px_rgba(33,20,37,0.5)] sm:w-[34rem] sm:rounded-l-[2rem] sm:border-l sm:border-plum-100 animate-fade-up">
        {needsSignIn ? (
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-plum-100/80 px-4">
              <div className="flex items-center gap-3">
                <LogoMark className="h-9 w-9" />
                <p className="m-0 text-sm font-semibold text-plum-900">Private chat</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-ink-500 transition hover:bg-plum-100/70 hover:text-plum-900"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <h2 className="m-0 font-display text-2xl font-semibold text-plum-900">Sign in to chat</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-700">
                This site saves chat history privately to your account, so a sign-in keeps your conversations yours alone.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/login?next=/chat" className="rounded-full bg-plum-700 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-plum-800">
                  Sign in
                </Link>
                <Link href="/register" className="rounded-full border border-plum-200 bg-white px-5 py-2.5 text-sm font-medium text-plum-800 hover:border-plum-300">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ChatApp config={config} status={status} user={user} variant="drawer" onClose={close} request={launcher.request} />
        )}
      </div>
    </div>
  );
}
