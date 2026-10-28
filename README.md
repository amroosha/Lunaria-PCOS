# Lunaria ♦ PCOS education with a private, one-to-one AI chat

A modern website with a calm, welcoming AI chatbot. Every visitor gets their own
separate conversation; there are no rooms, member lists, or shareable links. AI
provider keys live only on the server, and nothing is stored unless you — the
site owner — explicitly turn on private chat history.

Built with Next.js (App Router), React, Tailwind CSS, Drizzle ORM and PostgreSQL.

## Features

- Clean chat window with message bubbles, a growing text box, send/stop buttons
  and a one-click **New conversation** action. Works on phones and desktops.
- Streaming replies with Markdown rendering (no raw HTML is ever rendered).
- **Ephemeral mode (default):** conversations live only in the visitor's browser
  tab (`sessionStorage`). The server never writes them anywhere.
- **Private history mode (opt-in):** visitors sign in; each account can list,
  open and delete only its own conversations. Delete-all and delete-account are
  one click away.
- Secure server endpoint (`POST /api/chat`) that forwards the conversation to the
  AI model, keeps each conversation's context separate, and rate-limits abuse.
- Clear setup instructions are shown in the chat when no AI key is configured —
  the bot never pretends to work.
- A short, plain-language privacy notice at `/privacy`.

## 1. Run it locally

```bash
# 1) Install dependencies
npm install

# 2) Configure environment
cp .env.example .env
#    …then edit .env (see "Add your AI API key" below)

# 3) Create the database tables (needed only once, and only used by history mode)
npx drizzle-kit push

# 4) Start the dev server
npm run dev
# → http://localhost:3000
```

You need a PostgreSQL database reachable at `DATABASE_URL`. The default value
matches a local instance (`postgresql://postgres:postgres@127.0.0.1:5432/app_db`).

## 2. Add your AI API key (securely)

Keys are read **only on the server** from environment variables. They are never
bundled into browser code, never returned by any API route, and never prefixed
with `NEXT_PUBLIC_`.

Open `.env` and add **one** of:

```bash
GEMINI_API_KEY=AIza...         # Google Gemini via Google AI Studio (server picks the best model your key offers)
# or
OPENAI_API_KEY=sk-...          # OpenAI  (default model: gpt-4.1-mini)
# or
ANTHROPIC_API_KEY=sk-ant-...   # Anthropic (default model: claude-haiku-4-5)
```

Optional settings:

| Variable            | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `AI_MODEL`          | Override the model id (e.g. `gemini-2.5-pro`, `gpt-4.1`, `claude-sonnet-4-5`). |
| `AI_PROVIDER`       | `gemini`, `openai` or `anthropic` — only needed if several keys are set. |
| `OPENAI_BASE_URL`   | Point at any OpenAI-compatible API (Groq, Mistral, OpenRouter, Ollama). |
| `GEMINI_BASE_URL`   | Only for proxies; defaults to `https://generativelanguage.googleapis.com`. |
| `AI_SYSTEM_PROMPT`  | Customize the assistant's personality.                                  |

Restart `npm run dev` after editing `.env`. The status pill in the chat header
switches from **Setup needed** to **Connected**.

### Gemini notes (Google AI Studio)

- Get a key at <https://aistudio.google.com/app/apikey> and set `GEMINI_API_KEY`
  (`GOOGLE_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` are accepted as aliases).
- The server calls the native API:
  `POST https://generativelanguage.googleapis.com/v1beta/models/<AI_MODEL>:streamGenerateContent?alt=sse`
  with the key in the `x-goog-api-key` header — never in a URL or in browser code.
- Leave `AI_MODEL` unset and the server chooses automatically: it prefers Google's
  current recommendation (`gemini-3.8-flash`), checks it against the models your key
  lists, and if Google rejects a model as retired it switches to another one and
  remembers the choice. Set `AI_MODEL` only when you want to pin a specific model.
- `AI_MODEL` must be a **plain model ID** such as `gemini-3.8-flash`. Values like `models/gemini-3.8-flash`,
  `google/gemini-2.5-flash`, a pasted URL, or an OpenAI model name produce Google's
  `GenerateContentRequest.model: unexpected model name format` / `NOT_FOUND` errors.
  Lunaria normalizes those mistakes (and falls back to automatic selection when the
  value is unusable, logging a `[chat config]` warning on the server).
- On every chat page load the server verifies the model against
  `GET /v1beta/models` for *your* key (cached for 10 minutes). If the model isn't
  available, the chat shows an owner notice listing the model IDs your key can use.
