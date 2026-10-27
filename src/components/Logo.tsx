import Link from "next/link";

import { SITE_NAME } from "@/content/site";

/** Lunaria seed-pod mark: a translucent moon-like disc on a slender stem. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lunaria-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7f5c87" />
          <stop offset="100%" stopColor="#553b5b" />
        </linearGradient>
        <radialGradient id="lunaria-disc" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#e1d5ee" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#lunaria-bg)" />
      <path d="M20 33.5c.2-5.5-.6-9.2-3.4-12.6" stroke="#b5c9aa" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M16.9 25.4c-2.6-.3-4.3-1.7-5.1-4.1 2.6-.2 4.4 1.1 5.1 4.1Z" fill="#b5c9aa" opacity="0.9" />
      <circle cx="21.5" cy="16" r="8.2" fill="url(#lunaria-disc)" />
      <circle cx="21.5" cy="16" r="8.2" fill="none" stroke="#cdbbe2" strokeWidth="0.8" />
      <circle cx="21.5" cy="16" r="2" fill="#e58068" opacity="0.85" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
      aria-label={`${SITE_NAME} home`}
    >
      <LogoMark className={compact ? "h-8 w-8" : "h-9 w-9"} />
      <span className={`font-display font-semibold tracking-tight text-plum-900 ${compact ? "text-lg" : "text-xl"}`}>
        {SITE_NAME}
      </span>
    </Link>
  );
}
