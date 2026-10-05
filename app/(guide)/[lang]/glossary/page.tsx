import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { GLOSSARY, GLOSSARY_HUB } from "@/lib/glossary";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * The glossary hub: every term, its other names and its one-line definition,
 * each linking to its own page. 404s while there are no entries yet, so an
 * empty hub is never crawled.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) return {};
  const path = (l: Locale) => `${SITE_URL}/${l}/glossary`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);
  return {
    title: GLOSSARY_HUB.metaTitle[locale],
    description: GLOSSARY_HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: GLOSSARY_HUB.metaTitle[locale],
      description: GLOSSARY_HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function GlossaryHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale) || !GLOSSARY.length) notFound();

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/glossary`} />
      <main className="container q-hub">
        <h1 className="display-md">{GLOSSARY_HUB.title[locale]}</h1>
        <p className="q-stand">{GLOSSARY_HUB.description[locale]}</p>
        <dl className="q-list">
          {GLOSSARY.map((e) => (
            <div key={e.slug} className="q-item">
              <dt>
                <Link href={`/${locale}/glossary/${e.slug}`}>{e.term[locale]}</Link>
                {e.aka[locale] && <span className="q-aka">{e.aka[locale]}</span>}
              </dt>
              <dd>{e.definition[locale]}</dd>
            </div>
          ))}
        </dl>
      </main>
      <GuideFooter locale={locale} />
      <style>{`
        .q-hub { max-width: 760px; padding-block: 56px 0; }
        .q-stand { margin-top: 16px; font-size: 19px; line-height: 1.7; color: var(--fg-muted); }
        .q-list { margin: 40px 0 0; }
        .q-item { padding-block: 22px; border-top: 1px solid var(--border); }
        .q-item:last-child { border-bottom: 1px solid var(--border); }
        .q-item dt a { font-family: var(--font-display); font-size: 24px; line-height: 1.35; }
        .q-item dt a:hover { color: var(--accent-strong); }
        .q-aka { margin-inline-start: 12px; font-size: 14px; color: var(--fg-soft); }
        .q-item dd { margin: 8px 0 0; font-size: 16px; line-height: 1.75; color: var(--fg-muted); }
      `}</style>
    </>
  );
}
