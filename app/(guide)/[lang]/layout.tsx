import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Instrument_Serif, Plus_Jakarta_Sans, Noto_Naskh_Arabic } from "next/font/google";
import { DIR, LOCALES, SITE_URL, type Locale } from "@/lib/constants";
import "../../globals.css";

/**
 * ROOT LAYOUT #2 — the guide.
 *
 * Next.js allows more than one root layout when the top-level segments are
 * route groups and there is no `app/layout.tsx`. The marketing site keeps its
 * own root layout at `app/(site)/layout.tsx`; this one owns `/en/*` and
 * `/ar/*`. Route groups do not appear in URLs, so nothing the marketing site
 * serves moved — `/`, `/privacy`, `/delete-account` and, critically,
 * `/auth/reset-password` (hardcoded into the shipped Android build) all
 * resolve exactly as before.
 *
 * WHY THE GUIDE NEEDS ITS OWN ROOT
 * --------------------------------
 * The marketing root wraps everything in `LangProvider`, which is a client
 * component holding `useState<Lang>("en")` and writing `document.
 * documentElement.lang/dir` from a `useEffect`. Under that provider, Arabic
 * exists only after hydration and only at the English URL — so Googlebot reads
 * an English page and there is no Arabic URL to rank at all.
 *
 * Here `lang` comes from the route segment, so the Arabic text is in the HTML
 * that leaves the server. That is the entire fix. Note that `<html lang>` is
 * not itself the SEO mechanism: Google Search Central states plainly that
 * "Google doesn't use hreflang or the HTML lang attribute to detect the
 * language of a page; instead, we use algorithms to determine the language."
 * The attribute is here for screen readers, and `dir` is here because RTL text
 * genuinely will not lay out without it.
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
const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/**
 * Only `en` and `ar` are built. Paired with `dynamicParams = false` this means
 * any other top-level segment 404s properly instead of rendering an empty
 * guide shell — which would otherwise turn every typo into a soft 404.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export default async function GuideRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale = lang as Locale;

  return (
    <html lang={locale} dir={DIR[locale]}>
      <body className={`${instrument.variable} ${plusJakarta.variable} ${notoArabic.variable}`}>
        {children}
      </body>
    </html>
  );
}
