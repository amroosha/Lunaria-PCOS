function Code({ children }: { children: string }) {
  return (
    <code className="rounded-md bg-plum-900/90 px-1.5 py-0.5 font-mono text-[0.8rem] text-cream-50">{children}</code>
  );
}

function Block({ children }: { children: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-xl bg-plum-900 p-4 font-mono text-[0.8rem] leading-relaxed text-cream-50">
      {children}
    </pre>
  );
}

/**
 * Shown to visitors when no AI provider key is configured on the server.
 * We deliberately do not fake replies — the site owner needs to finish setup.
 */
export function SetupInstructions() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.1-2.1 2.6-2.6z" />
          </svg>
        </span>
        <div>
          <h2 className="m-0 text-lg font-semibold text-plum-900">The AI connection isn&apos;t set up yet</h2>
          <p className="mt-1 mb-0 text-sm text-ink-700">
            Lunaria never pretends to chat. Once the site owner adds an AI provider key on the server, this page turns into a working
            assistant automatically — no code changes needed.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-5 text-sm text-ink-900">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-plum-900 text-xs font-semibold text-white">1</span>
          <div className="min-w-0 flex-1">
            <p className="m-0 font-medium">Get an API key from a provider</p>
            <p className="mt-1 mb-0 text-ink-500">
              Google AI Studio (aistudio.google.com/app/apikey), OpenAI (platform.openai.com) or Anthropic (console.anthropic.com). Any
              OpenAI-compatible API (Groq, Mistral, OpenRouter, a local Ollama server) also works.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-plum-900 text-xs font-semibold text-white">2</span>
          <div className="min-w-0 flex-1">
            <p className="m-0 font-medium">
              Add it to the server environment — never to browser code
            </p>
            <p className="mt-1 mb-0 text-ink-500">
              Locally, put it in the <Code>.env</Code> file at the project root. On a host (Vercel, Railway, Render, Fly…), add it in the
              project&apos;s Environment Variables settings. Use <strong>one</strong> of:
            </p>
            <Block>{`# Google Gemini (AI Studio key)
GEMINI_API_KEY=AIza...

# or OpenAI
OPENAI_API_KEY=sk-...

# or Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# optional — plain model IDs only, e.g. gemini-2.5-flash
AI_MODEL=gemini-2.5-flash      # or gpt-4.1-mini, claude-haiku-4-5 …
OPENAI_BASE_URL=https://...    # for OpenAI-compatible providers`}</Block>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-plum-900 text-xs font-semibold text-white">3</span>
          <div className="min-w-0 flex-1">
            <p className="m-0 font-medium">Restart the server and reload this page</p>
            <p className="mt-1 mb-0 text-ink-500">
              Run <Code>npm run dev</Code> again locally, or redeploy on your host. The status pill at the top will switch to{" "}
              <span className="font-medium text-brand-700">Connected</span>.
            </p>
          </div>
        </li>
      </ol>

      <p className="mt-6 mb-0 rounded-xl bg-white/70 p-3 text-xs text-ink-500">
        Tip: conversations are <strong>not stored</strong> by default. To offer sign-in with private, per-account history, set{" "}
        <Code>CHAT_HISTORY_ENABLED=true</Code>. Details are in the README.
      </p>
    </div>
  );
}
