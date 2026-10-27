import "server-only";

/**
 * Helpers for choosing a Gemini model that the configured key can actually use.
 * Google retires model IDs over time (e.g. "gemini-2.5-flash is no longer available
 * to new users"), so when the owner has not pinned AI_MODEL we pick from the key's
 * own model list and remember a working choice for the life of the process.
 */

export const GEMINI_PREFERRED_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const NON_CHAT = /(tts|image|audio|embedding|live|computer-use|robotics|banana|omni|veo|imagen|aqa)/i;

export function isChatCapableGeminiModel(id: string): boolean {
  return /^gemini-/i.test(id) && !NON_CHAT.test(id);
}

function versionOf(id: string): number {
  const match = id.match(/^gemini-(\d+(?:\.\d+)?)/i);
  return match ? Number.parseFloat(match[1]) : 0;
}

/** Picks the best general chat model from a key's model list, skipping any in `exclude`. */
export function pickGeminiModel(available: string[], exclude: Iterable<string> = []): string | null {
  const excluded = new Set(exclude);
  const candidates = available.filter((id) => isChatCapableGeminiModel(id) && !excluded.has(id));
  for (const preferred of GEMINI_PREFERRED_MODELS) {
    if (candidates.includes(preferred)) return preferred;
  }
  const score = (id: string) =>
    versionOf(id) * 100 +
    (/flash/i.test(id) ? 10 : 0) -
    (/(preview|exp|latest)/i.test(id) ? 5 : 0) -
    (/lite/i.test(id) ? 3 : 0) -
    (/pro/i.test(id) ? 1 : 0);
  return [...candidates].sort((a, b) => score(b) - score(a))[0] ?? null;
}

/* --------------------------- runtime override store --------------------------- */

interface OverrideState {
  key: string;
  model: string | null;
  failed: Set<string>;
}

const globalForGemini = globalThis as typeof globalThis & { __lunariaGemini?: OverrideState };

function state(key: string): OverrideState {
  const current = globalForGemini.__lunariaGemini;
  if (current && current.key === key) return current;
  const fresh: OverrideState = { key, model: null, failed: new Set() };
  globalForGemini.__lunariaGemini = fresh;
  return fresh;
}

/** Identifies a key+endpoint pair without storing the key itself. */
export function geminiOverrideKey(apiKey: string, baseUrl: string): string {
  return `${baseUrl}|${apiKey.length}|${apiKey.slice(-6)}`;
}

export function getGeminiModelOverride(key: string): string | null {
  return state(key).model;
}

export function getFailedGeminiModels(key: string): string[] {
  return [...state(key).failed];
}

export function markGeminiModelFailed(key: string, model: string): void {
  state(key).failed.add(model);
}

export function setGeminiModelOverride(key: string, model: string, reason: string): void {
  const current = state(key);
  if (current.model === model) return;
  current.model = model;
  console.info(`[chat config] Using Gemini model "${model}" (${reason}). Set AI_MODEL to pin a specific model.`);
}
