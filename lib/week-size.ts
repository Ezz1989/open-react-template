/**
 * Per-week baby size for /[lang]/tools/weeks-months/<n> (2026-11-06), so each week page carries a sourced fact
 * of its own instead of arithmetic only (WEBSITE_PLAN_2026-11 §1c).
 *
 * Mirrors the app exactly: `../lib/core/utils/baby_size.dart` (lengths + comparison ladder) and the MSA `ar` /
 * `en` ARB strings (babySize*, babySizeLengthCm). Length = the figure on that week's NHS page (fetched by the app
 * team 2026-10-22). Weeks 1–3 and 41+ have no NHS page → null, nothing shown (no number without a source).
 */

const NHS_CM = [
  0.2, 0.2, 0.6, 1.0, 1.6, 2.2, 3.0, 4.1, 5.4, 7.4, 8.5, 10.1, 11.6, 12.0, 14.2, 15.3, // weeks 4–19
  25.6, 26.7, 27.8, 28.9, 30.0, 34.6, 35.6, 36.6, 37.6, 38.6, 39.9, 41.1, 42.4, //       weeks 20–32 (head to heel from 20)
  43.7, 45.0, 46.2, 47.4, 48.6, 49.8, 50.7, 51.2, //                                      weeks 33–40
];

/** [last week of the slot, ar, en] — same thresholds as babySizeForWeek(). */
const LADDER: [number, string, string][] = [
  [5, "بذرة الطماطم", "Poppy seed"],
  [6, "حبة بازلاء", "Sweet pea"],
  [8, "توت أحمر", "Raspberry"],
  [10, "فراولة", "Strawberry"],
  [12, "ليمون أخضر", "Lime"],
  [14, "ليمون", "Lemon"],
  [16, "أفوكادو", "Avocado"],
  [18, "فلفل حلو", "Bell pepper"],
  [19, "موزة", "Banana"],
  [22, "بابايا", "Papaya"],
  [24, "ذرة", "Corn"],
  [26, "خس", "Lettuce"],
  [28, "قرنبيط", "Cauliflower"],
  [30, "كرنب", "Cabbage"],
  [32, "كوسة", "Squash"],
  [34, "أناناس", "Pineapple"],
  [36, "شمّام", "Honeydew"],
  [38, "بطيخ", "Watermelon"],
  [40, "قرع", "Pumpkin"],
];

const NHS_WEEKS = "https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy";

export interface WeekSize {
  cm: number;
  item: { ar: string; en: string };
  /** The NHS page the length comes from (same URL rule as the app's MedicalSources.nhsWeek). */
  nhsUrl: string;
}

export function weekSize(week: number): WeekSize | null {
  if (week < 4 || week > 40) return null;
  const [, ar, en] = LADDER.find(([last]) => week <= last)!;
  const trimester = week <= 12 ? "1st" : week <= 27 ? "2nd" : "3rd";
  return { cm: NHS_CM[week - 4], item: { ar, en }, nhsUrl: `${NHS_WEEKS}/${trimester}-trimester/week-${week}/` };
}
