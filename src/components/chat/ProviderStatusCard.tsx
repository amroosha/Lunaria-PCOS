import type { ProviderStatus, PublicChatConfig } from "@/lib/types";

function Code({ children }: { children: string }) {
  return (
    <code className="rounded-md bg-plum-900/90 px-1.5 py-0.5 font-mono text-[0.8rem] text-cream-50">{children}</code>
  );
}

/**
 * Owner-facing notice shown when the AI key works but the model setting does not
 * (or the key itself was rejected). Contains only model names — never secrets.
 */
export function ProviderStatusCard({ status, config }: { status: ProviderStatus; config: PublicChatConfig }) {
  if (status.state !== "model_unavailable" && status.state !== "key_rejected") return null;

  const keyProblem = status.state === "key_rejected";
  const envName =
    config.providerLabel === "Google Gemini" ? "GEMINI_API_KEY" : config.providerLabel === "Anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-lg font-semibold text-plum-900">
            {keyProblem ? "The AI key was rejected" : "The AI model setting needs attention"}
          </h2>
          <p className="mt-1 mb-0 text-sm text-ink-700">{status.detail}</p>

          {!keyProblem && status.suggestions.length > 0 && (
            <div className="mt-4">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-500">
                Models available to your key
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {status.suggestions.map((model) => (
                  <li key={model}>
                    <Code>{model}</Code>
                  </li>
                ))}
              </ul>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-plum-900 p-3 font-mono text-[0.8rem] leading-relaxed text-cream-50">{`AI_MODEL=${status.suggestions[0]}`}</pre>
            </div>
          )}

          <p className="mt-4 mb-0 text-xs text-ink-500">
            Edit <Code>.env</Code> locally or the Environment Variables in your hosting dashboard ({envName}
            {keyProblem ? "" : ", AI_MODEL"}), then restart or redeploy. Messages may fail until this is fixed.
          </p>
        </div>
      </div>
    </div>
  );
}
