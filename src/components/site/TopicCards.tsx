"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading, SourceLinks } from "@/components/site/SourceLinks";
import { TOPICS, type Topic } from "@/content/pcos";

const TONES: Record<Topic["tone"], { bg: string; icon: string; ring: string }> = {
  lilac: { bg: "from-lilac-100/90 to-white", icon: "bg-lilac-200 text-plum-800", ring: "border-lilac-200" },
  plum: { bg: "from-plum-100/90 to-white", icon: "bg-plum-200 text-plum-900", ring: "border-plum-200" },
  coral: { bg: "from-coral-100/80 to-white", icon: "bg-coral-100 text-coral-700", ring: "border-coral-200" },
  sage: { bg: "from-sage-100/90 to-white", icon: "bg-sage-200 text-sage-700", ring: "border-sage-200" },
  mist: { bg: "from-lilac-50 to-sage-50", icon: "bg-white text-plum-700", ring: "border-plum-100" },
  cream: { bg: "from-cream-200/90 to-white", icon: "bg-cream-200 text-plum-800", ring: "border-cream-300" },
};

function TopicIcon({ id }: { id: Topic["id"] }) {
  const common = { className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "periods":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "hormones":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M4 14c3-6 6-6 8 0s5 6 8 0" />
          <path d="M4 8c3 4 6 4 8 0s5-4 8 0" opacity="0.5" />
        </svg>
      );
    case "skin-hair":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 3c3.5 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 8.5 7 12 3Z" />
        </svg>
      );
    case "fertility":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 20c-5-3-8-6.5-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 3.5-3 7-8 10Z" />
        </svg>
      );
    case "wellbeing":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9 10h.01M15 10h.01" strokeWidth="2.4" />
        </svg>
      );
    case "diagnosis":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M9 4h6M10 4v4l-4 9a3 3 0 0 0 2.7 4h6.6A3 3 0 0 0 18 17l-4-9V4" />
          <path d="M8.5 14h7" />
        </svg>
      );
  }
}

export function TopicCards() {
  const [openId, setOpenId] = useState<Topic["id"] | null>(null);

  return (
    <section id="topics" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="topics-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="topics-title"
            eyebrow="Explore by topic"
            title="Six places people usually start."
            lede="Open a card for the key points, the sources behind them, and a ready-made question for the chat."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic, index) => {
            const tone = TONES[topic.tone];
            const isOpen = openId === topic.id;
            return (
              <Reveal key={topic.id} delay={(index % 3) * 90} className={isOpen ? "sm:col-span-2 lg:col-span-3" : ""}>
                <article
                  className={`lift flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-br ${tone.bg} ${tone.ring} shadow-sm`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : topic.id)}
                    aria-expanded={isOpen}
                    aria-controls={`topic-${topic.id}`}
                    className="flex w-full flex-1 items-start gap-4 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 focus-visible:ring-inset sm:p-7"
                  >
                    <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.icon}`}>
                      <TopicIcon id={topic.id} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl font-medium text-plum-950">{topic.title}</span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-ink-700">{topic.teaser}</span>
                    </span>
                    <span
                      className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-plum-200 bg-white/80 text-plum-700 transition-transform ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div id={`topic-${topic.id}`} className="animate-fade-up border-t border-white/70 bg-white/70 px-6 pt-5 pb-6 sm:px-7">
                      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
                        {topic.points.map((point) => (
                          <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400" aria-hidden="true" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <SourceLinks ids={topic.sources} />
                        <AskButton variant="ghost" prompt={topic.askPrompt}>
                          Ask the chat about this
                        </AskButton>
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
