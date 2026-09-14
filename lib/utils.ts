import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Arabic-Indic digits for Arabic, Latin for English. A raw `${n}` renders
 *  Latin digits inside Arabic text and looks imported — same rule
 *  `guide/[month]/page.tsx` already follows locally; shared here so the
 *  tools pages don't redefine it per component. */
export function localizedNumber(n: number, locale: Locale): string {
  return n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

/**
 * Gregorian + Hijri, always together — never Hijri alone (owner's standing
 * rule: a Hijri-only date is unreadable to a reader raised on the Gregorian
 * calendar, and vice versa).
 *
 * Uses the native `Intl` Umm al-Qura calendar (`islamic-umalqura`), verified
 * present in this Node runtime — no dependency needed. This is a computed
 * calendar; real moon-sighting announcements can differ by a day, which the
 * caller should caveat next to the date, not silently round.
 */
export function formatBothCalendars(date: Date, locale: Locale): { gregorian: string; hijri: string } {
  const gregorian = date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hijri = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura",
    { year: "numeric", month: "long", day: "numeric" },
  ).format(date);
  return { gregorian, hijri };
}

/** Same idea as `formatBothCalendars`, month + year only — for a due MONTH
 *  rather than a specific day (the cohort pages don't claim to know a
 *  reader's exact date, only which month she's due). */
export function formatMonthYearBothCalendars(date: Date, locale: Locale): { gregorian: string; hijri: string } {
  const gregorian = date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
  });
  const hijri = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura",
    { year: "numeric", month: "long" },
  ).format(date);
  return { gregorian, hijri };
}
