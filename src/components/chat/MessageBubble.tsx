"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import type { UIMessage } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="rounded-md px-2 py-1 text-xs font-medium text-ink-300 opacity-0 transition group-hover:opacity-100 hover:bg-plum-50 hover:text-ink-700 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label="Copy message"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Assistant is typing">
      <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot" />
      <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot [animation-delay:0.15s]" />
      <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-dot [animation-delay:0.3s]" />
    </span>
  );
}

export function MessageBubble({ message, onRetry }: { message: UIMessage; onRetry?: () => void }) {
  const isUser = message.role === "user";

  if (message.status === "error" && !message.content) {
    return (
      <div className="flex justify-start animate-fade-up">
        <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700 shadow-sm sm:max-w-[75%]">
          <p className="m-0 font-medium">The assistant couldn&apos;t reply.</p>
          <p className="mt-1 mb-0 text-coral-700">{message.error ?? "Something went wrong."}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center rounded-lg bg-coral-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-coral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}>
      <div className={`flex max-w-[88%] flex-col sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={
            isUser
              ? "rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-[0.95rem] leading-relaxed text-white shadow-sm"
              : "rounded-2xl rounded-bl-md border border-plum-100 bg-white px-4 py-3 text-ink-900 shadow-sm"
          }
        >
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap break-words">{message.content}</p>
          ) : message.content ? (
            <div className="prose-chat">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.status === "streaming" && (
                <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-brand-500" aria-hidden="true" />
              )}
            </div>
          ) : (
            <TypingDots />
          )}
        </div>

        {!isUser && message.status === "done" && message.content && (
          <div className="mt-1 flex items-center gap-1">
            <CopyButton text={message.content} />
          </div>
        )}
        {!isUser && message.status === "error" && message.content && (
          <p className="mt-1 mb-0 text-xs text-coral-600">
            Reply was interrupted{message.error ? `: ${message.error}` : "."}
          </p>
        )}
      </div>
    </div>
  );
}
