import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, toolsPlayUrl, type Locale } from "@/lib/constants";
import { MONTH_LABEL } from "@/lib/guide-content";
import {
  cohortSlug,
  cohortTimeline,
  parseCohortSlug,
  representativeDueDate,
  upcomingCohorts,
  type CohortSlug,
} from "@/lib/due-content";
import { formatMonthYearBothCalendars } from "@/lib/utils";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * One due-month cohort: the full nine-month timeline mapped to real calendar
 * months for that due date. Every row links to the matching guide article —
 * this page's whole job is to be a second on-ramp into the same nine
 * articles, entered by "when am I due" instead of "what week am I at".
 */

export const dynamicParams = false;

export function generateStaticParams() {
  const cohorts = upcomingCohorts(24);
  return LOCALES.flatMap((lang) => cohorts.map((c) => ({ lang, slug: cohortSlug(c) })));
}

function parse(params: { lang: string; slug: string }): { locale: Locale; cohort: CohortSlug } | null {
  const locale = params.lang as Locale;
  if (!LOCALES.includes(locale)) return null;
  const cohort = parseCohortSlug(params.slug);
  return cohort ? { locale, cohort } : null;
}

const TRIMESTER_LABEL: Record<1 | 2 | 3, Record<Locale, string>> = {
  1: { en: "First trimester", ar: "الثلث الأول" },
  2: { en: "Second trimester", ar: "الثلث الثاني" },
  3: { en: "Third trimester", ar: "الثلث الثالث" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, cohort } = parsed;
  const { gregorian } = formatMonthYearBothCalendars(representativeDueDate(cohort), locale);

  const title =
    locale === "ar"
      ? `حامل وموعد ولادتك ${gregorian}؟ رحلتك التسعة أشهر | نواة`
      : `Due in ${gregorian}? Your Nine-Month Timeline | Nawah`;
  const description =
    locale === "ar"
      ? `إذا كان موعد ولادتك ${gregorian}، إليكِ رحلة حملك كاملة مقسّمة على تسعة أشهر، مربوطة بالتواريخ الفعلية.`
      : `If you're due in ${gregorian}, here is your full nine-month pregnancy timeline mapped to real dates.`;

  const path = (l: Locale) => `${SITE_URL}/${l}/due/${cohortSlug(cohort)}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title,
    description,
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title,
      description,
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function DueCohortPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, cohort } = parsed;

  const dueDate = representativeDueDate(cohort);
  const { gregorian, hijri } = formatMonthYearBothCalendars(dueDate, locale);
  const timeline = cohortTimeline(cohort);

  // Prev/next cohort, same pattern as the guide's month prev/next nav.
  const all = upcomingCohorts(24);
  const idx = all.findIndex((c) => c.year === cohort.year && c.month === cohort.month);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  const url = `${SITE_URL}/${locale}/due/${cohortSlug(cohort)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "ar" ? "متى موعد ولادتك؟" : "When are you due?", item: `${SITE_URL}/${locale}/due` },
          { "@type": "ListItem", position: 2, name: gregorian, item: url },
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

      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/due/${cohortSlug(cohort)}`} variant="mother" />

      <main className="container g-wrap">
        <article>
          <p className="eyebrow">{locale === "ar" ? "متى موعد ولادتك؟" : "When are you due?"}</p>
          <h1 className="display-md g-h1">
            {locale === "ar" ? `موعدك ${gregorian}` : `Due in ${gregorian}`}
          </h1>
          <p className="g-stand">{hijri}</p>
          <p className="g-stand" style={{ fontSize: 16 }}>
            {locale === "ar"
              ? "هذه رحلتك التسعة أشهر كاملة — كل شهر من أشهر الحمل، والفترة التقريبية من التقويم التي يوافقها إذا كان موعدك في هذا الشهر."
              : "Your full nine-month journey — every pregnancy month, and roughly which calendar period it falls in if this is your due month."}
          </p>

          <ol className="d-timeline">
            {timeline.map((row) => {
              const start = formatMonthYearBothCalendars(row.periodStart, locale).gregorian;
              const end = formatMonthYearBothCalendars(row.periodEnd, locale).gregorian;
              return (
                <li key={row.month}>
                  <Link href={`/${locale}/guide/${row.month}`} className="d-row">
                    <span className="d-row-month">{MONTH_LABEL[row.month][locale]}</span>
                    <span className="d-row-period">
                      {start === end ? start : `${start} – ${end}`}
                    </span>
                    <span className="d-row-trimester">{TRIMESTER_LABEL[row.trimester][locale]}</span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <section className="g-cta">
            <h2>{locale === "ar" ? "تابعي كل أسبوع في مكانه" : "Track every week in one place"}</h2>
            <p>
              {locale === "ar"
                ? "تطبيق نواة يحسب أسبوعك الفعلي بالضبط من تاريخك أنتِ، لا من تقدير عام، ويذكّرك بكل موعد."
                : "The Nawah app calculates your exact week from your own dates, not a general estimate, and reminds you of every appointment."}
            </p>
            <a className="btn btn-primary" href={toolsPlayUrl(locale, `due_${cohortSlug(cohort)}`)} rel="noopener">
              {locale === "ar" ? "حمّلي التطبيق" : "Get the app"}
            </a>
          </section>

          <nav className="g-seq" aria-label={locale === "ar" ? "تصفّح شهور الولادة" : "Due month navigation"}>
            {prev ? (
              <Link href={`/${locale}/due/${cohortSlug(prev)}`} className="g-seq-prev">
                <span>{locale === "ar" ? "السابق" : "Previous"}</span>
                <strong>{formatMonthYearBothCalendars(representativeDueDate(prev), locale).gregorian}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/${locale}/due/${cohortSlug(next)}`} className="g-seq-next">
                <span>{locale === "ar" ? "التالي" : "Next"}</span>
                <strong>{formatMonthYearBothCalendars(representativeDueDate(next), locale).gregorian}</strong>
              </Link>
            )}
          </nav>

          <p className="g-back">
            <Link href={`/${locale}/due`}>{locale === "ar" ? "→ كل شهور الولادة" : "← All due months"}</Link>
          </p>
        </article>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-wrap { max-width: 700px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 6px; }
        .g-stand { font-size: 18px; line-height: 1.6; color: var(--fg-muted); }

        .d-timeline { list-style: none; margin: 32px 0 0; padding: 0; }
        .d-row {
          display: grid; grid-template-columns: 100px 1fr auto;
          gap: 16px; align-items: baseline; padding-block: 16px;
          border-top: 1px solid var(--border);
        }
        .d-timeline li:last-child .d-row { border-bottom: 1px solid var(--border); }
        .d-row:hover .d-row-period { color: var(--accent-strong); }
        .d-row-month { font-size: 13px; color: var(--fg-soft); }
        .d-row-period { font-family: var(--font-display); font-size: 19px; }
        .d-row-trimester { font-size: 12px; color: var(--fg-soft); white-space: nowrap; }

        .g-cta {
          margin-top: 48px; padding: 28px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .g-cta h2 { font-family: var(--font-display); font-size: 24px; font-weight: 400; margin-bottom: 10px; }
        .g-cta p { line-height: 1.7; margin-bottom: 18px; }

        .g-seq { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 40px; }
        .g-seq a { display: block; padding: 16px 18px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
        .g-seq a:hover { border-color: var(--accent); }
        .g-seq span { display: block; font-size: 12px; color: var(--fg-soft); margin-bottom: 4px; }
        .g-seq strong { font-family: var(--font-display); font-size: 17px; font-weight: 400; }
        .g-seq-next { text-align: end; }
        @media (max-width: 600px) {
          .g-seq { grid-template-columns: 1fr; }
          .g-seq-next { text-align: start; }
          .d-row { grid-template-columns: 1fr auto; }
          .d-row-month { grid-column: 1 / -1; }
        }

        .g-back { margin-top: 32px; font-size: 14px; }
        .g-back a { text-decoration: underline; }
      `}</style>
    </>
  );
}
