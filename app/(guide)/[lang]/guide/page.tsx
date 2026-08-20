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
import {
  GUIDE_HUB,
  MONTH_LABEL,
  MONTH_WEEKS,
  getMonth,
} from "@/lib/guide-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * The guide hub. Links every published month and shows the shape of the rest.
 *
 * Unwritten months render as plain text rather than links. A link to an empty
 * page is worse than no link: it spends crawl budget and shows a reader a
 * stub, and `getMonth` returns undefined for anything unpublished anyway.
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

  const path = (l: Locale) => `${SITE_URL}/${l}/guide`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: GUIDE_HUB.metaTitle[locale],
    description: GUIDE_HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: GUIDE_HUB.metaTitle[locale],
      description: GUIDE_HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

function weeks(month: number, locale: Locale): string {
  const [a, b] = MONTH_WEEKS[month];
  const fmt = (n: number) => n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  return locale === "ar"
    ? `الأسابيع ${fmt(a)}–${fmt(b)}`
    : `Weeks ${a}–${b}`;
}

export default async function GuideHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const soon = locale === "ar" ? "قريباً" : "Coming soon";

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/guide`} />

      <main className="container g-hub">
        <h1 className="display-md">{GUIDE_HUB.title[locale]}</h1>
        <p className="g-hub-stand">{GUIDE_HUB.standfirst[locale]}</p>

        <ol className="g-hub-list">
          {months.map((m) => {
            const doc = getMonth(m);
            return (
              <li key={m} className={doc ? "" : "is-pending"}>
                {doc ? (
                  <Link href={`/${locale}/guide/${m}`}>
                    <span className="g-hub-month">{MONTH_LABEL[m][locale]}</span>
                    <span className="g-hub-title">{doc.title[locale]}</span>
                    <span className="g-hub-weeks">{weeks(m, locale)}</span>
                  </Link>
                ) : (
                  <div>
                    <span className="g-hub-month">{MONTH_LABEL[m][locale]}</span>
                    <span className="g-hub-title">{soon}</span>
                    <span className="g-hub-weeks">{weeks(m, locale)}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-hub { max-width: 760px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        .g-hub-list { list-style: none; margin-top: 40px; padding: 0; }
        .g-hub-list li { border-top: 1px solid var(--border); }
        .g-hub-list li:last-child { border-bottom: 1px solid var(--border); }
        .g-hub-list a, .g-hub-list div {
          display: grid; grid-template-columns: 110px 1fr auto;
          gap: 16px; align-items: baseline; padding-block: 18px;
        }
        .g-hub-list a:hover .g-hub-title { color: var(--accent-strong); }
        .g-hub-month { font-size: 13px; color: var(--fg-soft); }
        .g-hub-title { font-family: var(--font-display); font-size: 21px; }
        .g-hub-weeks { font-size: 13px; color: var(--fg-soft); white-space: nowrap; }
        .is-pending .g-hub-title { color: var(--fg-soft); font-family: var(--font-body); font-size: 15px; }

        @media (max-width: 600px) {
          .g-hub-list a, .g-hub-list div {
            grid-template-columns: 1fr auto; gap: 4px 12px;
          }
          .g-hub-month { grid-column: 1 / -1; }
        }
      `}</style>
    </>
  );
}
