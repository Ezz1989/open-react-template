import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  type Locale,
} from "@/lib/constants";
import { FATHER_HUB, publishedArticles } from "@/lib/father-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * The father hub.
 *
 * Unlike the month hub it lists no placeholders. That hub can show nine slots
 * with "coming soon" against the unwritten ones because pregnancy has exactly
 * nine months and the shape is known in advance — the gaps are informative.
 * This series has no fixed length, so a list of unwritten titles would just be
 * a promise with a crawl cost attached.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) return {};

  const path = (l: Locale) => `${SITE_URL}/${l}/father`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: FATHER_HUB.metaTitle[locale],
    description: FATHER_HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: FATHER_HUB.metaTitle[locale],
      description: FATHER_HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function FatherHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const articles = publishedArticles();

  return (
    <div className="f-mode" data-mode="father">
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/father`} />

      <main className="container f-hub">
        <h1 className="display-md">{FATHER_HUB.title[locale]}</h1>
        <p className="f-hub-stand">{FATHER_HUB.standfirst[locale]}</p>

        <ul className="f-hub-list">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/${locale}/father/${a.slug}`}>
                <span className="f-hub-title">{a.title[locale]}</span>
                <span className="f-hub-desc">{a.description[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* The mother series is the other half of the site and outranks this
            one; a father who lands here is often looking for it. */}
        <p className="f-hub-cross">
          <Link href={`/${locale}/guide`}>
            {locale === "ar"
              ? "→ دليل الأم شهراً بعد شهر"
              : "← The mother's guide, month by month"}
          </Link>
        </p>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        [data-theme="dark"] .f-mode {
          --chip-bg: rgba(58,72,107,0.25);
          --accent: #8FBBA4;
          --accent-strong: #B4C3E6;
        }

        .f-hub { max-width: 760px; padding-block: 56px 0; }
        .f-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        /* Tailwind preflight zeroes list-style; this list wants none anyway,
           but it is restated so the intent is not mistaken for the bug. */
        .f-hub-list { list-style: none; margin-top: 40px; padding: 0; }
        .f-hub-list li { border-top: 1px solid var(--border); }
        .f-hub-list li:last-child { border-bottom: 1px solid var(--border); }
        .f-hub-list a { display: block; padding-block: 20px; }
        .f-hub-list a:hover .f-hub-title { color: var(--accent-strong); }
        .f-hub-title { display: block; font-family: var(--font-display); font-size: 22px; line-height: 1.35; }
        .f-hub-desc { display: block; margin-top: 6px; font-size: 14px; line-height: 1.6; color: var(--fg-soft); }
        .f-hub-cross { margin-top: 40px; font-size: 14px; }
        .f-hub-cross a { text-decoration: underline; }

        @media (max-width: 600px) {
          .f-hub-stand { font-size: 17px; }
          .f-hub-title { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
