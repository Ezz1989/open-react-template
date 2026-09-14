"use client";

import { useState } from "react";
import type { Locale } from "@/lib/constants";
import { formatBothCalendars, localizedNumber } from "@/lib/utils";

const T = {
  label: { en: "First day of your last period", ar: "أول يوم من آخر دورة شهرية" },
  cta: { en: "Calculate", ar: "احسبي" },
  due: { en: "Estimated due date", ar: "موعد الولادة المتوقع" },
  week: { en: "You are currently in week", ar: "أنتِ الآن في الأسبوع" },
  weekOf: { en: "of 40", ar: "من ٤٠" },
  notYet: {
    en: "Enter a date to see your due date and current week.",
    ar: "أدخلي التاريخ لمعرفة موعد ولادتك وأسبوعك الحالي.",
  },
  future: {
    en: "That date is in the future — pick the first day of your last period.",
    ar: "هذا التاريخ في المستقبل — اختاري أول يوم من آخر دورة شهرية.",
  },
} as const;

/**
 * EDD = LMP + 280 days; week = floor(days since LMP / 7), clamped 0–42.
 * Exact formula the app itself uses — see
 * `lib/features/auth/pregnancy_setup_screen.dart` (`_calculatedEDD`,
 * `_gestationalWeek`) — ported here rather than re-derived, so web and app
 * never disagree on a due date from the same LMP.
 */
function computeFromLmp(lmp: Date) {
  const due = new Date(lmp);
  due.setDate(due.getDate() + 280);
  const days = Math.floor((Date.now() - lmp.getTime()) / 86_400_000);
  const week = Math.min(42, Math.max(0, Math.floor(days / 7)));
  return { due, week };
}

export function DueDateCalculator({ locale }: { locale: Locale }) {
  const [value, setValue] = useState("");
  const lmp = value ? new Date(value + "T00:00:00") : null;
  const isFuture = lmp ? lmp.getTime() > Date.now() : false;
  const result = lmp && !isFuture ? computeFromLmp(lmp) : null;

  return (
    <div className="t-card">
      <label className="t-label" htmlFor="lmp-date">
        {T.label[locale]}
      </label>
      <input
        id="lmp-date"
        type="date"
        className="t-input"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => setValue(e.target.value)}
      />

      {!value && <p className="t-hint">{T.notYet[locale]}</p>}
      {isFuture && <p className="t-hint t-hint-warn">{T.future[locale]}</p>}

      {result && (
        <div className="t-result">
          <p className="t-result-label">{T.due[locale]}</p>
          <p className="t-result-value">{formatBothCalendars(result.due, locale).gregorian}</p>
          <p className="t-result-sub">{formatBothCalendars(result.due, locale).hijri}</p>

          <p className="t-result-label" style={{ marginTop: 18 }}>
            {T.week[locale]}
          </p>
          <p className="t-result-value">
            {localizedNumber(result.week, locale)} <span className="t-result-of">{T.weekOf[locale]}</span>
          </p>
        </div>
      )}
    </div>
  );
}
