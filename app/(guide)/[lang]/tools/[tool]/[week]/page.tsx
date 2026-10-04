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
import { WEEK_PAGES } from "@/lib/tools-content";
import { MEDICAL_DISCLAIMER, MONTH_LABEL, MONTH_WEEKS } from "@/lib/guide-content";
import { localizedNumber } from "@/lib/utils";
import { GuideHeader, GuideFooter } from "@/components/guide/GuideChrome";

/**
 * /[lang]/tools/weeks-months/[week] — one answer page per pregnancy week for
 * "11 weeks in months" / "10 اسابيع كم شهر". GSC (2026-10-05) showed 56 such
 * queries reaching only the single converter page, at position 80+: one
 * interactive widget can't rank for 42 distinct questions.
 *
 * Pure arithmetic, no health claim: the pregnancy month comes from the same
 * nine bands as the monthly guide (MONTH_WEEKS), the calendar figure is
 * days ÷ 30.44 (mean Gregorian month).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    Array.from({ length: WEEK_PAGES }, (_, i) => ({ lang, tool: "weeks-months", week: String(i + 1) })),
  );
}

const DAYS_PER_MONTH = 30.44;

function monthForWeek(week: number): number {
  for (const [month, [a, b]] of Object.entries(MONTH_WEEKS)) if (week >= a && week <= b) return Number(month);
  return 9;
}

/** Arabic counted noun: 1 واحد, 2 dual, 3–10 plural, 11+ accusative singular. */
function arCount(n: number, [one, two, plural, single]: [string, string, string, string]): string {
  const num = localizedNumber(n, "ar");
  if (n === 1) return one;
  if (n === 2) return two;
  if (n <= 10) return `${num} ${plural}`;
  return `${num} ${single}`;
}
const AR_WEEK: [string, string, string, string] = ["أسبوع واحد", "أسبوعان", "أسابيع", "أسبوعاً"];
const AR_MONTH: [string, string, string, string] = ["شهر واحد", "شهران", "أشهر", "شهراً"];
const AR_DAY: [string, string, string, string] = ["يوم واحد", "يومان", "أيام", "يوماً"];
const en = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

function facts(week: number) {
  const days = week * 7;
  const months = Math.floor(days / DAYS_PER_MONTH);
  const restDays = Math.round(days - months * DAYS_PER_MONTH);
  const month = monthForWeek(week);
  return { days, months, restDays, month, band: MONTH_WEEKS[month], left: 40 - week };
}

function parse(p: { lang: string; tool: string; week: string }) {
  const locale = p.lang as Locale;
  const week = Number(p.week);
  if (!LOCALES.includes(locale) || p.tool !== "weeks-months") return null;
  if (!Number.isInteger(week) || week < 1 || week > WEEK_PAGES) return null;
  return { locale, week };
}

