"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading, SourceLinks } from "@/components/site/SourceLinks";
import { SYMPTOM_HOTSPOTS } from "@/content/pcos";

function Silhouette() {
  return (
    <svg viewBox="0 0 200 460" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="body-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe8f6" />
          <stop offset="55%" stopColor="#f7f3fb" />
          <stop offset="100%" stopColor="#fdfbf7" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="42" r="32" fill="url(#body-fill)" stroke="#cdbbe2" strokeWidth="1.4" />
      <path
        d="M86 78c0 14-16 18-30 26-20 12-22 46-16 86 4 25 6 50 4 78-2 32 12 62 16 92 3 24 0 60-2 90h84c-2-30-5-66-2-90 4-30 18-60 16-92-2-28 0-53 4-78 6-40 4-74-16-86-14-8-30-12-30-26Z"
        fill="url(#body-fill)"
        stroke="#cdbbe2"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* soft inner contour lines for a hand-drawn feel */}
      <path d="M70 200c10 6 50 6 60 0" stroke="#e1d5ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M64 300c14 8 58 8 72 0" stroke="#e1d5ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SymptomMap() {
  const [activeId, setActiveId] = useState(SYMPTOM_HOTSPOTS[0].id);
  const active = SYMPTOM_HOTSPOTS.find((h) => h.id === activeId) ?? SYMPTOM_HOTSPOTS[0];

  return (
    <section id="symptom-map" className="relative scroll-mt-24 py-20 sm:py-28" aria-labelledby="symptom-map-title">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="blob animate-drift-slower absolute top-10 left-[-10rem] h-[24rem] w-[24rem] bg-sage-100/80" />
        <div className="blob animate-drift-slow absolute right-[-6rem] bottom-0 h-[20rem] w-[20rem] bg-lilac-100/80 [animation-delay:-20s]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="symptom-map-title"
            eyebrow="Symptom map"
            title="Where PCOS can show up — and why."
            lede="Tap a point to read a short, plain-language explanation. Everyone's experience is different: many people have only one or two of these, and symptoms can change over time."
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Body with hotspots */}
          <Reveal delay={80} className="mx-auto w-full max-w-[20rem] lg:max-w-[22rem]">
            <div className="relative aspect-[200/460] w-full">
              <Silhouette />
              {SYMPTOM_HOTSPOTS.map((hotspot) => {
                const isActive = hotspot.id === activeId;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => setActiveId(hotspot.id)}
                    aria-pressed={isActive}
                    aria-label={hotspot.title}
                    className="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  >
                    {!isActive && <span className="animate-halo absolute inset-1 rounded-full bg-coral-300/60" aria-hidden="true" />}
                    <span
                      className={`relative h-4 w-4 rounded-full ring-4 transition group-focus-visible:ring-plum-400 ${
                        isActive ? "scale-125 bg-plum-700 ring-white" : "bg-coral-400 ring-white/90 group-hover:scale-110"
                      }`}
                    />
                    <span
                      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-plum-900 px-2.5 py-1 text-[11px] font-medium text-cream-50 shadow-lg transition-opacity sm:block ${
                        hotspot.side === "left" ? "right-full mr-1" : "left-full ml-1"
                      } ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
                      aria-hidden="true"
                    >
                      {hotspot.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Detail panel */}
          <Reveal delay={160}>
            <div
              key={active.id}
              className="animate-fade-up rounded-[1.75rem] border border-plum-100 bg-white/85 p-6 shadow-[0_30px_60px_-36px_rgba(66,45,72,0.4)] sm:p-8"
              aria-live="polite"
            >
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-coral-600">Selected</p>
              <h3 className="mt-2 font-display text-2xl font-medium text-plum-950 sm:text-3xl">{active.title}</h3>
              <p className="mt-3 text-base font-medium text-plum-800">{active.summary}</p>
              <p className="mt-3 leading-relaxed text-ink-700">{active.detail}</p>
              <p className="mt-4 rounded-2xl bg-lilac-50 px-4 py-3 text-sm text-plum-900">
                Not everyone with PCOS experiences this. If it is affecting you, it&apos;s a good thing to raise with a clinician — and nothing
                to feel embarrassed about.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <SourceLinks ids={active.sources} />
                <AskButton variant="ghost" prompt={active.askPrompt}>
                  Ask about this
                </AskButton>
              </div>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="All symptom areas">
              {SYMPTOM_HOTSPOTS.map((hotspot) => {
                const isActive = hotspot.id === activeId;
                return (
                  <li key={hotspot.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(hotspot.id)}
                      aria-pressed={isActive}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400 ${
                        isActive
                          ? "border-plum-700 bg-plum-700 text-cream-50 shadow-sm"
                          : "border-plum-100 bg-white/70 text-ink-700 hover:border-plum-300 hover:text-plum-900"
                      }`}
                    >
                      {hotspot.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
