"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface ChatRequest {
  /** Optional question to pre-fill in the composer. */
  prompt?: string;
  /** Increments so repeated requests with the same prompt are still applied. */
  nonce: number;
}

interface ChatContextValue {
  open: boolean;
  request: ChatRequest | null;
  openChat: (prompt?: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<ChatRequest | null>(null);

  const openChat = useCallback((prompt?: string) => {
    setRequest((prev) => ({ prompt, nonce: (prev?.nonce ?? 0) + 1 }));
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, request, openChat, closeChat }), [open, request, openChat, closeChat]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/** Returns null when rendered outside a ChatProvider (e.g. on the full-page chat). */
export function useChatLauncher(): ChatContextValue | null {
  return useContext(ChatContext);
}
