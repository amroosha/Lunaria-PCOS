import { Reveal } from "@/components/motion/Reveal";
import { AskButton } from "@/components/site/AskButton";
import { SectionHeading, SourceLinks } from "@/components/site/SourceLinks";
import { FOODS_TO_AVOID } from "@/content/meals";
import { SOURCES } from "@/content/pcos";

export function FoodsToAvoid() {
  return (
    <section id="foods-to-avoid" className="relative scroll-mt-24 py-20 sm:py-28" aria-labelledby="foods-to-avoid-title">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="blob animate-drift-slower absolute top-10 right-[-10rem] h-[24rem] w-[24rem] bg-lilac-100/80" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading id="foods-to-avoid-title" eyebrow="The honest answer" title="Foods to Avoid with PCOS" lede={FOODS_TO_AVOID.intro} />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          {/* What the guideline says */}
          <Reveal delay={60} className="lg:sticky lg:top-28">
            <div className="rounded-[1.75rem] border border-plum-200 bg-plum-900 p-6 text-cream-50 shadow-[0_30px_60px_-30px_rgba(33,20,37,0.6)] sm:p-7">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-lilac-300">What the 2023 international guideline says</p>
              <ul className="m-0 mt-4 list-none space-y-4 p-0">
                {FOODS_TO_AVOID.guidelineQuotes.map((quote) => (
                  <li key={quote.ref} className="border-l-2 border-coral-300/70 pl-4">
                    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-lilac-200">{quote.ref}</p>
                    <blockquote className="m-0 mt-1 font-display text-[1.05rem] leading-relaxed text-cream-50">“{quote.text}”</blockquote>
                  </li>
                ))}
              </ul>
              <p className="mt-5 mb-0 text-sm leading-relaxed text-lilac-100/85">
                Read the full recommendation list on the{" "}
                <a href={SOURCES.asrm.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cream-50 underline underline-offset-4 hover:text-white">
                  ASRM website
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                or the{" "}
                <a href={SOURCES.guideline.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cream-50 underline underline-offset-4 hover:text-white">
                  guideline summary
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </p>
            </div>
          </Reveal>

          {/* Things some people choose to limit */}
          <div className="space-y-5">
            <Reveal delay={80}>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-plum-600">Things some people choose to limit — and easy alternatives</p>
            </Reveal>
            {FOODS_TO_AVOID.limits.map((idea, index) => (
              <Reveal key={idea.id} delay={100 + index * 60}>
                <article className="rounded-[1.75rem] border border-plum-100 bg-white/85 p-6 shadow-sm sm:p-7">
                  <h3 className="m-0 font-display text-xl font-medium text-plum-950 sm:text-2xl">{idea.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">{idea.why}</p>
                  <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-sage-700">Instead, you could try</p>
                  <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                    {idea.alternatives.map((alternative) => (
                      <li key={alternative} className="flex gap-2 rounded-2xl bg-sage-50 px-3.5 py-2.5 text-sm leading-relaxed text-ink-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" aria-hidden="true" />
                        <span>{alternative}</span>
                      </li>
                    ))}
                  </ul>
                  <SourceLinks ids={idea.sources} className="mt-4" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal delay={60}>
            <div className="h-full rounded-[1.75rem] border border-sage-200 bg-sage-50/70 p-6 shadow-sm sm:p-7">
              <h3 className="m-0 font-display text-xl font-medium text-plum-950 sm:text-2xl">{FOODS_TO_AVOID.noNeed.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-700">{FOODS_TO_AVOID.noNeed.body}</p>
              <SourceLinks ids={FOODS_TO_AVOID.noNeed.sources} className="mt-4" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-[1.75rem] border border-lilac-200 bg-gradient-to-br from-lilac-50 via-white to-cream-100 p-6 shadow-sm sm:p-7">
              <h3 className="m-0 font-display text-xl font-medium text-plum-950 sm:text-2xl">{FOODS_TO_AVOID.gentle.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-700">{FOODS_TO_AVOID.gentle.body}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <SourceLinks ids={FOODS_TO_AVOID.gentle.sources} />
                <AskButton variant="ghost" prompt="Is there anything I should avoid eating with PCOS? Please explain what the evidence says, without strict rules.">
                  Ask about this
                </AskButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
