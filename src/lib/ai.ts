import "server-only";

import type { ProviderConfig } from "@/lib/config";
import {
  geminiOverrideKey,
  getFailedGeminiModels,
  markGeminiModelFailed,
  pickGeminiModel,
  setGeminiModelOverride,
} from "@/lib/gemini-models";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type AIErrorKind = "model_unavailable" | "auth" | "rate_limit" | "overloaded" | "other";

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export class AIProviderError extends Error {
  status: number;
  kind: AIErrorKind;
  constructor(message: string, status = 502, kind: AIErrorKind = "other") {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
    this.kind = kind;
  }
}

/**
 * Streams the assistant reply as plain-text deltas.
 * Only the configured provider is contacted; the API key is attached here,
 * on the server, and never returned to the browser.
 */
export async function* streamAssistantReply(
  provider: ProviderConfig,
  systemPrompt: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  if (provider.id === "gemini") {
    yield* streamGemini(provider, systemPrompt, history, signal);
  } else if (provider.id === "anthropic") {
    yield* streamAnthropic(provider, systemPrompt, history, signal);
  } else {
    yield* streamOpenAI(provider, systemPrompt, history, signal);
  }
}

/* ------------------------------------------------------------------ */
/* Google Gemini (Generative Language API, Google AI Studio keys)      */
/* ------------------------------------------------------------------ */

/** `gemini-2.5-flash` → `models/gemini-2.5-flash`; tuned models keep their own prefix. */
export function geminiModelPath(model: string): string {
  return model.startsWith("tunedModels/") ? model : `models/${model}`;
}

const GEMINI_BLOCKING_FINISH_REASONS = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"]);

/**
 * Streams from Gemini. When the owner has not pinned AI_MODEL and Google rejects the
 * model (retired, "not available to new users", not found), we pick another model
 * from this key's model list and retry once — before any text has been streamed.
 */
async function* streamGemini(
  provider: ProviderConfig,
  systemPrompt: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  const overrideKey = geminiOverrideKey(provider.apiKey, provider.baseUrl);
  const attempted = new Set<string>();
  let model = provider.model;
  let overloadRetries = 0;
  let alternatesTried = 0;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    attempted.add(model);
    const stream = streamGeminiOnce(provider, model, systemPrompt, history, signal);
    let first: IteratorResult<string, void>;
    try {
      first = await stream.next(); // HTTP/model errors surface here, before any text is yielded
    } catch (error) {
      if (!(error instanceof AIProviderError) || signal?.aborted) throw error;

      if (error.kind === "overloaded") {
        // Google's capacity spikes are usually brief: back off and retry the same model.
        if (overloadRetries < 2) {
          overloadRetries += 1;
          await sleep(overloadRetries * 1500, signal);
          continue;
        }
        // Still busy: in automatic mode, try another model for this request only.
        if (provider.modelSource === "default" && alternatesTried < 2) {
          alternatesTried += 1;
          const available = await listGeminiModels({ ...provider, model });
          const next = pickGeminiModel(available, [...attempted, ...getFailedGeminiModels(overrideKey)]);
          if (next) {
            console.warn(`[chat] Gemini model "${model}" is under high demand; using "${next}" for this request.`);
            model = next;
            overloadRetries = 0;
            continue;
          }
        }
        throw error;
      }

      if (error.kind === "rate_limit") {
        // Free-tier quotas are per model: in automatic mode, try one alternate for this request.
        if (provider.modelSource === "default" && alternatesTried < 2) {
          alternatesTried += 1;
          const available = await listGeminiModels({ ...provider, model });
          const next = pickGeminiModel(available, [...attempted, ...getFailedGeminiModels(overrideKey)]);
          if (next) {
            console.warn(`[chat] Gemini quota reached on "${model}"; using "${next}" for this request.`);
            model = next;
            continue;
          }
        }
        throw error;
      }

      const canFallback = provider.modelSource === "default" && error.kind === "model_unavailable";
      if (!canFallback) throw error;

      markGeminiModelFailed(overrideKey, model);
      const available = await listGeminiModels({ ...provider, model });
      const next = pickGeminiModel(available, [...attempted, ...getFailedGeminiModels(overrideKey)]);
      if (!next) throw error;
      console.warn(`[chat] Gemini rejected model "${model}"; retrying with "${next}".`);
      setGeminiModelOverride(overrideKey, next, `"${model}" was rejected by Google for this key`);
      model = next;
      continue;
    }

    if (first.done) return;
    yield first.value;
    for await (const delta of { [Symbol.asyncIterator]: () => stream }) yield delta;
    return;
  }
}

