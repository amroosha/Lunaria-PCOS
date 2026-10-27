"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useChatLauncher } from "@/components/chat/ChatProvider";

type Variant = "primary" | "secondary" | "ghost" | "link";

const VARIANTS: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-plum-700 px-6 py-3.5 text-base font-semibold text-cream-50 shadow-[0_14px_34px_-12px_rgba(85,59,91,0.6)] transition hover:bg-plum-800 hover:shadow-[0_18px_40px_-12px_rgba(85,59,91,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-plum-700 px-4 py-2 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-plum-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 focus-visible:ring-offset-2",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-plum-200 bg-white/70 px-4 py-2 text-sm font-medium text-plum-800 transition hover:border-plum-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400",
  link: "inline-flex items-center gap-1.5 text-sm font-semibold text-plum-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 rounded",
};

function ChatIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.4-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

interface AskButtonProps {
  prompt?: string;
  variant?: Variant;
  className?: string;
  children?: ReactNode;
  icon?: boolean;
}

/**
 * Opens the chat drawer when one is mounted on the page; otherwise navigates to /chat.
 * The pre-filled prompt is only placed in the text box — it is never sent automatically.
 */
export function AskButton({ prompt, variant = "primary", className = "", children, icon = true }: AskButtonProps) {
  const launcher = useChatLauncher();
  const classes = `${VARIANTS[variant]} ${className}`;
  const label = children ?? "Ask a question";

  if (!launcher) {
    const href = prompt ? `/chat?q=${encodeURIComponent(prompt)}` : "/chat";
    return (
      <Link href={href} className={classes}>
        {icon && <ChatIcon />}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => launcher.openChat(prompt)} className={classes}>
      {icon && <ChatIcon />}
      {label}
    </button>
  );
}
