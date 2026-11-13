"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/constants";
import { localizedNumber } from "@/lib/utils";

/**
 * "How far along is someone due in <month>?" — the exact query these cohort pages rank for (GSC 2026-11-13,
 * positions 9–19). Computed in the visitor's browser on every visit, so it never goes stale the way a value
 * baked in at build time would (the reason lib/due-content.ts gave for leaving it out). Range = due on the
 * last day of the month (least along) … due on the 1st (most along); week = floor((280 − days to due) / 7),
 * the same formula as DueDateCalculator and the app. Renders nothing for a cohort that is not pregnant yet or
 * already past week 42. Labels are the calculator's own strings.
 */
const T = {
  week: { en: "You are currently in week", ar: "أنتِ الآن في الأسبوع" },
  weekOf: { en: "of 40", ar: "من ٤٠" },
} as const;

const DAY = 86_400_000;

function weekIfDue(due: Date, now: Date): number {
  return Math.floor((280 - Math.ceil((due.getTime() - now.getTime()) / DAY)) / 7);
}

export function DueToday({ year, month, locale }: { year: number; month: number; locale: Locale }) {
  const [range, setRange] = useState<[number, number] | null>(null);

  useEffect(() => {
    const now = new Date();
    const lo = weekIfDue(new Date(year, month, 0), now); // last day of the due month
    const hi = weekIfDue(new Date(year, month - 1, 1), now); // 1st of the due month
    if (hi < 1 || lo > 42) return;
    setRange([Math.max(1, lo), Math.min(42, hi)]);
  }, [year, month]);

  if (!range) return null;
  const [a, b] = range;
  const n = (x: number) => localizedNumber(x, locale);
  return (
    <p className="d-today">
      {T.week[locale]} <strong>{a === b ? n(a) : `${n(a)}–${n(b)}`}</strong> {T.weekOf[locale]}
    </p>
  );
}

// Self-check (node --test-free): due 15 Mar 2027, viewed 13 Nov 2026 → 122 days to go → week 22.
if (process.env.NODE_ENV === "development") {
  console.assert(weekIfDue(new Date(2027, 2, 15), new Date(2026, 10, 13)) === 22, "DueToday week formula");
}
