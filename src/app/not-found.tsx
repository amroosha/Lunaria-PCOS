import Link from "next/link";

import { LogoMark } from "@/components/Logo";
import { SITE_NAME } from "@/content/site";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-6 font-display text-3xl font-medium tracking-tight text-plum-950">That page isn&apos;t here.</h1>
        <p className="mt-3 text-ink-700">
          {SITE_NAME}{" "}has no shared rooms or public conversation links, so there&apos;s nothing to find at this address.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-plum-700 px-5 py-3 text-sm font-semibold text-cream-50 shadow-sm transition hover:bg-plum-800"
          >
            Back to learning
          </Link>
          <Link href="/chat" className="rounded-full px-4 py-3 text-sm font-medium text-ink-700 hover:bg-plum-100/70 hover:text-plum-900">
            Open the chat
          </Link>
        </div>
      </div>
    </main>
  );
}
