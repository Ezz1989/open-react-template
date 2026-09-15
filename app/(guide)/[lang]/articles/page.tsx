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
import { ARTICLES_HUB, publishedArticles } from "@/lib/articles-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * The topic-articles hub — direct sibling of `father/page.tsx`, same reasons
 * for existing: this route (`articles/[cluster]/[slug]`) was live before this
 * page was, reachable only by a direct URL nothing on the site printed. No
 * placeholders for the same reason the father hub has none: this series has
 * no fixed length, so an unwritten-title list is a promise with a crawl cost.
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

  const path = (l: Locale) => `${SITE_URL}/${l}/articles`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: ARTICLES_HUB.metaTitle[locale],
    description: ARTICLES_HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: ARTICLES_HUB.metaTitle[locale],
      description: ARTICLES_HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function ArticlesHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const articles = publishedArticles();

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/articles`} />

      <main className="container g-hub">
        <h1 className="display-md">{ARTICLES_HUB.title[locale]}</h1>
        <p className="g-hub-stand">{ARTICLES_HUB.standfirst[locale]}</p>

        <ul className="g-hub-list">
          {articles.map((a) => (
            <li key={`${a.cluster}-${a.slug}`}>
              <Link href={`/${locale}/articles/${a.cluster}/${a.slug}`}>
                <span className="g-hub-title">{a.title[locale]}</span>
                <span className="g-hub-desc">{a.description[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="g-hub-cross">
          <Link href={`/${locale}/guide`}>
            {locale === "ar"
              ? "→ دليل الأم شهراً بعد شهر"
              : "← The mother's guide, month by month"}
          </Link>
          {" · "}
          <Link href={`/${locale}/father`}>
            {locale === "ar" ? "دليل الأب →" : "Father's guide →"}
          </Link>
        </p>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-hub { max-width: 760px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        .g-hub-list { list-style: none; margin-top: 40px; padding: 0; }
        .g-hub-list li { border-top: 1px solid var(--border); }
        .g-hub-list li:last-child { border-bottom: 1px solid var(--border); }
        .g-hub-list a { display: block; padding-block: 20px; }
        .g-hub-list a:hover .g-hub-title { color: var(--accent-strong); }
        .g-hub-title { display: block; font-family: var(--font-display); font-size: 22px; line-height: 1.35; }
        .g-hub-desc { display: block; margin-top: 6px; font-size: 14px; line-height: 1.6; color: var(--fg-soft); }
        .g-hub-cross { margin-top: 40px; font-size: 14px; }
        .g-hub-cross a { text-decoration: underline; }

        @media (max-width: 600px) {
          .g-hub-stand { font-size: 17px; }
          .g-hub-title { font-size: 20px; }
        }
      `}</style>
    </>
  );
}
