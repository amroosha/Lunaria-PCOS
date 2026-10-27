import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { AskButton } from "@/components/site/AskButton";
import { SiteShell } from "@/components/site/SiteShell";
import { SITE_NAME } from "@/content/site";
import { getPublicChatConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `What ${SITE_NAME}{" "}stores, what it sends to the AI provider, and how to clear your conversation.`,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-plum-100 bg-white/80 p-6 shadow-sm sm:p-8">
      <h2 className="m-0 font-display text-2xl font-medium text-plum-950">{title}</h2>
      <div className="mt-3 space-y-3 text-[0.97rem] leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  const config = getPublicChatConfig();
  const provider = config.providerLabel ?? "the AI provider configured by the site owner";

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-plum-600">Privacy notice</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-plum-950">
          Short, clear, and honest.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">
          {SITE_NAME}{" "}is an educational site with a one-to-one chat between you and an AI assistant. This page explains exactly what is
          stored, where your messages go, and how to erase them.
        </p>

        <div
          className={`mt-8 rounded-2xl border px-4 py-3 text-sm ${
            config.historyEnabled ? "border-sage-200 bg-sage-50 text-plum-900" : "border-plum-100 bg-lilac-50/70 text-plum-900"
          }`}
        >
          <strong className="font-semibold">Current mode on this site: </strong>
          {config.historyEnabled
            ? "Private chat history is ON. Conversations are saved to your account and visible only to you."
            : "Private chat history is OFF. Nothing you type in the chat is stored on our servers."}
        </div>

        <div className="mt-8 space-y-6">
          <Section title="1. Educational, not diagnostic">
            <p>
              The site and the chat provide general information about PCOS and women&apos;s health. They cannot assess you personally,
              diagnose, or recommend treatment. Please talk to a qualified healthcare professional about your own symptoms, tests or
              medicines, and seek urgent care for severe symptoms.
            </p>
          </Section>

          <Section title="2. One visitor, one conversation">
            <p>
              Every visitor has their own separate conversation. There are no group chats, shared rooms, member lists, or public
              conversation links. We never show one visitor another visitor&apos;s messages, identity, or history.
            </p>
          </Section>

          <Section title="3. What is stored">
            {config.historyEnabled ? (
              <>
                <p>
                  Because the site owner has enabled private chat history, you must sign in to chat. We store your email address, a salted
                  hash of your password (never the password itself), a session cookie so you stay signed in, and the conversations you have
                  while signed in.
                </p>
                <p>
                  Each conversation is tied to your account ID. Every request that reads, lists, or deletes conversations checks that the
                  conversation belongs to the signed-in account — so no account can reach another account&apos;s data.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Nothing from the chat is stored on our servers.</strong> Your conversation is kept in your browser&apos;s tab storage
                  (&quot;sessionStorage&quot;) so it survives a page refresh. It is deleted automatically when you close the tab, and
                  immediately when you click <em>New chat</em>.
                </p>
                <p>
                  Each time you send a message, your browser sends the current conversation to our server so the assistant has context. The
                  server forwards it to the AI provider and streams the reply back; it does not write it to a database.
                </p>
              </>
            )}
            <p>
              Two small preferences are kept in your browser&apos;s local storage: whether you dismissed the in-chat privacy note, and your
              motion setting. The &quot;questions for your appointment&quot; list exists only on the page while it is open. No analytics or
              advertising trackers are used.
            </p>
          </Section>

          <Section title="4. Where your messages go">
            <p>
              To generate replies, your messages are sent from our server to <strong>{provider}</strong>
              {config.model ? ` (model: ${config.model})` : ""}. The provider&apos;s own privacy policy and data-handling terms apply to that
              processing, so please avoid sharing details you would not want a third-party service to process. The provider&apos;s API key
              lives only on our server — it is never included in the website code that runs in your browser.
            </p>
            <p>
              To protect the service from abuse, our server keeps a short-lived, in-memory count of requests per network address (about one
              minute). This is never written to disk.
            </p>
          </Section>

          <Section title="5. How to clear your conversation">
            {config.historyEnabled ? (
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>One conversation:</strong> on the full chat page, hover (or tap) a conversation in the sidebar and choose the
                  delete icon.
                </li>
                <li>
                  <strong>Everything:</strong> use <em>Delete all</em> at the bottom of the sidebar.
                </li>
                <li>
                  <strong>Your whole account:</strong> use <em>Delete account</em>. This permanently removes your account, sessions, and every
                  conversation.
                </li>
              </ul>
            ) : (
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Click <strong>New chat</strong> in the chat — this erases the conversation from your browser instantly.
                </li>
                <li>Or simply close the browser tab; the conversation is discarded automatically.</li>
                <li>There is nothing to delete on our side, because nothing was saved.</li>
              </ul>
            )}
          </Section>

          <Section title="6. Good to know">
            <p>
              AI responses can be inaccurate. Please avoid sharing sensitive personal information (such as full names, addresses, or
              identification numbers) in any AI chat, including this one.
            </p>
            <p>
              Questions about this notice? Contact the site owner. This page is updated whenever the way {SITE_NAME}{" "}handles data changes.
            </p>
          </Section>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <AskButton variant="secondary">Open the chat</AskButton>
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 hover:bg-plum-100/70 hover:text-plum-900">
            Back home
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
