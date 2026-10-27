"use client";

import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading } from "@/components/site/SourceLinks";
import { APPOINTMENT_QUESTIONS } from "@/content/pcos";

export function AppointmentQuestions() {
  const [groupId, setGroupId] = useState(APPOINTMENT_QUESTIONS[0].id);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [copied, setCopied] = useState(false);

  const group = APPOINTMENT_QUESTIONS.find((g) => g.id === groupId) ?? APPOINTMENT_QUESTIONS[0];

  const selectedList = useMemo(
    () => APPOINTMENT_QUESTIONS.flatMap((g) => g.questions.filter((q) => selected.has(q))),
    [selected],
  );

  const toggle = (question: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });
  };

  const copyList = async () => {
    const text = ["Questions for my appointment:", ...selectedList.map((q, i) => `${i + 1}. ${q}`)].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const chatPrompt =
    selectedList.length > 0
      ? `I'm preparing for an appointment about PCOS. Here are the questions I want to ask:\n${selectedList
          .map((q) => `- ${q}`)
          .join("\n")}\nCan you help me understand what each question is getting at, and suggest anything useful to note down beforehand?`
      : "How can I prepare for an appointment about PCOS, and what is useful to bring?";

  return (
    <section id="appointment" className="relative scroll-mt-24 py-20 sm:py-28" aria-labelledby="appointment-title">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="blob animate-drift-slow absolute top-1/3 right-[-12rem] h-[26rem] w-[26rem] bg-coral-100/60 [animation-delay:-8s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="appointment-title"
            eyebrow="Questions to bring to your appointment"
            title="Walk in with your questions already written down."
            lede="Appointments can be short and it's easy to forget what you meant to ask. Tap the questions that matter to you, then copy your list or ask the chat to help you prepare."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={80}>
            <div role="tablist" aria-label="Question categories" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {APPOINTMENT_QUESTIONS.map((g) => {
                const isActive = g.id === groupId;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setGroupId(g.id)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                      isActive
                        ? "border-plum-700 bg-plum-700 text-cream-50 shadow-sm"
                        : "border-plum-100 bg-white/70 text-ink-700 hover:border-plum-300 hover:text-plum-900"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>

            <div key={group.id} className="animate-fade-up mt-4 rounded-[1.75rem] border border-plum-100 bg-white/80 p-5 shadow-sm sm:p-7">
              <p className="m-0 text-sm text-ink-500">{group.intro}</p>
              <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                {group.questions.map((question) => {
                  const checked = selected.has(question);
                  return (
                    <li key={question}>
                      <button
                        type="button"
                        onClick={() => toggle(question)}
                        aria-pressed={checked}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-[0.95rem] leading-relaxed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                          checked ? "border-sage-300 bg-sage-50 text-plum-950" : "border-plum-100 bg-white text-ink-700 hover:border-plum-300"
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            checked ? "border-sage-600 bg-sage-600 text-white" : "border-plum-300 bg-white"
                          }`}
                          aria-hidden="true"
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </span>
                        {question}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={160} className="lg:sticky lg:top-28">
            <div className="rounded-[1.75rem] border border-plum-200 bg-plum-900 p-6 text-cream-50 shadow-[0_30px_60px_-30px_rgba(33,20,37,0.6)] sm:p-7">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-lilac-300">Your list</p>
              <h3 className="mt-2 font-display text-2xl font-medium">
                {selectedList.length === 0 ? "Nothing chosen yet" : `${selectedList.length} question${selectedList.length === 1 ? "" : "s"}`}
              </h3>
              {selectedList.length === 0 ? (
                <p className="mt-3 text-sm leading-relaxed text-lilac-200/90">
                  Tap questions on the left to build a list you can copy to your notes app or show at the start of your appointment.
                </p>
              ) : (
                <ol className="m-0 mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-cream-100">
                  {selectedList.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyList}
                  disabled={selectedList.length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-plum-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  {copied ? "Copied" : "Copy list"}
                </button>
                {selectedList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected(new Set())}
                    className="rounded-full border border-lilac-300/40 px-4 py-2 text-sm font-medium text-lilac-200 transition hover:bg-white/10"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <AskButton
                  variant="link"
                  prompt={chatPrompt}
                  className="text-lilac-200! hover:text-white!"
                >
                  Ask the chat to help me prepare →
                </AskButton>
              </div>
              <p className="mt-4 mb-0 text-xs leading-relaxed text-lilac-200/70">
                Your list stays on this page; it isn&apos;t saved or sent anywhere unless you copy it or share it with the chat.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