- If you previously pointed `OPENAI_BASE_URL` at `generativelanguage.googleapis.com`
  (Google's OpenAI-compatible layer), Hush detects that and talks to the native
  Gemini API using `OPENAI_API_KEY` as the Gemini key — but `GEMINI_API_KEY` is the
  cleaner setup.

## 3. Choose a privacy mode

| `CHAT_HISTORY_ENABLED` | What happens                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `false` (default)      | No accounts, no storage. The chat lives in the visitor's tab; "New conversation" or closing the tab erases it.    |
| `true`                 | Sign-in required. Conversations are stored per account; every query is scoped to the signed-in user's id.        |

When enabling history mode make sure the tables exist (`npx drizzle-kit push`).
The privacy notice and in-chat banner update automatically to describe the active mode.

## 4. Publish it

### Vercel (simplest)

1. Push the project to GitHub/GitLab/Bitbucket and import it at <https://vercel.com/new>.
2. Add a PostgreSQL database (Vercel Postgres / Neon / Supabase) and copy its connection string.
3. In **Project → Settings → Environment Variables**, add:
   - `DATABASE_URL`
   - `GEMINI_API_KEY` **or** `OPENAI_API_KEY` **or** `ANTHROPIC_API_KEY`
   - optional: `AI_MODEL`, `CHAT_HISTORY_ENABLED`, …
4. Deploy. If you use history mode, run `npx drizzle-kit push` once against the
   production `DATABASE_URL` (from your machine, with the variable exported).

### Any Node host (Railway, Render, Fly.io, a VPS)

```bash
npm ci
npx drizzle-kit push        # once, with DATABASE_URL pointing at production
npm run build
npm run start               # serves on $PORT (default 3000)
```

Set the same environment variables in the host's dashboard or systemd/Docker
environment. Put the app behind HTTPS (the session cookie is marked `Secure`
in production).

> Running several instances? The rate limiter is in-memory per instance. Swap
> `src/lib/rate-limit.ts` for a shared store (e.g. Redis) if you need a global limit.

## Meal photos (if they're missing from a download)

The 27 food photographs for the meal plans live in `public/images/meals/` and
are referenced by path, so the project **builds and runs even if those `.jpg`
files are absent** each photo then falls back to the same image on the Pexels
CDN. To self-host them again (faster, and no third-party dependency), run:

```bash
node scripts/fetch-meal-photos.mjs          # downloads any missing photos
node scripts/fetch-meal-photos.mjs --force  # re-downloads all of them
```

The script reads the photo list from `src/content/meal-photos.ts`, so there is
one source of truth. All photos are Pexels photographs (free licence) and each
meal credits its photographer on the page.

## Project layout

```
src/
  app/
    page.tsx                 Landing page
    chat/page.tsx            Chat (requires sign-in only in history mode)
    privacy/page.tsx         Privacy notice
    login/, register/        Accounts (history mode only)
    actions/auth.ts          Server Actions: register, login, logout, delete account
    api/chat/route.ts        Secure streaming endpoint → AI provider
    api/conversations/       List / read / delete the signed-in user's conversations
  components/chat/           ChatApp, ChatDrawer, MessageBubble, Composer, Sidebar, SetupInstructions
  components/site/           Landing-page sections (Hero, PcosExplainer, SymptomMap, TopicCards, MealPlan, FoodsToAvoid, …)
  content/                   Editorial content: pcos.ts, meals.ts, meal-photos.ts, site.ts
public/images/meals/         Meal photographs (restore with scripts/fetch-meal-photos.mjs)
scripts/fetch-meal-photos.mjs  Downloads missing meal photos from Pexels
  lib/
    config.ts                Reads env vars (server-only), normalizes model IDs, exposes a secret-free public subset
    ai.ts                    Gemini + OpenAI-compatible + Anthropic streaming adapters
    provider-status.ts       Verifies the configured model against the key's model list (cached)
    auth.ts                  scrypt password hashing, hashed session cookies
    rate-limit.ts            In-memory per-IP limiter
  db/schema.ts               users, sessions, conversations, messages (used in history mode)
```

## Privacy guarantees (how they're enforced)

- **Separate conversations:** in ephemeral mode the context never leaves the
  visitor's browser except to be sent for a reply; in history mode every
  conversation row carries a `user_id`, and every read/write filters on it.
- **No sharing surfaces:** there are no room, member, or public-link routes at all.
- **Keys on the server:** `src/lib/config.ts` is marked `server-only`; client
  components receive only `{ configured, providerLabel, model, historyEnabled }`.
- **No silent storage:** the `/api/chat` route only touches the database when
  `CHAT_HISTORY_ENABLED=true` and the request is authenticated.
- **Clear erase paths:** New conversation / close tab (ephemeral), or delete
  conversation / delete all / delete account (history).