async function* streamGeminiOnce(
  provider: ProviderConfig,
  model: string,
  systemPrompt: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  const url = `${provider.baseUrl}/v1beta/${geminiModelPath(model)}:streamGenerateContent?alt=sse`;

  const response = await safeFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": provider.apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: mergeConsecutiveRoles(history).map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      generationConfig: { maxOutputTokens: 4096 },
    }),
    signal,
  });

  await assertOk(response, { ...provider, model });

  let yieldedAny = false;
  for await (const data of readSSE(response)) {
    let json: unknown;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }
    const event = (Array.isArray(json) ? json[0] : json) as {
      error?: { message?: string };
      promptFeedback?: { blockReason?: string };
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string; thought?: boolean }> };
        finishReason?: string;
      }>;
    };

    if (event?.error?.message) {
      throw new AIProviderError(`The AI provider returned an error: ${event.error.message}`);
    }
    if (event?.promptFeedback?.blockReason) {
      throw new AIProviderError(
        `The provider declined to answer this message (reason: ${event.promptFeedback.blockReason}). Try rephrasing it.`,
      );
    }

    const candidate = event?.candidates?.[0];
    for (const part of candidate?.content?.parts ?? []) {
      if (part.thought) continue; // never surface hidden reasoning
      if (typeof part.text === "string" && part.text.length > 0) {
        yieldedAny = true;
        yield part.text;
      }
    }

    const reason = candidate?.finishReason;
    if (reason && GEMINI_BLOCKING_FINISH_REASONS.has(reason) && !yieldedAny) {
      throw new AIProviderError(
        `The reply was stopped by the provider's content filters (reason: ${reason}). Try rephrasing your message.`,
      );
    }
  }
}

