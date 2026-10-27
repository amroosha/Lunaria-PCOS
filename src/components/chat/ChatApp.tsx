"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo, LogoMark } from "@/components/Logo";
import type { ChatRequest } from "@/components/chat/ChatProvider";
import { Composer } from "@/components/chat/Composer";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ProviderStatusCard } from "@/components/chat/ProviderStatusCard";
import { SetupInstructions } from "@/components/chat/SetupInstructions";
import { ASSISTANT_NAME, EXAMPLE_QUESTIONS, SITE_NAME } from "@/content/site";
import type { ConversationSummary, ProviderStatus, PublicChatConfig, StreamEvent, UIMessage } from "@/lib/types";

const STORAGE_KEY = "lunaria:conversation:v1";
const NOTICE_KEY = "lunaria:notice-dismissed:v1";

interface ChatAppProps {
  config: PublicChatConfig;
  status: ProviderStatus;
  user: { email: string } | null;
  /** `page` = full-screen /chat route; `drawer` = slide-over panel on content pages. */
  variant?: "page" | "drawer";
  onClose?: () => void;
  /** A request from elsewhere on the page to focus the chat, optionally with a pre-filled question. */
  request?: ChatRequest | null;
  /** Pre-filled question from the URL (full page only). Never sent automatically. */
  initialQuery?: string | null;
}

