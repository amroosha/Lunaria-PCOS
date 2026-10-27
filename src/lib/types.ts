/** Types shared between server and client. Contains no secrets and no server-only imports. */

export interface PublicChatConfig {
  configured: boolean;
  providerLabel: string | null;
  model: string | null;
  historyEnabled: boolean;
  maxMessageChars: number;
}

/** Result of verifying the configured provider & model against the provider's model list. */
export interface ProviderStatus {
  state: "ok" | "unverified" | "model_unavailable" | "key_rejected" | "not_configured";
  /** Owner-facing explanation (never contains secrets). */
  detail: string | null;
  /** Model IDs the current key can use, when known. */
  suggestions: string[];
}

export type MessageRole = "user" | "assistant";

export interface UIMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: "done" | "streaming" | "error";
  error?: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string;
}

export type StreamEvent =
  | { type: "meta"; conversationId: string; title: string }
  | { type: "text"; delta: string }
  | { type: "error"; message: string }
  | { type: "done" };
