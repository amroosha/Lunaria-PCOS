import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { AskButton } from "@/components/site/AskButton";
import { MobileMenu } from "@/components/site/MobileMenu";
import { getCurrentUser } from "@/lib/auth";
import { getPublicChatConfig } from "@/lib/config";

export const NAV_LINKS = [
  { href: "/#explainer", label: "Basics" },
  { href: "/#symptom-map", label: "Symptom map" },
  { href: "/#topics", label: "Topics" },
  { href: "/#eating-well", label: "Meal plans" },
  { href: "/#foods-to-avoid", label: "Foods to avoid" },
  { href: "/#appointment", label: "Appointment" },
  { href: "/privacy", label: "Privacy" },
];

export async function SiteHeader() {
  const config = getPublicChatConfig();
  const user = config.historyEnabled ? await getCurrentUser() : null;

  return (
    <header className="sticky top-0 z-30 border-b border-plum-100/70 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 text-sm font-medium text-ink-700 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-plum-100/70 hover:text-plum-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden xl:block">
            <MotionToggle />
          </div>

          {config.historyEnabled && !user && (
            <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-plum-100/70 sm:inline-flex">
              Sign in
            </Link>
          )}
          {config.historyEnabled && user && (
            <form action={logoutAction} className="hidden items-center gap-1 sm:flex">
              <span className="hidden max-w-[11rem] truncate text-xs text-ink-500 md:inline" title={user.email}>
                {user.email}
              </span>
              <button type="submit" className="rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-plum-100/70">
                Sign out
              </button>
            </form>
          )}

          <AskButton variant="secondary" />
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
