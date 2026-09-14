import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HREFLANG,
  LOCALES,
  SITE_URL,
  X_DEFAULT_LOCALE,
  toolsPlayUrl,
  type Locale,
} from "@/lib/constants";
import { getTool, TOOLS } from "@/lib/tools-content";
import { BYLINE, MEDICAL_DISCLAIMER } from "@/lib/guide-content";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";
import { DueDateCalculator } from "@/components/tools/DueDateCalculator";
import { WeeksMonthsConverter } from "@/components/tools/WeeksMonthsConverter";
import { WeightGainCalculator } from "@/components/tools/WeightGainCalculator";
import { OvulationCalculator } from "@/components/tools/OvulationCalculator";
import { KickCounter } from "@/components/tools/KickCounter";
import { ContractionTimer } from "@/components/tools/ContractionTimer";

/**
 * One calculator, server-rendered per locale for the same reason every guide
 * page is: the Arabic shell (title, intro, disclaimer, citations) has to be
 * in the HTML that leaves the server. The calculator widget itself is a
 * client component — it needs browser state (inputs, a running timer) that
 * cannot exist server-side — but the SEO-bearing text around it does not.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => TOOLS.map((t) => ({ lang, tool: t.slug })));
}

const WIDGETS: Record<string, (locale: Locale) => React.ReactNode> = {
  "due-date": (locale) => <DueDateCalculator locale={locale} />,
  "weeks-months": (locale) => <WeeksMonthsConverter locale={locale} />,
  "weight-gain": (locale) => <WeightGainCalculator locale={locale} />,
  ovulation: (locale) => <OvulationCalculator locale={locale} />,
  "kick-counter": (locale) => <KickCounter locale={locale} />,
  "contraction-timer": (locale) => <ContractionTimer locale={locale} />,
};

function parse(params: { lang: string; tool: string }) {
  const locale = params.lang as Locale;
  if (!LOCALES.includes(locale)) return null;
  const doc = getTool(params.tool);
  return doc ? { locale, doc } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tool: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, doc } = parsed;

  const path = (l: Locale) => `${SITE_URL}/${l}/tools/${doc.slug}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: doc.metaTitle[locale],
    description: doc.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: doc.metaTitle[locale],
      description: doc.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ lang: string; tool: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, doc } = parsed;
  const widget = WIDGETS[doc.slug];
  if (!widget) notFound();

  const url = `${SITE_URL}/${locale}/tools/${doc.slug}`;

  /** WebApplication schema — the recognised schema.org type for a browser
   *  tool like this, distinct from the Article schema the guide pages use
   *  (a calculator is not an article). `offers` states it's free, since
   *  that field is required for AggregateRating-style tool listings to be
   *  unambiguous, and it genuinely is free. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: doc.metaTitle[locale],
        description: doc.description[locale],
        url,
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        inLanguage: HREFLANG[locale],
        dateModified: doc.updated,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Nawah", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "ar" ? "أدوات الحمل" : "Pregnancy tools",
            item: `${SITE_URL}/${locale}/tools`,
          },
          { "@type": "ListItem", position: 2, name: doc.title[locale], item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/tools/${doc.slug}`} variant="neutral" />

      <main className="container t-wrap">
        <article>
          <p className="eyebrow">{locale === "ar" ? "أدوات الحمل" : "Pregnancy tools"}</p>
          <h1 className="display-md g-h1">{doc.title[locale]}</h1>
          <p className="g-stand">{doc.intro[locale]}</p>

          {widget(locale)}

          <section className="g-cta">
            <h2>{locale === "ar" ? "تابعي أكثر من مجرد رقم" : "Track more than one number"}</h2>
            <p>
              {locale === "ar"
                ? "تطبيق نواة يحفظ كل هذا تلقائياً — الأسبوع، الوزن، الحركات، والتقلّصات — في مكان واحد."
                : "The Nawah app saves all of this automatically — week, weight, movements and contractions — in one place."}
            </p>
            <a className="btn btn-primary" href={toolsPlayUrl(locale, doc.slug)} rel="noopener">
              {locale === "ar" ? "حمّلي التطبيق" : "Get the app"}
            </a>
          </section>

          {doc.citations && doc.citations.length > 0 && (
            <section className="g-sources">
              <h2>{locale === "ar" ? "المصادر" : "Sources"}</h2>
              <ol>
                {doc.citations.map((c) => (
                  <li key={c.id}>
                    <a href={c.url} rel="noopener" target="_blank">
                      {c.title[locale]}
                    </a>
                    <span className="g-src-org">
                      {c.org}
                      {locale === "ar" ? " · اطُّلع عليه في " : " · retrieved "}
                      {c.retrieved}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <p className="g-disclaimer">{MEDICAL_DISCLAIMER[locale]}</p>
          <p className="g-byline">{BYLINE.name[locale]}</p>

          <p className="g-back">
            <Link href={`/${locale}/tools`}>
              {locale === "ar" ? "→ كل الأدوات" : "← All tools"}
            </Link>
          </p>
        </article>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .t-wrap { max-width: 640px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 20px; }
        .g-stand { font-size: 18px; line-height: 1.65; color: var(--fg-muted); margin-bottom: 32px; }

        .t-card {
          padding: 24px; background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .t-card-center { text-align: center; }
        .t-label { display: block; font-size: 13px; font-weight: 500; color: var(--fg-muted); margin-bottom: 6px; }
        .t-input {
          width: 100%; padding: 12px 14px; font-size: 16px; font-family: inherit;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg); color: var(--fg);
        }
        .t-input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }

        .t-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
        .t-tab {
          flex: 1; padding: 10px; font-size: 13px; font-weight: 500;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg); color: var(--fg-muted);
        }
        .t-tab.is-active { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }

        .t-hint { margin-top: 12px; font-size: 13px; color: var(--fg-soft); }
        .t-hint-warn { color: var(--accent-strong); font-weight: 500; }
        .t-hint-good { color: var(--sage); font-weight: 500; }

        .t-result {
          margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);
        }
        .t-result-label { display: block; font-size: 12px; color: var(--fg-soft); text-transform: uppercase; letter-spacing: 0.05em; }
        .t-result-value { display: block; font-family: var(--font-display); font-size: 26px; margin-top: 4px; }
        .t-result-sub { display: block; font-size: 14px; color: var(--fg-muted); margin-top: 2px; }
        .t-result-of { font-size: 14px; color: var(--fg-soft); font-family: var(--font-body); }

        .t-tap-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; width: 180px; height: 180px; margin: 0 auto;
          border-radius: 50%; border: none; background: var(--accent); color: var(--accent-ink);
          cursor: pointer; transition: transform 0.15s var(--ease);
        }
        .t-tap-btn:active { transform: scale(0.96); }
        .t-tap-btn-active { background: var(--accent-strong); }
        .t-tap-count { font-family: var(--font-display); font-size: 40px; }
        .t-tap-label { font-size: 13px; }
        .t-tap-stats {
          display: flex; justify-content: center; gap: 40px; margin-top: 24px;
        }
        .t-tap-stats > div { text-align: center; }

        .t-history { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); text-align: start; }
        .t-history ul { list-style: none; padding: 0; margin: 10px 0 0; }
        .t-history li { padding-block: 6px; font-size: 14px; color: var(--fg-muted); border-top: 1px solid var(--border); }
        .t-history li:first-child { border-top: none; }

        .g-cta {
          margin-top: 40px; padding: 28px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .g-cta h2 { font-family: var(--font-display); font-size: 24px; font-weight: 400; margin-bottom: 10px; }
        .g-cta p { line-height: 1.7; margin-bottom: 18px; }

        .g-sources { margin-top: 40px; }
        .g-sources h2 { font-size: 18px; font-weight: 500; margin-bottom: 12px; }
        .g-sources ol { padding-inline-start: 20px; list-style: decimal; }
        .g-sources li { margin-bottom: 14px; font-size: 14px; line-height: 1.6; }
        .g-sources a { text-decoration: underline; }
        .g-src-org { display: block; color: var(--fg-soft); font-size: 12px; }

        .g-disclaimer {
          margin-top: 32px; padding: 18px;
          background: var(--bg-elev); border-radius: var(--radius-sm);
          font-size: 13px; line-height: 1.7; color: var(--fg-muted);
        }
        .g-byline { margin-top: 16px; font-size: 12px; color: var(--fg-soft); }
        .g-back { margin-top: 32px; font-size: 14px; }
        .g-back a { text-decoration: underline; }
      `}</style>
    </>
  );
}
