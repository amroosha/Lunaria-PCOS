import "server-only";

import { geminiOverrideKey, getGeminiModelOverride } from "@/lib/gemini-models";
import type { PublicChatConfig } from "@/lib/types";

export type ProviderId = "openai" | "anthropic" | "gemini";

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  apiKey: string;
  model: string;
  baseUrl: string;
  /** Owner-facing note when AI_MODEL had to be cleaned up (never contains the key). */
  modelWarning: string | null;
  /** "env" when the owner pinned AI_MODEL; "default" when the server may choose/fall back automatically. */
  modelSource: "env" | "default";
}

/**
 * Server-only chat configuration. The resolved API key never leaves this
 * module except to call the AI provider from a route handler.
 */
export interface ChatConfig {
  provider: ProviderConfig | null;
  historyEnabled: boolean;
  systemPrompt: string;
  rateLimitPerMinute: number;
  maxMessageChars: number;
  maxContextMessages: number;
}

const DEFAULT_SYSTEM_PROMPT = [
  "You are the Lunaria guide: a warm, calm educational assistant on a website about women's health and polycystic ovary syndrome (PCOS).",
  "Your purpose is general education in plain language. You are not a clinician and this is not a diagnostic or treatment service.",
  "",
  "How to respond:",
  "- Explain PCOS-related topics (periods and ovulation, androgens, insulin resistance, skin and hair, fertility, mental wellbeing, diagnosis, long-term health checks) clearly and kindly, in short paragraphs or brief lists.",
  "- Be honest about uncertainty: say when evidence is mixed or when something varies from person to person. PCOS affects people differently; never imply everyone has the same symptoms or needs the same approach.",
  "- Encourage the person to discuss personal symptoms, test results, medicines or treatment choices with a qualified healthcare professional (for example a GP, gynaecologist or endocrinologist), and help them prepare good questions for that conversation.",
  "- Do not diagnose, do not say what condition someone has, do not prescribe or dose medicines or supplements, and do not advise starting, stopping or changing any medication.",
  "- If someone describes severe or urgent symptoms (such as severe pelvic or abdominal pain, very heavy bleeding, fainting, fever with pelvic pain, bleeding or pain in pregnancy) or thoughts of self-harm, gently and clearly urge them to seek urgent medical care or contact emergency services or a crisis line now.",
  "- Use respectful, inclusive, non-judgemental language. Avoid shame or body judgement, weight-focused moralising, and unsupported or exaggerated health claims. Do not recommend specific commercial products.",
  "- For questions about food: share general balanced-eating principles (regular meals, fibre-rich and lower-GI carbohydrates, protein, healthy fats, plenty of vegetables and fruit, omega-3 sources) as described by the British Dietetic Association and the NHS Eatwell Guide. Make clear there is no single 'PCOS diet' and no universal list of foods everyone with PCOS must avoid (the 2023 international guideline found no one diet composition better than another); some people choose to limit sugary drinks or highly processed snacks, so offer practical alternatives without shame or strict rules. Do not give calorie targets, portion prescriptions, weight-loss plans, or restrictive or fad diets; do not claim foods or meal plans cure PCOS, 'balance hormones' or cause weight loss; and suggest a registered dietitian for personal advice. Be especially gentle if someone mentions difficult feelings about food or eating.",
  "- When helpful, point to reputable sources such as the World Health Organization PCOS fact sheet, the NHS, the U.S. Office on Women's Health, NICHD, or the 2023 International Evidence-based PCOS Guideline. Never invent studies, statistics, citations or links.",
  "- Keep answers focused and reasonably brief. Use Markdown sparingly: short lists and bold for emphasis only.",
].join("\n");

export const DEFAULT_MODELS: Record<ProviderId, string> = {
  openai: "gpt-4.1-mini",
  anthropic: "claude-haiku-4-5",
  gemini: "gemini-3.8-flash",
};

export const GEMINI_HOST = "generativelanguage.googleapis.com";
const GEMINI_DEFAULT_BASE = `https://${GEMINI_HOST}`;

/** Gemini model IDs are plain tokens such as `gemini-2.5-flash` (optionally `tunedModels/<id>`). */
const GEMINI_MODEL_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function env(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function firstEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return undefined;
}

