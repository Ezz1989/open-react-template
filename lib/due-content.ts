import { MONTH_WEEKS, getMonth, type GuideMonth } from "./guide-content";

/**
 * Birth-month cohort pages — the site's answer to the forum format that
 * dominates Gulf pregnancy communities: "تجمع حوامل يناير 2027" (a thread for
 * everyone due that month). See عالم حواء / UAEWomen / hawahome / 7amal —
 * every one of them runs this exact grouping, at thread-per-thread scale.
 *
 * ⚠️ DEVIATION FROM THE ORIGINAL PLAN WORDING: the plan described each page
 * as showing "which pregnancy week that cohort is in today". That doesn't
 * hold up on inspection — a cohort due the same month started at different
 * real dates, so one "current week" would be wrong for most of them, and
 * these are static pages (`dynamicParams = false`), so a "today" baked in at
 * build time goes stale the moment a week passes without a redeploy, with no
 * way to notice or correct it.
 *
 * Built instead as a full 9-month TIMELINE for the due month — which real
 * calendar month corresponds to each of the site's nine guide months, for
 * someone due here. That's accurate for every reader on every visit
 * regardless of when the page was built, and it's a real forward link into
 * the guide series rather than one frozen data point.
 */

export interface CohortSlug {
  year: number;
  month: number; // 1-12, calendar month
}

export function cohortSlug(c: CohortSlug): string {
  return `${c.year}-${String(c.month).padStart(2, "0")}`;
}

export function parseCohortSlug(slug: string): CohortSlug | null {
  const m = /^(\d{4})-(\d{2})$/.exec(slug);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

/**
 * The next N calendar months INCLUDING the current one. "Due this month" is
 * still a real, wanted cohort — arguably the most urgent one — and it is
 * also exactly where the due-date calculator's own result can link (LMP up
 * to today → EDD up to ~9 months out, which can land in the current month
 * for a near-term pregnancy). Excluding it here would 404 that link for
 * precisely the users closest to giving birth.
 */
export function upcomingCohorts(count = 24, from: Date = new Date()): CohortSlug[] {
  const out: CohortSlug[] = [];
  let y = from.getFullYear();
  let m = from.getMonth() + 1; // 1-12, current month first
  for (let i = 0; i < count; i++) {
    out.push({ year: y, month: m });
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

/** The 15th of the cohort's due month — a representative EDD used only to
 *  derive the calendar-month timeline below, never shown to the reader as
 *  "your" date (a specific reader's real EDD is a different tool: the due-
 *  date calculator at /tools/due-date). */
export function representativeDueDate(c: CohortSlug): Date {
  return new Date(c.year, c.month - 1, 15);
}

export interface TimelineRow {
  month: number; // 1-9, the guide's month number
  weeks: [number, number];
  trimester: 1 | 2 | 3;
  periodStart: Date;
  periodEnd: Date;
  guide?: GuideMonth;
}

/**
 * For each of the site's nine guide months, the approximate calendar period
 * a person due on `dueDate` would have lived through it — dueDate minus
 * (40 - endWeek) weeks through dueDate minus (40 - startWeek) weeks, since
 * week 40 is due week. `trimester` comes from the guide month's OWN field
 * (`guide-content.ts`), not re-derived, so a cohort page never disagrees
 * with the article it links to about which trimester a month falls in.
 */
export function cohortTimeline(c: CohortSlug): TimelineRow[] {
  const dueDate = representativeDueDate(c);
  const rows: TimelineRow[] = [];
  for (let month = 1; month <= 9; month++) {
    const [a, b] = MONTH_WEEKS[month];
    const periodStart = new Date(dueDate);
    periodStart.setDate(periodStart.getDate() - (40 - a + 1) * 7);
    const periodEnd = new Date(dueDate);
    periodEnd.setDate(periodEnd.getDate() - (40 - b) * 7);
    const guide = getMonth(month);
    rows.push({
      month,
      weeks: [a, b],
      trimester: guide?.trimester ?? (month <= 3 ? 1 : month <= 6 ? 2 : 3),
      periodStart,
      periodEnd,
      guide,
    });
  }
  return rows;
}
