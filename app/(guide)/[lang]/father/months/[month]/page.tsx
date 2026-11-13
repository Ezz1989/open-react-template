import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, fatherPlayUrl, type Locale } from "@/lib/constants";
import { FATHER_HUB } from "@/lib/father-content";
import { FATHER_MONTHS, getFatherMonth } from "@/lib/father-months";
import { MEDICAL_DISCLAIMER, MONTH_LABEL } from "@/lib/guide-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * /[lang]/father/months/[month] — the father's role, one page per pregnancy month (see lib/father-months.ts).
 * Section headings are the searched phrases from the Gemini brief, so they stay as written there.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => FATHER_MONTHS.map((m) => ({ lang, month: String(m.month) })));
}

function parse(p: { lang: string; month: string }) {
  const locale = p.lang as Locale;
  const doc = getFatherMonth(Number(p.month));
  if (!LOCALES.includes(locale) || !doc) return null;
  return { locale, doc };
}

const H = {
  what: { ar: "ماذا يحدث هذا الشهر", en: "What happens this month" },
  how: (n: number) => ({
    ar: `كيف أتعامل مع زوجتي الحامل في ${MONTH_LABEL[n].ar}`,
    en: `How to support your wife in month ${n}`,
  }),
  doctor: { ar: "متى تتصل بالطبيب", en: "When to call the doctor" },
  sources: { ar: "المصادر", en: "Sources" },
  // Owner-approved download label (2026-11-06), the same one the week pages use.
  app: { ar: "حمِّلوا تطبيق الحمل", en: "Get the app" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; month: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, doc } = parsed;
  const path = (l: Locale) => `${SITE_URL}/${l}/father/months/${doc.month}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);
  return {
    title: doc.metaTitle[locale],
    description: doc.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "article",
      title: doc.metaTitle[locale],
      description: doc.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function FatherMonthPage({ params }: { params: Promise<{ lang: string; month: string }> }) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, doc } = parsed;
  const ar = locale === "ar";
  const url = `${SITE_URL}/${locale}/father/months/${doc.month}`;
  const i = FATHER_MONTHS.findIndex((m) => m.month === doc.month);
  const prev = FATHER_MONTHS[i - 1];
  const next = FATHER_MONTHS[i + 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: FATHER_HUB.title[locale], item: `${SITE_URL}/${locale}/father` },
          { "@type": "ListItem", position: 2, name: doc.title[locale], item: url },
        ],
      },
      {
        "@type": "Article",
        headline: doc.title[locale],
        description: doc.description[locale],
        inLanguage: locale,
        url,
        publisher: { "@id": `${SITE_URL}#org` },
        citation: doc.sources.map((s) => s.url),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="f-mode" data-mode="father">
        <GuideHeader locale={locale} altPath={`/${ar ? "en" : "ar"}/father/months/${doc.month}`} variant="father" />

        <main className="container fm-wrap">
          <article>
            <p className="eyebrow">
              <Link href={`/${locale}/father`}>{FATHER_HUB.title[locale]}</Link>
            </p>
            <h1 className="display-md fm-h1">{doc.title[locale]}</h1>
            <p className="fm-intro">{doc.intro[locale]}</p>

            <h2 className="fm-h2">{H.what[locale]}</h2>
            <p>{doc.whatHappens[locale]}</p>

            <h2 className="fm-h2">{H.how(doc.month)[locale]}</h2>
            <ul className="fm-list">
              {doc.howToHelp[locale].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            {doc.callDoctor && (
              <>
                <h2 className="fm-h2">{H.doctor[locale]}</h2>
                <p>{doc.callDoctor[locale]}</p>
              </>
            )}

            <p className="fm-source">
              {H.sources[locale]}:{" "}
              {doc.sources.map((s, k) => (
                <span key={s.url}>
                  {k > 0 && " · "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">
                    {s.name}
                  </a>
                </span>
              ))}
            </p>

            <section className="fm-cta">
              <p>{doc.appLine[locale]}</p>
              <a className="btn btn-primary" href={fatherPlayUrl(locale, `month_${doc.month}`)} rel="noopener">
                {H.app[locale]}
              </a>
            </section>

            <nav className="fm-nav" aria-label={ar ? "أشهر أخرى" : "Other months"}>
              {prev ? <Link href={`/${locale}/father/months/${prev.month}`}>{ar ? `→ ${prev.title.ar}` : `← ${prev.title.en}`}</Link> : <span />}
              {next && <Link href={`/${locale}/father/months/${next.month}`}>{ar ? `${next.title.ar} ←` : `${next.title.en} →`}</Link>}
            </nav>

            <p className="fm-cross">
              <Link href={`/${locale}/guide/${doc.month}`}>{ar ? `دليل الأم: ${MONTH_LABEL[doc.month].ar}` : `The mother's guide: month ${doc.month}`}</Link>
            </p>

            <p className="g-disclaimer">{MEDICAL_DISCLAIMER[locale]}</p>
          </article>
        </main>

        <GuideFooter locale={locale} />
      </div>

      <style>{`
        .fm-wrap { max-width: 680px; padding-block: 48px 0; }
        .fm-wrap .eyebrow a { text-decoration: none; }
        .fm-h1 { margin: 10px 0 20px; }
        .fm-intro { font-size: 18px; line-height: 1.75; margin-bottom: 8px; }
        .fm-wrap p { line-height: 1.8; }
        .fm-h2 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin: 32px 0 12px; }
        .fm-list { padding-inline-start: 22px; list-style: disc; }
        .fm-list li { line-height: 1.8; margin-bottom: 10px; }
        .fm-source { margin-top: 28px; font-size: 13px; color: var(--fg-muted); }
        .fm-source a { text-decoration: underline; }
        .fm-cta { margin-top: 40px; padding: 28px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius-md); }
        .fm-cta p { margin-bottom: 18px; }
        .fm-nav { display: flex; justify-content: space-between; gap: 16px; margin-top: 32px; font-size: 15px; }
        .fm-nav a, .fm-cross a { text-decoration: underline; }
        .fm-cross { margin-top: 20px; font-size: 14px; }
        .g-disclaimer { margin-top: 32px; padding: 18px; background: var(--bg-elev); border-radius: var(--radius-sm); font-size: 13px; line-height: 1.7; color: var(--fg-muted); }
      `}</style>
    </>
  );
}
