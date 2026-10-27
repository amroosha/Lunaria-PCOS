"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  disabled: boolean;
  sending: boolean;
  maxChars: number;
  placeholder: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function Composer({ value, onChange, onSend, onStop, disabled, sending, maxChars, placeholder, textareaRef }: ComposerProps) {
  const coarsePointer = useRef(false);

  useEffect(() => {
    coarsePointer.current = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // Auto-grow the textarea up to ~7 lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value, textareaRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Desktop: Enter sends, Shift+Enter adds a new line. Touch devices: Enter adds a new line.
    if (event.key === "Enter" && !event.shiftKey && !coarsePointer.current && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (!sending) onSend();
    }
  };

  const remaining = maxChars - value.length;
  const canSend = value.trim().length > 0 && remaining >= 0 && !disabled && !sending;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (sending) onStop();
        else onSend();
      }}
      className="rounded-3xl border border-plum-100 bg-white p-2 shadow-[0_8px_30px_rgba(28,25,23,0.08)] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-200"
    >
      <div className="flex items-end gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          autoComplete="off"
          className="scroll-slim max-h-[180px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[16px] leading-relaxed text-plum-900 placeholder:text-ink-300 focus:outline-none disabled:cursor-not-allowed disabled:text-ink-300 sm:text-[0.95rem]"
        />
        {sending ? (
          <button
            type="submit"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-plum-900 text-white transition hover:bg-ink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 focus-visible:ring-offset-2"
            aria-label="Stop generating"
            title="Stop generating"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-plum-100 disabled:text-ink-300 disabled:shadow-none"
            aria-label="Send message"
            title="Send"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between px-3 pb-1 pt-1 text-[11px] text-ink-300">
        <span className="hidden sm:inline">Enter to send · Shift+Enter for a new line</span>
        <span className="sm:hidden">Tap the arrow to send</span>
        {remaining < 400 && (
          <span className={remaining < 0 ? "font-medium text-coral-600" : ""}>
            {remaining.toLocaleString()} left
          </span>
        )}
      </div>
    </form>
  );
}
