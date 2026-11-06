import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { LangProvider, type Lang } from "@/lib/lang-context";
import { PostHogProvider } from "@/components/PostHogProvider";
import { SITE_URL } from "@/lib/constants";
import "../app/globals.css";

/**
 * The <html> shell shared by the two marketing root layouts:
 * `app/(home)/layout.tsx` (Arabic first, since 2026-11-06) and
 * `app/(site)/layout.tsx` (privacy, terms, support… keep English first: they
 * are the URLs Apple and Google reviewers open). Two root layouts because only
 * a root layout can server-render `<html lang dir>`, and it cannot see the path.
 */

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
// Tajawal = the brand's Arabic face (docs/BRAND_2026-09.md), same as the app.
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nawah — نواة | Pregnancy Companion",
  description: "The Arabic pregnancy companion app for mothers and fathers. Built for GCC and Egypt.",
  openGraph: {
    title: "Nawah — نواة",
    description: "Neither of you is doing this alone. مش لوحدك في الحكاية دي.",
    url: SITE_URL,
    siteName: "Nawah",
  },
  // iPhone Safari Smart App Banner (owner yes 2026-11-06) → <meta name="apple-itunes-app">.
  itunes: { appId: "6817668758" },
};

export function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  // Font variables go on <html>, not <body>: the :root tokens in globals.css
  // (--font-display, --font-arabic) reference them, and a variable set on
  // <body> is invisible to :root — every font silently fell back (fixed 2026-10-06).
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${instrument.variable} ${plusJakarta.variable} ${tajawal.variable}`}
    >
      <body>
        <PostHogProvider>
          <LangProvider defaultLang={lang}>{children}</LangProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
