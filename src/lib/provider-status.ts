import "server-only";

import { listGeminiModels, suggestGeminiModels } from "@/lib/ai";
import { getChatConfig, type ProviderConfig } from "@/lib/config";
import { geminiOverrideKey, getFailedGeminiModels, pickGeminiModel, setGeminiModelOverride } from "@/lib/gemini-models";
import type { ProviderStatus } from "@/lib/types";

/**
 * Verifies the configured provider/model once and caches the result for a while.
 * Only non-secret, owner-facing information is produced (model names, hints).
 */

const OK_TTL_MS = 10 * 60_000;
const PROBLEM_TTL_MS = 60_000;

const globalForStatus = globalThis as typeof globalThis & {
  __hushProviderStatus?: { key: string; value: ProviderStatus; expiresAt: number };
};

function cacheKey(provider: ProviderConfig): string {
  return `${provider.id}|${provider.baseUrl}|${provider.model}|${provider.apiKey.length}|${provider.apiKey.slice(-4)}`;
}

async function fetchJson(url: string, headers: Record<string, string>, timeoutMs = 5000): Promise<{ status: number; json: unknown } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers, signal: controller.signal, cache: "no-store" });
    let json: unknown = null;
    try {
      json = await response.json();
    } catch {
      json = null;
    }
    return { status: response.status, json };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function checkGemini(provider: ProviderConfig): Promise<ProviderStatus> {
  if (provider.model.startsWith("tunedModels/")) return { state: "unverified", detail: null, suggestions: [] };

  const probe = await fetchJson(`${provider.baseUrl}/v1beta/models?pageSize=1`, { "x-goog-api-key": provider.apiKey });
  if (!probe) return { state: "unverified", detail: null, suggestions: [] };

  if (probe.status === 400 || probe.status === 401 || probe.status === 403) {
    const message = ((probe.json as { error?: { message?: string } } | null)?.error?.message ?? "").toLowerCase();
    if (probe.status !== 400 || message.includes("api key")) {
      return {
        state: "key_rejected",
        detail: "Google rejected the Gemini API key. Create a key at aistudio.google.com/app/apikey and set GEMINI_API_KEY on the server.",
        suggestions: [],
      };
    }
  }
  if (probe.status !== 200) return { state: "unverified", detail: null, suggestions: [] };

  const models = await listGeminiModels(provider);
  if (models.length === 0) return { state: "unverified", detail: null, suggestions: [] };

  if (provider.modelSource === "default") {
    // The owner hasn't pinned a model: choose the best one this key can use.
    const key = geminiOverrideKey(provider.apiKey, provider.baseUrl);
    const pick = pickGeminiModel(models, getFailedGeminiModels(key));
    if (pick && pick !== provider.model) setGeminiModelOverride(key, pick, "preferred model available to this key");
    return { state: "ok", detail: provider.modelWarning, suggestions: [] };
  }

  if (models.includes(provider.model)) {
    return { state: "ok", detail: provider.modelWarning, suggestions: [] };
  }
  const suggestions = suggestGeminiModels(models);
  return {
    state: "model_unavailable",
    detail:
      `The model "${provider.model}" isn't available to this Google AI Studio key. ` +
      `Set AI_MODEL to one of the models below, then restart or redeploy.`,
    suggestions,
  };
}

async function checkOpenAI(provider: ProviderConfig): Promise<ProviderStatus> {
  const probe = await fetchJson(`${provider.baseUrl}/models`, { Authorization: `Bearer ${provider.apiKey}` });
  if (!probe) return { state: "unverified", detail: null, suggestions: [] };
  if (probe.status === 401 || probe.status === 403) {
    return { state: "key_rejected", detail: "The provider rejected OPENAI_API_KEY. Check the key in your server environment variables.", suggestions: [] };
  }
  if (probe.status !== 200) return { state: "unverified", detail: null, suggestions: [] };

  const ids = ((probe.json as { data?: Array<{ id?: string }> } | null)?.data ?? [])
    .map((m) => m.id ?? "")
    .filter(Boolean);
  if (ids.length === 0 || ids.includes(provider.model)) return { state: "ok", detail: null, suggestions: [] };

  const suggestions = ids.filter((id) => /^(gpt|o[1-9]|chatgpt)/i.test(id) && !/(audio|realtime|tts|transcribe|image|embedding|moderation|search)/i.test(id)).sort().reverse().slice(0, 6);
  return {
    state: "model_unavailable",
    detail: `The model "${provider.model}" isn't available to this ${provider.label} key. Set AI_MODEL to a model your account can use.`,
    suggestions: suggestions.length > 0 ? suggestions : ids.slice(0, 6),
  };
}

async function checkAnthropic(provider: ProviderConfig): Promise<ProviderStatus> {
  const probe = await fetchJson(`${provider.baseUrl}/v1/models?limit=100`, {
    "x-api-key": provider.apiKey,
    "anthropic-version": "2023-06-01",
  });
  if (!probe) return { state: "unverified", detail: null, suggestions: [] };
  if (probe.status === 401 || probe.status === 403) {
    return { state: "key_rejected", detail: "Anthropic rejected ANTHROPIC_API_KEY. Check the key in your server environment variables.", suggestions: [] };
  }
  if (probe.status !== 200) return { state: "unverified", detail: null, suggestions: [] };

  const ids = ((probe.json as { data?: Array<{ id?: string }> } | null)?.data ?? []).map((m) => m.id ?? "").filter(Boolean);
  // Aliases such as "claude-haiku-4-5" resolve to dated snapshots like "claude-haiku-4-5-20251001".
  const matches = ids.some((id) => id === provider.model || id.startsWith(`${provider.model}-`));
  if (ids.length === 0 || matches) return { state: "ok", detail: null, suggestions: [] };
  return {
    state: "model_unavailable",
    detail: `The model "${provider.model}" isn't available to this Anthropic key. Set AI_MODEL to a model your account can use.`,
    suggestions: ids.slice(0, 6),
  };
}

export async function getProviderStatus(): Promise<ProviderStatus> {
  const { provider } = getChatConfig();
  if (!provider) return { state: "not_configured", detail: null, suggestions: [] };

  const key = cacheKey(provider);
  const cached = globalForStatus.__hushProviderStatus;
  if (cached && cached.key === key && cached.expiresAt > Date.now()) return cached.value;

  let value: ProviderStatus;
  try {
    if (provider.id === "gemini") value = await checkGemini(provider);
    else if (provider.id === "anthropic") value = await checkAnthropic(provider);
    else value = await checkOpenAI(provider);
  } catch {
    value = { state: "unverified", detail: null, suggestions: [] };
  }

  if (value.state === "ok" && provider.modelWarning) value = { ...value, detail: provider.modelWarning };

  globalForStatus.__hushProviderStatus = {
    key,
    value,
    expiresAt: Date.now() + (value.state === "ok" ? OK_TTL_MS : PROBLEM_TTL_MS),
  };
  return value;
}