function positiveInt(name: string, fallback: number): number {
  const raw = env(name);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Turns whatever the owner typed into the plain model ID the Gemini API expects.
 *
 * The Gemini REST API builds the request as `models/{id}:generateContent`. Passing
 * `models/gemini-2.5-flash`, `google/gemini-2.5-flash`, a pasted URL, quotes or an
 * OpenAI model name produces the cryptic
 * `GenerateContentRequest.model: unexpected model name format` error. We clean the
 * common mistakes up here and fall back to a known-good default when the value is
 * unusable, reporting what happened so the owner can correct it.
 */
export function normalizeGeminiModel(
  raw: string | undefined,
): { model: string; warning: string | null; usedFallback: boolean } {
  const fallback = DEFAULT_MODELS.gemini;
  if (!raw) return { model: fallback, warning: null, usedFallback: true };

  let value = raw.trim().replace(/^['"`]+|['"`]+$/g, "").trim();

  // A full endpoint URL was pasted: keep only the path.
  if (value.includes("://")) {
    try {
      value = new URL(value).pathname;
    } catch {
      /* fall through and treat as a plain string */
    }
  }

  // Drop query strings and RPC method suffixes such as ":streamGenerateContent".
  value = value.split(/[?#]/)[0].replace(/:[A-Za-z]+$/, "");

  const segments = value
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  let model: string;
  const tunedIndex = segments.lastIndexOf("tunedModels");
  if (tunedIndex !== -1 && segments[tunedIndex + 1]) {
    model = `tunedModels/${segments[tunedIndex + 1]}`;
  } else {
    // Handles "models/x", "google/x", "gemini/x", "v1beta/models/x", "models/models/x" …
    model = segments[segments.length - 1] ?? "";
  }

  const bareId = model.replace(/^tunedModels\//, "");
  if (!GEMINI_MODEL_ID_RE.test(bareId)) {
    return {
      model: fallback,
      usedFallback: true,
      warning:
        `AI_MODEL="${raw}" is not a valid Gemini model ID, so a default is being used instead. ` +
        `Set AI_MODEL to a plain ID such as "gemini-3.8-flash" (no "models/" prefix, no slashes or spaces).`,
    };
  }

  // Values like "gpt-4.1-mini" are syntactically fine but belong to another provider.
  const looksForeign = /^(gpt-|o[1-9]|chatgpt|claude-|llama|mistral|mixtral)/i.test(bareId);
  if (looksForeign) {
    return {
      model: fallback,
      usedFallback: true,
      warning:
        `AI_MODEL="${raw}" is not a Gemini model, so a default is being used for the Gemini API. ` +
        `Set AI_MODEL to a Gemini model ID (for example "gemini-3.8-flash") or remove it.`,
    };
  }

  return {
    model,
    usedFallback: false,
    warning:
      model !== raw.trim()
        ? `AI_MODEL="${raw}" was normalized to "${model}" for the Gemini API. Consider setting AI_MODEL=${model} directly.`
        : null,
  };
}

const warnedModelMessages = new Set<string>();
function warnOnce(message: string) {
  if (warnedModelMessages.has(message)) return;
  warnedModelMessages.add(message);
  console.warn(`[chat config] ${message}`);
}

function geminiProvider(apiKey: string, model: string | undefined, baseUrl: string): ProviderConfig {
  const normalized = normalizeGeminiModel(model);
  if (normalized.warning) warnOnce(normalized.warning);
  const cleanBase = stripTrailingSlash(baseUrl);
  const modelSource = normalized.usedFallback ? "default" : "env";
  // In default mode the server may have discovered a better model for this key at runtime.
  const override = modelSource === "default" ? getGeminiModelOverride(geminiOverrideKey(apiKey, cleanBase)) : null;
  return {
    id: "gemini",
    label: "Google Gemini",
    apiKey,
    model: override ?? normalized.model,
    baseUrl: cleanBase,
    modelWarning: normalized.warning,
    modelSource,
  };
}

function resolveProvider(): ProviderConfig | null {
  const openaiKey = env("OPENAI_API_KEY");
  const anthropicKey = env("ANTHROPIC_API_KEY");
  const geminiKey = firstEnv("GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY");
  const forced = env("AI_PROVIDER")?.toLowerCase();
  const model = env("AI_MODEL");

  const openaiBaseUrl = stripTrailingSlash(env("OPENAI_BASE_URL") ?? "https://api.openai.com/v1");
  const geminiBaseUrl = env("GEMINI_BASE_URL") ?? GEMINI_DEFAULT_BASE;

  // OPENAI_BASE_URL pointed at Google's OpenAI-compatible layer: talk to the native
  // Gemini API instead, which has far clearer model naming and error messages.
  const openaiTargetsGemini = hostOf(openaiBaseUrl) === GEMINI_HOST;

  let id: ProviderId | null = null;
  if (forced === "gemini" || forced === "google") {
    if (geminiKey || (openaiTargetsGemini && openaiKey)) id = "gemini";
  } else if (forced === "openai" && openaiKey) {
    id = openaiTargetsGemini ? "gemini" : "openai";
  } else if (forced === "anthropic" && anthropicKey) {
    id = "anthropic";
  } else if (geminiKey) {
    id = "gemini";
  } else if (openaiKey) {
    id = openaiTargetsGemini ? "gemini" : "openai";
  } else if (anthropicKey) {
    id = "anthropic";
  }

  if (!id) return null;

  if (id === "gemini") {
    const key = geminiKey ?? (openaiKey as string);
    return geminiProvider(key, model, geminiBaseUrl);
  }

  if (id === "openai") {
    const isOfficial = openaiBaseUrl.startsWith("https://api.openai.com");
    return {
      id,
      label: isOfficial ? "OpenAI" : "OpenAI-compatible API",
      apiKey: openaiKey as string,
      model: model ?? DEFAULT_MODELS.openai,
      baseUrl: openaiBaseUrl,
      modelWarning: null,
      modelSource: model ? "env" : "default",
    };
  }

  return {
    id,
    label: "Anthropic",
    apiKey: anthropicKey as string,
    model: model ?? DEFAULT_MODELS.anthropic,
    baseUrl: stripTrailingSlash(env("ANTHROPIC_BASE_URL") ?? "https://api.anthropic.com"),
    modelWarning: null,
    modelSource: model ? "env" : "default",
  };
}

export function getChatConfig(): ChatConfig {
  return {
    provider: resolveProvider(),
    historyEnabled: env("CHAT_HISTORY_ENABLED")?.toLowerCase() === "true",
    systemPrompt: env("AI_SYSTEM_PROMPT") ?? DEFAULT_SYSTEM_PROMPT,
    rateLimitPerMinute: positiveInt("CHAT_RATE_LIMIT_PER_MINUTE", 20),
    maxMessageChars: positiveInt("CHAT_MAX_MESSAGE_CHARS", 4000),
    maxContextMessages: positiveInt("CHAT_MAX_CONTEXT_MESSAGES", 30),
  };
}

export function getPublicChatConfig(): PublicChatConfig {
  const config = getChatConfig();
  return {
    configured: config.provider !== null,
    providerLabel: config.provider?.label ?? null,
    model: config.provider?.model ?? null,
    historyEnabled: config.historyEnabled,
    maxMessageChars: config.maxMessageChars,
  };
}
