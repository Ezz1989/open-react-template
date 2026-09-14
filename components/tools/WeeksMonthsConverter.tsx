"use client";

import { useState } from "react";
import type { Locale } from "@/lib/constants";
import { MONTH_LABEL, MONTH_WEEKS } from "@/lib/guide-content";
import { localizedNumber } from "@/lib/utils";

const T = {
  fromWeek: { en: "I know the week", ar: "أعرف الأسبوع" },
  fromMonth: { en: "I know the month", ar: "أعرف الشهر" },
  weekLabel: { en: "Pregnancy week (1–40)", ar: "أسبوع الحمل (١–٤٠)" },
  monthLabel: { en: "Pregnancy month (1–9)", ar: "شهر الحمل (١–٩)" },
  result: { en: "That's", ar: "هذا يعادل" },
} as const;

/** Reverse-lookup of `MONTH_WEEKS` — the same nine bands the monthly guide
 *  uses, so a week here lands on the exact month whose article covers it. */
function monthForWeek(week: number): number {
  for (const [month, [a, b]] of Object.entries(MONTH_WEEKS)) {
    if (week >= a && week <= b) return Number(month);
  }
  return 9;
}

export function WeeksMonthsConverter({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"week" | "month">("week");
  const [week, setWeek] = useState(20);
  const [month, setMonth] = useState(5);

  const resolvedMonth = mode === "week" ? monthForWeek(week) : month;
  const [a, b] = MONTH_WEEKS[resolvedMonth];

  return (
    <div className="t-card">
      <div className="t-tabs">
        <button
          type="button"
          className={mode === "week" ? "t-tab is-active" : "t-tab"}
          onClick={() => setMode("week")}
        >
          {T.fromWeek[locale]}
        </button>
        <button
          type="button"
          className={mode === "month" ? "t-tab is-active" : "t-tab"}
          onClick={() => setMode("month")}
        >
          {T.fromMonth[locale]}
        </button>
      </div>

      {mode === "week" ? (
        <>
          <label className="t-label" htmlFor="week-input">
            {T.weekLabel[locale]}
          </label>
          <input
            id="week-input"
            type="number"
            className="t-input"
            min={1}
            max={40}
            value={week}
            onChange={(e) => setWeek(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
          />
        </>
      ) : (
        <>
          <label className="t-label" htmlFor="month-input">
            {T.monthLabel[locale]}
          </label>
          <input
            id="month-input"
            type="number"
            className="t-input"
            min={1}
            max={9}
            value={month}
            onChange={(e) => setMonth(Math.min(9, Math.max(1, Number(e.target.value) || 1)))}
          />
        </>
      )}

      <div className="t-result">
        <p className="t-result-label">{T.result[locale]}</p>
        <p className="t-result-value">{MONTH_LABEL[resolvedMonth][locale]}</p>
        <p className="t-result-sub">
          {locale === "ar"
            ? `الأسابيع ${localizedNumber(a, locale)}–${localizedNumber(b, locale)}`
            : `Weeks ${a}–${b}`}
        </p>
      </div>
    </div>
  );
}