function copy(locale: Locale, week: number) {
  const f = facts(week);
  const ar = locale === "ar";
  const calendar = ar
    ? f.months === 0
      ? `${arCount(f.days, AR_DAY)}، أي أقل من شهر`
      : `${arCount(f.days, AR_DAY)}، أي ${arCount(f.months, AR_MONTH)}${f.restDays ? ` و${arCount(f.restDays, AR_DAY)}` : ""} تقريباً`
    : f.months === 0
      ? `${f.days} days, under one month`
      : `${f.days} days, about ${en(f.months, "month")}${f.restDays ? ` and ${en(f.restDays, "day")}` : ""}`;
  const past = week > 40;
  const band = ar
    ? `(الأسابيع ${localizedNumber(f.band[0], "ar")}–${localizedNumber(f.band[1], "ar")})`
    : `(weeks ${f.band[0]}–${f.band[1]})`;
  // Sentence built so the week count is never a grammatical subject: Arabic
  // would need case/gender agreement with it (أسبوع واحد يساوي, مدة أسبوعين…).
  const where = ar
    ? past
      ? `الأسبوع ${localizedNumber(week, "ar")} من الحمل يأتي بعد نهاية الشهر التاسع ${band} حسب تقسيم الأشهر التسعة الذي يعتمده دليل نواة.`
      : `الأسبوع ${localizedNumber(week, "ar")} من الحمل يقع في ${MONTH_LABEL[f.month].ar} حسب تقسيم الأشهر التسعة الذي يعتمده دليل نواة ${band}.`
    : past
      ? `Week ${week} of pregnancy comes after the end of month 9 ${band} on the nine-month split Nawah's guide uses.`
      : `Week ${week} of pregnancy falls in month ${f.month} on the nine-month split Nawah's guide uses ${band}.`;
  return {
    f,
    past,
    h1: ar ? `${arCount(week, AR_WEEK)} من الحمل كم شهر؟` : `${week} weeks pregnant in months`,
    metaTitle: ar ? `${week} أسبوع حمل كم شهر؟ | نواة` : `${week} Weeks Pregnant in Months | Nawah`,
    description: ar
      ? `${past ? `الأسبوع ${week} يأتي بعد الشهر التاسع` : `الأسبوع ${week} من الحمل يقع في ${MONTH_LABEL[f.month].ar}`}. بالحساب الميلادي ${week} أسبوع = ${f.days} يوم. الجواب مع جدول الأشهر التسعة.`
      : `${past ? `Week ${week} comes after month 9` : `Week ${week} of pregnancy falls in month ${f.month}`}. In calendar terms ${week} weeks is ${f.days} days. The answer, plus the nine-month table.`,
    answer: ar
      ? `${where} وبالحساب الميلادي، عدد الأيام حتى نهاية الأسبوع ${localizedNumber(week, "ar")} هو ${calendar}.`
      : `${where} In calendar terms, ${en(week, "week")} is ${calendar}.`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tool: string; week: string }>;
}): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const { locale, week } = parsed;
  const c = copy(locale, week);
  const path = (l: Locale) => `${SITE_URL}/${l}/tools/weeks-months/${week}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HREFLANG[l]] = path(l);
  languages["x-default"] = path(X_DEFAULT_LOCALE);
  return {
    title: c.metaTitle,
    description: c.description,
    alternates: { canonical: path(locale), languages },
    openGraph: { type: "website", title: c.metaTitle, description: c.description, url: path(locale), siteName: "Nawah" },
  };
}

export default async function WeekInMonthsPage({
  params,
}: {
  params: Promise<{ lang: string; tool: string; week: string }>;
}) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  const { locale, week } = parsed;
  const ar = locale === "ar";
  const c = copy(locale, week);
  const { f } = c;
  const num = (n: number) => localizedNumber(n, locale);
  const url = `${SITE_URL}/${locale}/tools/weeks-months/${week}`;
  const base = `/${locale}/tools/weeks-months`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ar ? "أدوات الحمل" : "Pregnancy tools", item: `${SITE_URL}/${locale}/tools` },
          { "@type": "ListItem", position: 2, name: ar ? "تحويل الأسابيع والشهور" : "Weeks ↔ months converter", item: `${SITE_URL}${base}` },
          { "@type": "ListItem", position: 3, name: c.h1, item: url },
        ],
      },
    ],
  };

  const rows: [string, string][] = [
    [
      ar ? "شهر الحمل" : "Pregnancy month",
      c.past ? (ar ? "بعد الشهر التاسع" : "After month 9") : ar ? MONTH_LABEL[f.month].ar : `Month ${f.month} of 9`,
    ],
    [ar ? "بالأيام" : "In days", ar ? arCount(f.days, AR_DAY) : `${f.days} days`],
    [
      ar ? "بالأشهر الميلادية" : "In calendar months",
      f.months === 0
        ? ar ? "أقل من شهر" : "Under one month"
        : ar
          ? `${arCount(f.months, AR_MONTH)}${f.restDays ? ` و${arCount(f.restDays, AR_DAY)}` : ""}`
          : `${en(f.months, "month")}${f.restDays ? ` ${en(f.restDays, "day")}` : ""}`,
    ],
    [
      ar ? "حتى الأسبوع ٤٠" : "Until week 40",
      f.left > 0 ? (ar ? arCount(f.left, AR_WEEK) : en(f.left, "week")) : ar ? "تجاوزتِ الأسبوع ٤٠" : "Past week 40",
    ],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <GuideHeader locale={locale} altPath={`/${ar ? "en" : "ar"}/tools/weeks-months/${week}`} variant="neutral" />

      <main className="container t-wrap">
        <article>
          <p className="eyebrow">{ar ? "تحويل الأسابيع والشهور" : "Weeks ↔ months"}</p>
          <h1 className="display-md g-h1">{c.h1}</h1>
          <p className="g-answer">{c.answer}</p>

          <table className="w-table">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="w-h2">{ar ? "لماذا يختلف الرقمان؟" : "Why the two numbers differ"}</h2>
          <p>
            {ar
              ? "شهور الحمل ليست أربعة أسابيع بالضبط لكل شهر: تسعة أشهر بمعدل ٤٫٤ أسبوع تقريباً تجمع ٤٠ أسبوعاً وليس ٣٦. لذلك يحسب الطبيب بالأسابيع، والشهر الذي تسمعينه من العائلة تقريب."
              : "Pregnancy months are not four weeks each: nine months of about 4.4 weeks add up to 40 weeks, not 36. That is why doctors count in weeks, and the month your family names is an approximation."}
          </p>
          <p>
            <Link href={`/${locale}/guide/${f.month}`} className="w-link">
              {ar ? `اقرئي دليل ${MONTH_LABEL[f.month].ar} ←` : `Read the guide to month ${f.month} →`}
            </Link>
          </p>

          <section className="g-cta">
            <h2>{ar ? "تابعي أكثر من مجرد رقم" : "Track more than one number"}</h2>
            <p>
              {ar
                ? "تطبيق نواة يحفظ كل هذا تلقائياً — الأسبوع، الوزن، الحركات، والتقلّصات — في مكان واحد."
                : "The Nawah app saves all of this automatically — week, weight, movements and contractions — in one place."}
            </p>
            <a className="btn btn-primary" href={toolsPlayUrl(locale, `weeks_${week}`)} rel="noopener">
              {ar ? "حمّلي التطبيق" : "Get the app"}
            </a>
          </section>

          <nav className="w-nav" aria-label={ar ? "أسابيع أخرى" : "Other weeks"}>
            {week > 1 && <Link href={`${base}/${week - 1}`}>{ar ? `→ الأسبوع ${num(week - 1)}` : `← Week ${week - 1}`}</Link>}
            {week < WEEK_PAGES && <Link href={`${base}/${week + 1}`}>{ar ? `الأسبوع ${num(week + 1)} ←` : `Week ${week + 1} →`}</Link>}
          </nav>

          <h2 className="w-h2">{ar ? "كل الأسابيع" : "Every week"}</h2>
          <ol className="w-grid">
            {Array.from({ length: WEEK_PAGES }, (_, i) => i + 1).map((w) => (
              <li key={w}>
                {w === week ? (
                  <span aria-current="page">{num(w)}</span>
                ) : (
                  <Link href={`${base}/${w}`} aria-label={ar ? `الأسبوع ${num(w)}` : `Week ${w}`}>
                    {num(w)}
                  </Link>
                )}
              </li>
            ))}
          </ol>

          <p className="g-disclaimer">{MEDICAL_DISCLAIMER[locale]}</p>
          <p className="g-back">
            <Link href={base}>{ar ? "→ محوّل الأسابيع والشهور" : "← Weeks ↔ months converter"}</Link>
          </p>
        </article>
      </main>

      <GuideFooter locale={locale} />

      <style>{`
        .t-wrap { max-width: 640px; padding-block: 48px 0; }
        .g-h1 { margin: 10px 0 20px; }
        .g-answer { font-size: 18px; line-height: 1.75; margin-bottom: 24px; }
        .w-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        .w-table th, .w-table td { padding: 12px 14px; border: 1px solid var(--border); text-align: start; }
        .w-table th { width: 45%; font-weight: 500; color: var(--fg-muted); background: var(--bg-elev); }
        .w-h2 { font-family: var(--font-display); font-size: 22px; font-weight: 400; margin: 32px 0 12px; }
        .w-link { text-decoration: underline; }
        .g-cta { margin-top: 40px; padding: 28px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius-md); }
        .g-cta h2 { font-family: var(--font-display); font-size: 24px; font-weight: 400; margin-bottom: 10px; }
        .g-cta p { line-height: 1.7; margin-bottom: 18px; }
        .w-nav { display: flex; justify-content: space-between; margin-top: 32px; font-size: 15px; }
        .w-nav a { text-decoration: underline; }
        .w-grid { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .w-grid a, .w-grid span {
          display: block; text-align: center; padding: 8px 0; font-size: 14px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
        }
        .w-grid span { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        .g-disclaimer { margin-top: 32px; padding: 18px; background: var(--bg-elev); border-radius: var(--radius-sm); font-size: 13px; line-height: 1.7; color: var(--fg-muted); }
        .g-back { margin-top: 32px; font-size: 14px; }
        .g-back a { text-decoration: underline; }
      `}</style>
    </>
  );
}
