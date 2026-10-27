import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fdfbf7",
};

/**
 * Runs before paint: restores the visitor's motion preference and marks the
 * document as JS-enabled so reveal-on-scroll never hides content without JS.
 */
const bootScript = `(function(){try{var m=localStorage.getItem("lunaria:motion");if(m==="reduced"||m==="full"){document.documentElement.setAttribute("data-motion",m)}}catch(e){}document.documentElement.setAttribute("data-js","")})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout applies to every page; this rule targets the Pages Router. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Manrope:wght@400..800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full font-sans text-ink-900 antialiased">{children}</body>
    </html>
  );
}
