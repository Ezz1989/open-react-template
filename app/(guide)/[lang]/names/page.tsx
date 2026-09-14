import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { getAllNames, getOrigins } from "@/lib/names-data";
import { NAMES_HUB, ORIGIN_LABELS, originSlug } from "@/lib/names-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { NameGrid } from "@/components/names/NameGrid";

/**
 * The names hub: two big links (boys/girls), the ten origin chips, then
 * every one of the 250 names as a dense link grid. That grid is the point —
 * it is 250 internal links landing on pages that otherwise have no other
 * inbound link on the site, exactly the "orphan page" problem the guide's
 * prev/next nav exists to avoid for the month articles.
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

  const path = (l: Locale) => `${SITE_URL}/${l}/names`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: NAMES_HUB.metaTitle[locale],
    description: NAMES_HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: NAMES_HUB.metaTitle[locale],
      description: NAMES_HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function NamesHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const [all, origins] = await Promise.all([getAllNames(), getOrigins()]);

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/names`} variant="neutral" />

      <main className="container g-hub">
        <h1 className="display-md">{NAMES_HUB.title[locale]}</h1>
        <p className="g-hub-stand">{NAMES_HUB.description[locale]}</p>

        <div className="n-shortcuts">
          <Link href={`/${locale}/names/boys`} className="n-shortcut">
            {locale === "ar" ? "أسماء أولاد" : "Boy names"}
          </Link>
          <Link href={`/${locale}/names/girls`} className="n-shortcut">
            {locale === "ar" ? "أسماء بنات" : "Girl names"}
          </Link>
        </div>

        <div className="n-chips">
          {origins.map((o) => (
            <Link key={o} href={`/${locale}/names/origin/${originSlug(o)}`} className="n-chip">
              {(ORIGIN_LABELS[o] ?? { en: o, ar: o })[locale]}
            </Link>
          ))}
        </div>

        <h2 className="n-all-heading">{locale === "ar" ? "كل الأسماء" : "All names"}</h2>
        <NameGrid names={all} locale={locale} />
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-hub { max-width: 1000px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        .n-shortcuts { display: flex; gap: 12px; margin-top: 32px; }
        .n-shortcut {
          flex: 1; padding: 20px; text-align: center;
          font-family: var(--font-display); font-size: 20px;
          background: var(--chip-bg); border-radius: var(--radius-md);
        }
        .n-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .n-chip {
          padding: 8px 16px; font-size: 13px; border-radius: 999px;
          border: 1px solid var(--border); color: var(--fg-muted);
        }
        .n-chip:hover { border-color: var(--accent); color: var(--fg); }
        .n-all-heading { font-family: var(--font-display); font-size: 26px; font-weight: 400; margin: 48px 0 20px; }

        @media (max-width: 600px) {
          .n-shortcuts { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
