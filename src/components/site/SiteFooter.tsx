import Link from "next/link";

import { LogoMark } from "@/components/Logo";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { SOURCE_LIST, URGENT_CARE_NOTE } from "@/content/pcos";
import { SITE_NAME, SITE_TAGLINE } from "@/content/site";

const EXPLORE = [
  { href: "/#explainer", label: "PCOS, in simple terms" },
  { href: "/#symptom-map", label: "Symptom map" },
  { href: "/#topics", label: "Topics" },
  { href: "/#eating-well", label: "7-day meal plans" },
  { href: "/#foods-to-avoid", label: "Foods to avoid with PCOS" },
  { href: "/#appointment", label: "Questions for your appointment" },
  { href: "/#sources", label: "Sources" },
  { href: "/chat", label: "Open the chat" },
  { href: "/privacy", label: "Privacy notice" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-plum-100/80 bg-gradient-to-b from-transparent to-lilac-100/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-xl font-semibold text-plum-900">{SITE_NAME}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-700">{SITE_TAGLINE} Calm, accessible education about PCOS, with a private one-to-one chat for general questions.</p>
            <p className="mt-4 max-w-sm rounded-2xl border border-coral-200/80 bg-coral-50/70 px-4 py-3 text-xs leading-relaxed text-ink-700">
              <strong className="font-semibold text-coral-700">Educational, not diagnostic.</strong> Nothing here replaces care from a qualified
              healthcare professional. {URGENT_CARE_NOTE.crisis}
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-plum-600">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-plum-900 hover:underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sources">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-plum-600">Sources we draw on</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              {SOURCE_LIST.map((source) => (
                <li key={source.id}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-plum-900 hover:underline underline-offset-4"
                  >
                    {source.short}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-ink-500 sm:flex-row sm:items-center">
          <p className="m-0">
            © {new Date().getFullYear()} {SITE_NAME}. Health information is general and may not apply to you.
          </p>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