/** Lists model IDs that the configured Gemini key can call with generateContent. */
export async function listGeminiModels(provider: ProviderConfig, timeoutMs = 5000): Promise<string[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${provider.baseUrl}/v1beta/models?pageSize=200`, {
      headers: { "x-goog-api-key": provider.apiKey },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
    };
    return (data.models ?? [])
      .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model) => (model.name ?? "").replace(/^models\//, ""))
      .filter((name) => name.length > 0);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/** Picks a short, readable list of chat-capable Gemini models to suggest. */
export function suggestGeminiModels(models: string[], limit = 6): string[] {
  const chat = models.filter(
    (m) => /^(gemini|gemma|learnlm)/i.test(m) && !/(tts|image|audio|embedding|live|computer-use|robotics|banana|omni|veo|imagen|aqa)/i.test(m),
  );
  const stable = chat.filter((m) => !/(preview|exp|latest)/i.test(m)).sort().reverse();
  const rest = chat.filter((m) => !stable.includes(m)).sort().reverse();
  return [...stable, ...rest].slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* OpenAI-compatible (OpenAI, Groq, Mistral, OpenRouter, Ollama, ...)   */
/* ------------------------------------------------------------------ */

async function* streamOpenAI(
  provider: ProviderConfig,
  systemPrompt: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  const response = await safeFetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...history],
    }),
    signal,
  });

  await assertOk(response, provider);

  for await (const data of readSSE(response)) {
    if (data === "[DONE]") return;
    let json: unknown;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }
    const chunk = json as {
      error?: { message?: string };
      choices?: Array<{ delta?: { content?: string | null }; finish_reason?: string | null }>;
    };
    if (chunk.error?.message) {
      throw new AIProviderError(`The AI provider returned an error: ${chunk.error.message}`);
    }
    const delta = chunk.choices?.[0]?.delta?.content;
    if (typeof delta === "string" && delta.length > 0) yield delta;
  }
}

/* ------------------------------------------------------------------ */
/* Anthropic Messages API                                              */
/* ------------------------------------------------------------------ */

async function* streamAnthropic(
  provider: ProviderConfig,
  systemPrompt: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  const response = await safeFetch(`${provider.baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": provider.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 2048,
      stream: true,
      system: systemPrompt,
      messages: mergeConsecutiveRoles(history),
    }),
    signal,
  });

  await assertOk(response, provider);

  for await (const data of readSSE(response)) {
    let json: unknown;
    try {
      json = JSON.parse(data);
    } catch {
      continue;
    }
    const event = json as {
      type?: string;
      delta?: { type?: string; text?: string };
      error?: { message?: string };
    };
    if (event.type === "error") {
      throw new AIProviderError(
        `The AI provider returned an error: ${event.error?.message ?? "unknown error"}`,
      );
    }
    if (event.type === "message_stop") return;
    if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
      const text = event.delta.text;
      if (typeof text === "string" && text.length > 0) yield text;
    }
  }
}

/** Anthropic and Gemini expect alternating roles, starting with "user". */
function mergeConsecutiveRoles(history: ChatMessage[]): ChatMessage[] {
  const merged: ChatMessage[] = [];
  for (const message of history) {
    const last = merged[merged.length - 1];
    if (last && last.role === message.role) {
      last.content = `${last.content}\n\n${message.content}`;
    } else {
      merged.push({ ...message });
    }
  }
  if (merged.length > 0 && merged[0].role !== "user") merged.shift();
  return merged;
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new AIProviderError(
      "Could not reach the AI provider. Check the server's internet connection and the configured base URL.",
      502,
    );
  }
}

async function readErrorDetail(response: Response): Promise<string> {
  try {
    const text = await response.text();
    try {
      const parsedRaw = JSON.parse(text) as unknown;
      const parsed = (Array.isArray(parsedRaw) ? parsedRaw[0] : parsedRaw) as {
        error?: { message?: string } | string;
        message?: string;
      };
      if (typeof parsed?.error === "string") return parsed.error;
      if (parsed?.error?.message) return parsed.error.message;
      if (parsed?.message) return parsed.message;
      return text.slice(0, 300);
    } catch {
      return text.slice(0, 300);
    }
  } catch {
    return "";
  }
}

function classifyGeminiError(status: number, detail: string): AIErrorKind {
  const lower = detail.toLowerCase();
  if (status === 404) return "model_unavailable";
  if (
    (status === 400 || status === 403) &&
    /model name format|no longer available|not available to new users|is not found|not found for api version|not supported for generatecontent|has been retired|deprecated/.test(
      lower,
    )
  ) {
    return "model_unavailable";
  }
  if (status === 401 || status === 403 || lower.includes("api key not valid") || lower.includes("api_key_invalid")) return "auth";
  if (status === 429) return "rate_limit";
  if (status === 503 || /high demand|overloaded|unavailable/.test(lower)) return "overloaded";
  return "other";
}

