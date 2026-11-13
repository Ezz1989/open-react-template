import part1 from "@/content/father-months/part1_months_1-5.json";
import type { Localized } from "@/lib/guide-content";

/**
 * Father month-by-month pages (/[lang]/father/months/[month]), added 2026-11-13 from the Deep Research
 * keyword row: Google autocomplete (SA + EG) shows «دور الزوج في الشهر …» / «كيف اتعامل مع زوجتي الحامل في
 * الشهر …». Gemini wrote the copy (ALT AI/prompts/02-website-articles/2026-11-13_father_months_and_articles_GEMINI.txt)
 * from the app's father weekly actions + one NHS week page per month; Claude checked every number and size
 * against those NHS pages. Months 6–9 arrive as part 2: add its JSON to PARTS and nothing else changes.
 */
export type FatherMonth = {
  month: number;
  slug: string;
  title: Localized;
  metaTitle: Localized;
  description: Localized;
  intro: Localized;
  whatHappens: Localized;
  howToHelp: { ar: string[]; en: string[] };
  callDoctor: Localized | null;
  appLine: Localized;
  sources: { name: string; url: string }[];
};

const PARTS: FatherMonth[][] = [part1 as FatherMonth[]];

export const FATHER_MONTHS: FatherMonth[] = PARTS.flat().sort((a, b) => a.month - b.month);

export function getFatherMonth(month: number): FatherMonth | undefined {
  return FATHER_MONTHS.find((m) => m.month === month);
}
