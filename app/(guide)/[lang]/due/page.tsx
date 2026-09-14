import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HREFLANG, LOCALES, SITE_URL, X_DEFAULT_LOCALE, type Locale } from "@/lib/constants";
import { cohortSlug, upcomingCohorts, representativeDueDate } from "@/lib/due-content";
import { formatMonthYearBothCalendars } from "@/lib/utils";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * "متى موعد ولادتك؟" hub — picks a due month, same self-sorting the Gulf's
 * "تجمع حوامل [شهر] [سنة]" forum threads run on (عالم حواء, UAEWomen,
 * hawahome, 7amal), but as a durable page instead of a thread that goes
 * quiet after its month passes.
 */

const HUB = {
  title: { en: "When are you due?", ar: "متى موعد ولادتك؟" },
  metaTitle: { en: "Due Date by Month — Your Pregnancy Timeline | Nawah", ar: "موعد ولادتك حسب الشهر — رحلة حملك | نواة" },
  description: {
    en: "Pick your due month to see your whole nine-month timeline, mapped to real calendar months.",
    ar: "اختاري شهر ولادتك لترَي رحلة حملك التسعة أشهر كاملة، مربوطة بأشهر التقويم الفعلية.",
  },
} as const;

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

  const path = (l: Locale) => `${SITE_URL}/${l}/due`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);

  return {
    title: HUB.metaTitle[locale],
    description: HUB.description[locale],
    alternates: { canonical: path(locale), languages },
    openGraph: {
      type: "website",
      title: HUB.metaTitle[locale],
      description: HUB.description[locale],
      url: path(locale),
      siteName: "Nawah",
      locale: locale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function DueHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  if (!LOCALES.includes(locale)) notFound();

  const cohorts = upcomingCohorts(24);

  return (
    <>
      <GuideHeader locale={locale} altPath={`/${locale === "en" ? "ar" : "en"}/due`} variant="neutral" />

      <main className="container g-hub">
        <h1 className="display-md">{HUB.title[locale]}</h1>
        <p className="g-hub-stand">{HUB.description[locale]}</p>

        <ol className="n-grid" style={{ marginTop: 40 }}>
          {cohorts.map((c) => {
            const { gregorian, hijri } = formatMonthYearBothCalendars(representativeDueDate(c), locale);
            return (
              <li key={cohortSlug(c)}>
                <Link href={`/${locale}/due/${cohortSlug(c)}`}>
                  <span className="n-grid-name">{gregorian}</span>
                  <span className="n-grid-meaning">{hijri}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .g-hub { max-width: 1000px; padding-block: 56px 0; }
        .g-hub-stand { margin-top: 16px; font-size: 19px; line-height: 1.65; color: var(--fg-muted); }
        .n-grid {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .n-grid a {
          display: block; padding: 16px 18px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg-elev); transition: border-color 0.2s var(--ease);
        }
        .n-grid a:hover { border-color: var(--accent); }
        .n-grid-name { display: block; font-family: var(--font-display); font-size: 19px; }
        .n-grid-meaning { display: block; margin-top: 4px; font-size: 13px; color: var(--fg-muted); }
        @media (max-width: 720px) { .n-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px) { .n-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
