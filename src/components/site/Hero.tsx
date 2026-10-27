import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { QUICK_FACTS, SOURCES } from "@/content/pcos";
import { SITE_NAME } from "@/content/site";

/** Delicate botanical line drawing: a stem with leaves and translucent lunaria pods. */
function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 520" className={className} fill="none" aria-hidden="true">
      <g className="animate-sway origin-bottom">
        <path d="M150 515C170 420 120 350 160 260S220 130 170 40" stroke="#92ad84" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M160 262c-40-14-60-50-58-92 34 10 56 46 58 92Z" fill="#d3e0cc" stroke="#92ad84" strokeWidth="1.4" />
        <path d="M156 352c42-6 72 16 86 56-40 6-72-14-86-56Z" fill="#e8efe4" stroke="#92ad84" strokeWidth="1.4" />
        <path d="M140 430c-44 2-70-24-78-66 42-2 70 22 78 66Z" fill="#d3e0cc" stroke="#92ad84" strokeWidth="1.4" />
        <path d="M184 120c-8 6-14 10-20 20" stroke="#92ad84" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="206" cy="112" r="34" fill="#efe8f6" fillOpacity="0.85" stroke="#cdbbe2" strokeWidth="1.4" />
        <circle cx="206" cy="112" r="24" stroke="#e1d5ee" strokeWidth="1" />
        <circle cx="206" cy="112" r="4" fill="#e58068" fillOpacity="0.9" />
        <path d="M176 190c-10 2-18 6-26 14" stroke="#92ad84" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="130" cy="214" r="26" fill="#f7f3fb" fillOpacity="0.9" stroke="#cdbbe2" strokeWidth="1.4" />
        <circle cx="130" cy="214" r="17" stroke="#e1d5ee" strokeWidth="1" />
        <circle cx="130" cy="214" r="3.2" fill="#e58068" fillOpacity="0.8" />
        <path d="M170 44c6-10 14-16 26-18" stroke="#92ad84" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="222" cy="22" r="18" fill="#efe8f6" fillOpacity="0.85" stroke="#cdbbe2" strokeWidth="1.2" />
        <circle cx="222" cy="22" r="2.6" fill="#e58068" fillOpacity="0.8" />
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Drifting shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="blob animate-drift-slow absolute -top-24 -left-20 h-[28rem] w-[28rem] bg-lilac-200/70" />
        <div className="blob animate-drift-slower absolute top-20 right-[-8rem] h-[26rem] w-[26rem] bg-sage-200/60" />
        <div className="blob animate-drift-slow absolute bottom-[-10rem] left-[38%] h-[22rem] w-[22rem] bg-coral-100/70 [animation-delay:-12s]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-24 lg:pb-24">
        <div>
          <Reveal>
            <p className="m-0 inline-flex items-center gap-2 rounded-full border border-plum-200/80 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-plum-700">
              <span className="h-1.5 w-1.5 rounded-full bg-coral-400" />
              Women&apos;s health · PCOS education
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-title"
              className="mt-6 font-display text-[clamp(2.6rem,6.2vw,4.6rem)] font-medium leading-[1.02] tracking-tight text-plum-950"
            >
              Understand your body.
              <br />
              <span className="italic text-plum-600">Find your next step.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
              {SITE_NAME}{" "}offers accessible PCOS education drawn from reputable health sources, plus a private one-to-one AI chat for
              general questions. It&apos;s here to help you make sense of things — not to diagnose, and not to replace your care team.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AskButton />
              <Link
                href="#explainer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-base font-medium text-plum-800 transition hover:bg-plum-100/70"
              >
                Start with the basics
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
              <span className="font-semibold uppercase tracking-[0.12em] text-ink-500">Sources</span>
              <span aria-hidden="true">·</span>
              <a href={SOURCES.who.url} target="_blank" rel="noopener noreferrer" className="hover:text-plum-800 hover:underline underline-offset-4">
                WHO
              </a>
              <span aria-hidden="true">·</span>
              <a href={SOURCES.nhs.url} target="_blank" rel="noopener noreferrer" className="hover:text-plum-800 hover:underline underline-offset-4">
                NHS
              </a>
              <span aria-hidden="true">·</span>
              <a href={SOURCES.owh.url} target="_blank" rel="noopener noreferrer" className="hover:text-plum-800 hover:underline underline-offset-4">
                Office on Women&apos;s Health
              </a>
              <span aria-hidden="true">·</span>
              <a href={SOURCES.guideline.url} target="_blank" rel="noopener noreferrer" className="hover:text-plum-800 hover:underline underline-offset-4">
                International PCOS Guideline
              </a>
            </p>
          </Reveal>
        </div>

        {/* Illustration with floating facts */}
        <Reveal delay={200} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] w-full">
            <div className="absolute inset-[8%] rounded-[40%_60%_55%_45%/50%_45%_55%_50%] bg-gradient-to-br from-white/80 via-lilac-50/80 to-sage-50/70 shadow-[0_40px_80px_-40px_rgba(66,45,72,0.35)] ring-1 ring-white/60" />
            <Botanical className="absolute inset-0 h-full w-full p-6" />

            {QUICK_FACTS.map((fact, index) => (
              <div
                key={fact.stat}
                className={`animate-float absolute w-[11.5rem] rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-[0_18px_40px_-18px_rgba(66,45,72,0.35)] backdrop-blur ${
                  index === 0 ? "top-[6%] left-0" : index === 1 ? "top-[44%] right-0" : "bottom-[4%] left-[6%]"
                }`}
                style={{ animationDelay: `${index * -3}s` }}
              >
                <p className="m-0 font-display text-2xl font-semibold text-plum-800">{fact.stat}</p>
                <p className="mt-1 mb-0 text-xs leading-snug text-ink-700">{fact.label}</p>
                <a
                  href={SOURCES[fact.sources[0]].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-plum-500 hover:text-plum-800"
                >
                  {SOURCES[fact.sources[0]].short}
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
