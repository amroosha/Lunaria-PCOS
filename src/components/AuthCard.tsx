import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/site/SiteFooter";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="mt-6 rounded-3xl border border-plum-100/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(28,25,23,0.10)] sm:p-8">
            <h1 className="m-0 text-2xl font-semibold tracking-tight text-plum-900">{title}</h1>
            <p className="mt-2 mb-6 text-sm text-ink-500">{subtitle}</p>
            {children}
          </div>
          <p className="mt-5 text-center text-xs text-ink-500">
            Your conversations are private to your account. Only you can see them, and you can delete them at any time.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
