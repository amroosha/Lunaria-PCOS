"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MotionToggle } from "@/components/motion/MotionToggle";
import { AskButton } from "@/components/site/AskButton";

interface MobileMenuProps {
  links: Array<{ href: string; label: string }>;
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-plum-200/80 bg-white/70 text-plum-800 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-plum-400"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        )}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-plum-100 bg-cream-50/95 shadow-[0_24px_40px_-24px_rgba(66,45,72,0.35)] backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-ink-700 transition hover:bg-plum-100/70 hover:text-plum-900"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-plum-100 pt-4">
              <span onClick={() => setOpen(false)}>
                <AskButton variant="secondary" />
              </span>
              <MotionToggle />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