interface Banner {
  text: string;
  href?: string;
  linkLabel?: string;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isStoredMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.status === "done"
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChatApp({ config, status, user, variant = "page", onClose, request, initialQuery }: ChatAppProps) {
  const historyMode = config.historyEnabled;
  const isDrawer = variant === "drawer";
  const providerHealthy = config.configured && status.state !== "model_unavailable" && status.state !== "key_rejected";

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(true);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const stickToBottomRef = useRef(true);
  const lastRequestNonce = useRef<number>(0);

  /* ------------------------------ hydration & persistence ------------------------------ */

  useEffect(() => {
    try {
      if (localStorage.getItem(NOTICE_KEY) === "1") setNoticeVisible(false);
    } catch {
      /* storage unavailable */
    }

    if (historyMode) {
      setHydrated(true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed.filter(isStoredMessage));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, [historyMode]);

  useEffect(() => {
    if (historyMode || !hydrated) return;
    try {
      const finished = messages.filter((m) => m.status === "done");
      if (finished.length > 0) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(finished));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [messages, historyMode, hydrated]);

  // Pre-filled question from the URL (?q=) — placed in the box, never sent automatically.
  useEffect(() => {
    if (initialQuery) setInput(initialQuery);
  }, [initialQuery]);

  // Requests from "Ask about this" buttons elsewhere on the page.
  useEffect(() => {
    if (!request || request.nonce === lastRequestNonce.current) return;
    lastRequestNonce.current = request.nonce;
    if (request.prompt) setInput(request.prompt);
    const timer = setTimeout(() => textareaRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [request]);

  /* ------------------------------------ scrolling ------------------------------------- */

  useEffect(() => {
    if (!stickToBottomRef.current) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loadingConversation]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
  };

  /* ------------------------------- history mode helpers ------------------------------- */

  const refreshConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { conversations: ConversationSummary[] };
      setConversations(data.conversations);
    } catch {
      /* network hiccup; list will refresh on next action */
    }
  }, []);

  useEffect(() => {
    if (historyMode && !isDrawer) void refreshConversations();
  }, [historyMode, isDrawer, refreshConversations]);

  const openConversation = async (id: string) => {
    abortRef.current?.abort();
    setSidebarOpen(false);
    setBanner(null);
    setActiveId(id);
    setLoadingConversation(true);
    try {
      const res = await fetch(`/api/conversations/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("We couldn't open that conversation.");
      const data = (await res.json()) as { messages: Array<{ id: string; role: "user" | "assistant"; content: string }> };
      setMessages(data.messages.map((m) => ({ id: m.id, role: m.role, content: m.content, status: "done" })));
      stickToBottomRef.current = true;
    } catch (error) {
      setBanner({ text: error instanceof Error ? error.message : "We couldn't open that conversation." });
      setMessages([]);
      setActiveId(null);
    } finally {
      setLoadingConversation(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!window.confirm("Delete this conversation? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (activeId === id) {
        abortRef.current?.abort();
        setMessages([]);
        setActiveId(null);
      }
      await refreshConversations();
    } catch {
      setBanner({ text: "We couldn't delete that conversation. Please try again." });
    }
  };

  const deleteAllConversations = async () => {
    if (!window.confirm("Delete ALL of your saved conversations? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/conversations", { method: "DELETE" });
      if (!res.ok) throw new Error();
      abortRef.current?.abort();
      setMessages([]);
      setActiveId(null);
      setConversations([]);
      setSidebarOpen(false);
    } catch {
      setBanner({ text: "We couldn't delete your conversations. Please try again." });
    }
  };

  /* ------------------------------------ messaging ------------------------------------- */

  const startNewConversation = () => {
    abortRef.current?.abort();
    setMessages([]);
    setActiveId(null);
    setBanner(null);
    setInput("");
    setSidebarOpen(false);
    stickToBottomRef.current = true;
    if (!historyMode) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* storage unavailable */
      }
    }
    textareaRef.current?.focus();
  };

  const send = async (rawText: string, base: UIMessage[] = messages) => {
    const text = rawText.trim();
    if (!text || sending || !config.configured) return;
    if (text.length > config.maxMessageChars) {
      setBanner({ text: `Messages are limited to ${config.maxMessageChars.toLocaleString()} characters.` });
      return;
    }

    setBanner(null);
    const userMessage: UIMessage = { id: uid(), role: "user", content: text, status: "done" };
    const assistantId = uid();
    const history = [...base.filter((m) => m.status === "done"), userMessage];

    setMessages([...history, { id: assistantId, role: "assistant", content: "", status: "streaming" }]);
    setInput("");
    setSending(true);
    stickToBottomRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    const payload = historyMode
      ? { conversationId: activeId ?? undefined, message: text }
      : { messages: history.map(({ role, content }) => ({ role, content })) };

    const progress = { gotText: false, error: null as string | null, unauthorized: false };

    const handleEvent = (event: StreamEvent) => {
      if (event.type === "text") {
        progress.gotText = true;
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.delta } : m)));
      } else if (event.type === "meta") {
        setActiveId(event.conversationId);
      } else if (event.type === "error") {
        progress.error = event.message;
      }
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
        if (res.status === 401) progress.unauthorized = true;
        throw new Error(data.message || `The server responded with status ${res.status}.`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const consume = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
          handleEvent(JSON.parse(trimmed) as StreamEvent);
        } catch {
          /* ignore malformed line */
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(consume);
      }
      consume(buffer);

      if (progress.error) throw new Error(progress.error);

      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, status: "done" } : m)));
    } catch (error) {
      if (controller.signal.aborted) {
        setMessages((prev) =>
          progress.gotText
            ? prev.map((m) => (m.id === assistantId ? { ...m, status: "done" } : m))
            : prev.filter((m) => m.id !== assistantId),
        );
      } else {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, status: "error", error: message } : m)),
        );
        if (progress.unauthorized) {
          setBanner({ text: "Your session has ended.", href: "/login", linkLabel: "Sign in again" });
        }
      }
    } finally {
      setSending(false);
      if (abortRef.current === controller) abortRef.current = null;
      if (historyMode && !isDrawer) void refreshConversations();
    }
  };

  const stop = () => abortRef.current?.abort();

  const retryLast = () => {
    const lastUserIndex = [...messages].map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex === -1) return;
    const text = messages[lastUserIndex].content;
    const base = messages.slice(0, lastUserIndex);
    setMessages(base);
    void send(text, base);
  };

  const dismissNotice = () => {
    setNoticeVisible(false);
    try {
      localStorage.setItem(NOTICE_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  };

  /* -------------------------------------- render -------------------------------------- */

  const lastMessage = messages[messages.length - 1];
  const showEmptyState = hydrated && config.configured && messages.length === 0 && !loadingConversation;

  const statusPill = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        providerHealthy ? "border-sage-200 bg-sage-50 text-sage-700" : "border-coral-200 bg-coral-50 text-coral-700"
      }`}
      title={
        !config.configured
          ? "AI provider not configured"
          : status.state === "model_unavailable"
            ? `The model ${config.model} isn't available to this ${config.providerLabel} key`
            : status.state === "key_rejected"
              ? `${config.providerLabel} rejected the API key`
              : `Connected to ${config.providerLabel} (${config.model})`
      }
    >
      <span className={`h-1.5 w-1.5 rounded-full ${providerHealthy ? "bg-sage-500" : "bg-coral-500"}`} />
      {!config.configured
        ? "Setup needed"
        : status.state === "model_unavailable"
          ? "Check model"
          : status.state === "key_rejected"
            ? "Key rejected"
            : "Online"}
    </span>
  );

  const newChatButton = (
    <button
      type="button"
      onClick={startNewConversation}
      className="inline-flex items-center gap-1.5 rounded-full bg-plum-800 px-3 py-2 text-sm font-medium text-cream-50 shadow-sm transition hover:bg-plum-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 focus-visible:ring-offset-2"
    >
      <PlusIcon />
      <span className={isDrawer ? "" : "hidden sm:inline"}>New chat</span>
      {!isDrawer && <span className="sm:hidden">New</span>}
    </button>
  );

  return (
    <div className={`flex flex-col bg-cream-50 ${isDrawer ? "h-full" : "h-dvh"}`}>
      {/* Top bar */}
      <header className="z-20 shrink-0 border-b border-plum-100/80 bg-cream-50/95 backdrop-blur">
        {isDrawer ? (
          <div className="flex h-16 items-center gap-3 px-4">
            <LogoMark className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-semibold text-plum-900">
                <span className="sm:hidden">Private chat</span>
                <span className="hidden sm:inline">Private chat with {ASSISTANT_NAME}</span>
              </p>
              <p className="m-0 flex items-center gap-2 text-xs text-ink-500">
                {statusPill}
                <span className="hidden sm:inline">General education, not medical advice</span>
              </p>
            </div>
            {newChatButton}
            <Link
              href="/chat"
              className="hidden rounded-full p-2 text-ink-500 transition hover:bg-plum-100/70 hover:text-plum-900 sm:inline-flex"
              aria-label="Open the chat as a full page"
              title="Open as full page"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 4h6v6M20 4l-8 8M10 20H4v-6M4 20l6-6" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-ink-500 transition hover:bg-plum-100/70 hover:text-plum-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <div className="flex h-16 items-center gap-2 px-3 sm:px-4">
            {historyMode && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-full p-2 text-ink-700 hover:bg-plum-100/70 md:hidden"
                aria-label="Open your conversations"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            )}
            <Logo compact />
            <span className="hidden text-sm text-ink-500 md:inline">· Private chat with {ASSISTANT_NAME}</span>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline-flex">{statusPill}</span>
              <Link
                href="/"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-plum-100/70 hover:text-plum-900 sm:inline-flex"
              >
                ← Back to learning
              </Link>
              <Link href="/privacy" className="rounded-full px-2.5 py-2 text-sm font-medium text-ink-700 transition hover:bg-plum-100/70 hover:text-plum-900">
                Privacy
              </Link>
              {newChatButton}
            </div>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        {historyMode && user && !isDrawer && (
          <ConversationSidebar
            conversations={conversations}
            activeId={activeId}
            userEmail={user.email}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSelect={(id) => void openConversation(id)}
            onNew={startNewConversation}
            onDelete={(id) => void deleteConversation(id)}
            onDeleteAll={() => void deleteAllConversations()}
          />
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          {/* Messages */}
          <div ref={scrollRef} onScroll={handleScroll} className="scroll-slim flex-1 overflow-y-auto">
            <div className={`mx-auto flex w-full flex-col gap-4 px-4 py-5 ${isDrawer ? "max-w-2xl" : "max-w-3xl sm:px-6"}`}>
              {noticeVisible && (
                <div className="flex items-start gap-3 rounded-2xl border border-lilac-200 bg-lilac-50/80 px-4 py-3 text-sm text-plum-900">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-plum-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <p className="m-0 flex-1 leading-relaxed">
                    {historyMode ? (
                      <>
                        <strong className="font-semibold">One-to-one and saved to your account only.</strong> Nobody else can see this
                        conversation. Messages are sent to the AI provider{config.providerLabel ? ` (${config.providerLabel})` : ""} to
                        generate replies. You can delete any conversation, or all of them, from the full chat page.{" "}
                      </>
                    ) : (
                      <>
                        <strong className="font-semibold">One-to-one and not stored on our servers.</strong> This conversation lives only in
                        this browser tab and is sent to the AI provider{config.providerLabel ? ` (${config.providerLabel})` : ""} to
                        generate replies. Use <em>New chat</em> or close the tab to erase it.{" "}
                      </>
                    )}
                    <Link href="/privacy" className="font-medium underline underline-offset-2 hover:text-plum-700">
                      Privacy notice
                    </Link>
                  </p>
                  <button
                    type="button"
                    onClick={dismissNotice}
                    className="-m-1 rounded-md p-1 text-plum-600/70 hover:bg-lilac-100 hover:text-plum-900"
                    aria-label="Dismiss privacy note"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}

              {!config.configured && <SetupInstructions />}
              {config.configured && <ProviderStatusCard status={status} config={config} />}

              {loadingConversation && <p className="m-0 py-10 text-center text-sm text-ink-500">Opening conversation…</p>}

              {showEmptyState && (
                <div className="animate-fade-up py-6 text-center sm:py-10">
                  <LogoMark className="mx-auto h-14 w-14" />
                  <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-plum-900 sm:text-3xl">
                    Hello. What would you like to understand better?
                  </h1>
                  <p className="mx-auto mt-2 max-w-md text-ink-700">
                    I can explain PCOS in plain language and help you prepare for an appointment. I can&apos;t diagnose or give personal
                    medical advice — for that, a clinician is the right person.
                  </p>
                  <div className={`mx-auto mt-7 grid gap-2 ${isDrawer ? "max-w-md" : "max-w-xl sm:grid-cols-2"}`}>
                    {EXAMPLE_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void send(question)}
                        className="lift rounded-2xl border border-plum-100 bg-white px-4 py-3 text-left text-sm text-ink-700 shadow-sm hover:border-lilac-300 hover:bg-lilac-50/60 hover:text-plum-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hydrated &&
                !loadingConversation &&
                messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onRetry={message.status === "error" && index === messages.length - 1 && !sending ? retryLast : undefined}
                  />
                ))}
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-plum-100/70 bg-cream-50/95 px-3 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur sm:px-5">
            <div className={`mx-auto w-full ${isDrawer ? "max-w-2xl" : "max-w-3xl"}`}>
              {banner && (
                <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-coral-200 bg-coral-50 px-3 py-2 text-sm text-coral-700">
                  <p className="m-0">
                    {banner.text}{" "}
                    {banner.href && (
                      <Link href={banner.href} className="font-semibold underline underline-offset-2">
                        {banner.linkLabel ?? "Learn more"}
                      </Link>
                    )}
                  </p>
                  <button type="button" onClick={() => setBanner(null)} className="text-coral-700 hover:text-coral-700/70" aria-label="Dismiss">
                    <CloseIcon />
                  </button>
                </div>
              )}

              <Composer
                value={input}
                onChange={setInput}
                onSend={() => void send(input)}
                onStop={stop}
                disabled={!config.configured}
                sending={sending}
                maxChars={config.maxMessageChars}
                placeholder={
                  config.configured
                    ? lastMessage
                      ? "Reply…"
                      : "Ask anything about PCOS…"
                    : "Chat is unavailable until the AI connection is set up."
                }
                textareaRef={textareaRef}
              />
              <p className="mt-2 mb-0 text-center text-[11px] leading-relaxed text-ink-500">
                {SITE_NAME}{" "}offers general education, not medical advice. AI answers can be wrong — please check important points with a
                clinician, and seek urgent care for severe symptoms.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
