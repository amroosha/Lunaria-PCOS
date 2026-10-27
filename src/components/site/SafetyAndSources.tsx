import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading } from "@/components/site/SourceLinks";
import { SOURCE_LIST, URGENT_CARE_NOTE } from "@/content/pcos";
import { SITE_NAME } from "@/content/site";

export function SafetyNote() {
  return (
    <section className="py-6 sm:py-10" aria-labelledby="safety-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 rounded-[2rem] border border-coral-200/80 bg-gradient-to-br from-coral-50 via-white to-cream-100 p-6 shadow-sm sm:p-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-100 text-coral-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-4.4-7-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 16.6 12 21 12 21Z" />
                <path d="M9 12h2l1-2 1.5 4 1-2H16" />
              </svg>
            </span>
            <div>
              <h2 id="safety-title" className="m-0 font-display text-2xl font-medium text-plum-950">
                {URGENT_CARE_NOTE.title}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-700">{URGENT_CARE_NOTE.body}</p>
              <p className="mt-3 font-medium leading-relaxed text-coral-700">{URGENT_CARE_NOTE.crisis}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AskBanner() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="ask-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-plum-900 px-6 py-12 text-center text-cream-50 shadow-[0_40px_80px_-40px_rgba(33,20,37,0.7)] sm:px-12 sm:py-16">
            <div className="blob animate-drift-slow absolute -top-20 -left-10 h-64 w-64 bg-plum-700/60" aria-hidden="true" />
            <div className="blob animate-drift-slower absolute -right-16 -bottom-24 h-72 w-72 bg-lilac-500/30" aria-hidden="true" />
            <div className="relative">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-lilac-300">Private one-to-one chat</p>
              <h2 id="ask-title" className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight">
                Still wondering about something?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-lilac-100/90">
                Ask in plain words. The {SITE_NAME}{" "}guide explains PCOS topics gently, is honest about what isn&apos;t certain, and will point
                you toward a clinician for anything personal. It&apos;s a one-to-one conversation — no other visitors, no shared rooms.
              </p>
              <div className="mt-8 flex justify-center">
                <AskButton className="bg-cream-50! text-plum-900! hover:bg-white!" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SourcesSection() {
  return (
    <section id="sources" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="sources-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="sources-title"
            eyebrow="Where this information comes from"
            title="Reputable sources, linked openly."
            lede={`Everything on ${SITE_NAME}{" "}is drawn from the organisations below. Follow the links to read the originals — they go deeper than we do, and they are the right place to check anything that matters to you.`}
          />
        </Reveal>
        <ul className="mt-10 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
          {SOURCE_LIST.map((source, index) => (
            <Reveal key={source.id} as="li" delay={(index % 3) * 80}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lift flex h-full flex-col rounded-[1.5rem] border border-plum-100 bg-white/80 p-6 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-plum-600">{source.org}</span>
                <span className="mt-2 font-display text-lg font-medium leading-snug text-plum-950">{source.name}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">{source.note}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-plum-700">
                  Read the source
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-xs text-ink-500">
          Note: the UK&apos;s NHS now uses the name polyendocrine metabolic ovarian syndrome (PMOS) for what has long been called PCOS. Most
          other organisations, including the WHO, still use PCOS, so that is the term used on this site.
        </p>
      </div>
    </section>
  );
}