async function geminiHint(status: number, detail: string, provider: ProviderConfig): Promise<string> {
  const lower = detail.toLowerCase();

  if (status === 400 && lower.includes("model name format")) {
    return (
      `Google rejected the model name "${provider.model}" (unexpected model name format). ` +
      `Set AI_MODEL to a plain Gemini model ID such as gemini-3.8-flash — no "models/" prefix, no slashes.`
    );
  }
  if (classifyGeminiError(status, detail) === "model_unavailable") {
    const available = suggestGeminiModels(await listGeminiModels(provider));
    const list = available.length > 0 ? ` Models your key can use include: ${available.join(", ")}.` : "";
    return `The model "${provider.model}" isn't available to your Google AI Studio key. Set AI_MODEL to a supported model ID (or remove AI_MODEL to let the server choose).${list}`;
  }
  if (status === 400 && (lower.includes("api key not valid") || lower.includes("api_key_invalid"))) {
    return "Google rejected the API key. Create a key at aistudio.google.com/app/apikey and set GEMINI_API_KEY on the server.";
  }
  if (status === 401 || status === 403) {
    return "The Gemini API key was rejected or lacks permission. Check GEMINI_API_KEY and that the Generative Language API is enabled for it.";
  }
  if (status === 429) {
    return "Gemini rate limit or quota reached for this key. Wait a minute and try again, or raise the quota in Google AI Studio.";
  }
  if (classifyGeminiError(status, detail) === "overloaded") {
    return `Google's Gemini service is very busy right now (high demand on ${provider.model}). This is usually brief — please try again in a moment.`;
  }
  if (status >= 500) {
    return "Google's Gemini service is having trouble right now. Please try again in a moment.";
  }
  return "";
}

async function assertOk(response: Response, provider: ProviderConfig): Promise<void> {
  if (response.ok) return;

  const status = response.status;
  const detail = await readErrorDetail(response);

  let hint = "";
  if (provider.id === "gemini") {
    hint = await geminiHint(status, detail, provider);
  } else if (status === 401 || status === 403) {
    hint = "The API key was rejected. Double-check the key in your server environment variables.";
  } else if (status === 404) {
    hint = `The model "${provider.model}" was not found. Set AI_MODEL to a model your account can use.`;
  } else if (status === 429) {
    hint = "The provider is rate-limiting or your account is out of credit. Try again shortly.";
  } else if (status >= 500) {
    hint = "The provider is having trouble right now. Please try again in a moment.";
  }

  const message = [hint, detail ? `Provider said: ${detail}` : ""].filter(Boolean).join(" ");
  let kind: AIErrorKind = "other";
  if (provider.id === "gemini") kind = classifyGeminiError(status, detail);
  else if (status === 404) kind = "model_unavailable";
  else if (status === 401 || status === 403) kind = "auth";
  else if (status === 429) kind = "rate_limit";
  throw new AIProviderError(message || `The AI provider responded with status ${status}.`, 502, kind);
}

/**
 * Server-Sent Events reader. Yields the `data` payload of each event, joining
 * multi-line `data:` fields per the SSE spec (Gemini may pretty-print JSON).
 */
async function* readSSE(response: Response): AsyncGenerator<string, void, undefined> {
  if (!response.body) throw new AIProviderError("The AI provider returned an empty response.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let dataLines: string[] = [];

  const flush = (): string | null => {
    if (dataLines.length === 0) return null;
    const payload = dataLines.join("\n").trim();
    dataLines = [];
    return payload.length > 0 ? payload : null;
  };

  const handleLine = (rawLine: string): string | null => {
    const line = rawLine.replace(/\r$/, "");
    if (line === "") return flush();
    if (line.startsWith("data:")) dataLines.push(line.slice(5).replace(/^ /, ""));
    return null; // `event:`, `id:`, `retry:` and comments are ignored
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const payload = handleLine(buffer.slice(0, newlineIndex));
        buffer = buffer.slice(newlineIndex + 1);
        if (payload !== null) yield payload;
      }
    }

    buffer += decoder.decode();
    if (buffer.length > 0) {
      const payload = handleLine(buffer);
      if (payload !== null) yield payload;
    }
    const tail = flush();
    if (tail !== null) yield tail;
  } finally {
    reader.releaseLock();
  }
}
