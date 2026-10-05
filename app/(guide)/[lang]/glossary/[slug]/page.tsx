import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, playStoreUrl, type Locale } from "@/lib/constants";
import { GLOSSARY, GLOSSARY_HUB, glossaryEntry } from "@/lib/glossary";
import { MEDICAL_DISCLAIMER } from "@/lib/guide-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/** One term per page — each term is its own search ("تسمم الحمل", "فحص NIPT"),
 *  so each gets its own URL, answer first. */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => GLOSSARY.map((e) => ({ lang, slug: e.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const e = glossaryEntry(slug);
  if (!LOCALES.includes(locale) || !e) return {};
  const title = locale === "ar" ? `ما هو ${e.term.ar}؟ | قاموس الحمل — نواة` : `What is ${e.term.en}? | Pregnancy glossary — Nawah`;
  const description = e.definition[locale];
  const path = (l: Locale) => `${SITE_URL}/${l}/glossary/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);
  return {
    title,
    description,
    alternates: { canonical: path(locale), languages },
    openGraph: { type: "article", title, description, url: path(locale), siteName: "Nawah", locale: locale === "ar" ? "ar_AR" : "en_US" },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const e = glossaryEntry(slug);
  if (!LOCALES.includes(locale) || !e) notFound();
  const ar = locale === "ar";
  const url = `${SITE_URL}/${locale}/glossary/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: e.term[locale],
        description: e.definition[locale],
        url,
        inDefinedTermSet: { "@type": "DefinedTermSet", name: GLOSSARY_HUB.title[locale], url: `${SITE_URL}/${locale}/glossary` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: GLOSSARY_HUB.title[locale], item: `${SITE_URL}/${locale}/glossary` },
          { "@type": "ListItem", position: 2, name: e.term[locale], item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <GuideHeader locale={locale} altPath={`/${ar ? "en" : "ar"}/glossary/${slug}`} />
      <main className="container q-wrap">
        <article>
          <p className="q-crumb"><Link href={`/${locale}/glossary`}>{GLOSSARY_HUB.title[locale]}</Link></p>
          <h1 className="display-md">{e.term[locale]}</h1>
          {e.aka[locale] && <p className="q-aka">{ar ? "يُعرف أيضاً باسم: " : "Also called: "}{e.aka[locale]}</p>}

          <p className="q-def">{e.definition[locale]}</p>
          {e.when[locale] && (
            <p className="q-when"><strong>{ar ? "متى يظهر: " : "When it comes up: "}</strong>{e.when[locale]}</p>
          )}

          {e.body.map((p, i) => <p key={i} className="q-body">{p[locale]}</p>)}

          {e.link && (
            <p className="q-more">
              <Link href={`/${locale}${e.link}`}>{ar ? "اقرئي المزيد في دليل نواة ←" : "Read more in the Nawah guide →"}</Link>
            </p>
          )}

          <aside className="q-cta">
            <p>{ar ? "تابعي حملك أسبوعاً بأسبوع مع شريكك في تطبيق نواة." : "Follow your pregnancy week by week, together, in the Nawah app."}</p>
            <a className="btn btn-primary" rel="noopener"
              href={playStoreUrl({ source: "nawahapp.net", medium: "organic_glossary", campaign: "glossary", content: `${locale}_${slug}` })}>
              {ar ? "حمّلي التطبيق" : "Get the app"}
            </a>
          </aside>

          <section className="q-sources">
            <h2>{ar ? "المصادر" : "Sources"}</h2>
            <ol>
              {e.citations.map((c) => (
                <li key={c.url}><span className="q-src-org">{c.org}</span><a href={c.url} rel="noopener">{c.title}</a></li>
              ))}
            </ol>
          </section>
          <p className="q-disclaimer">{MEDICAL_DISCLAIMER[locale]}</p>
        </article>
      </main>
      <GuideFooter locale={locale} />
      <style>{`
        .q-wrap { max-width: 680px; padding-block: 48px 0; }
        .q-crumb { font-size: 14px; margin-bottom: 12px; }
        .q-crumb a { color: var(--accent-strong); text-decoration: underline; text-underline-offset: 4px; }
        .q-aka { margin-top: 8px; font-size: 15px; color: var(--fg-soft); }
        .q-def { margin-top: 24px; font-size: 21px; line-height: 1.75; }
        .q-when { margin-top: 14px; padding: 14px 18px; border-radius: var(--radius-sm); background: var(--chip-bg); font-size: 15px; line-height: 1.7; }
        .q-body { margin-top: 18px; font-size: 17px; line-height: 1.85; color: var(--fg); }
        .q-more { margin-top: 24px; }
        .q-more a { color: var(--accent-strong); text-decoration: underline; text-underline-offset: 4px; }
        .q-cta { margin-top: 36px; padding: clamp(22px, 4vw, 34px); border-radius: var(--radius-md); background: var(--chip-bg); }
        .q-cta p { margin: 0 0 16px; font-size: 17px; line-height: 1.7; }
        .q-sources { margin-top: 40px; padding: 0; }
        .q-sources h2 { font-size: 18px; font-weight: 500; margin-bottom: 10px; }
        .q-sources ol { padding-inline-start: 20px; list-style: decimal; }
        .q-sources li { font-size: 14px; line-height: 1.6; margin-bottom: 10px; }
        .q-sources a { text-decoration: underline; }
        .q-src-org { display: block; font-size: 12px; color: var(--fg-soft); }
        .q-disclaimer { margin-top: 28px; padding: 18px; background: var(--bg-elev); border-radius: var(--radius-sm); font-size: 13px; line-height: 1.7; color: var(--fg-muted); }
      `}</style>
    </>
  );
}
