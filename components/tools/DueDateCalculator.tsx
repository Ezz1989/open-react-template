"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/constants";
import { formatBothCalendars, localizedNumber } from "@/lib/utils";
import { cohortSlug } from "@/lib/due-content";

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
  timeline: { en: "See your full nine-month timeline →", ar: "شوفي رحلتك التسعة أشهر كاملة ←" },
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

          {/* Only linked when the due month is this month or later. An LMP
              old enough to put the due date in the past (clamped week 42,
              already overdue by the calculator's own math) has no matching
              static page — those cohorts have no future search traffic, so
              the fix is not linking rather than generating pages nobody
              would look for. */}
          {(result.due.getFullYear() > new Date().getFullYear() ||
            (result.due.getFullYear() === new Date().getFullYear() &&
              result.due.getMonth() >= new Date().getMonth())) && (
            <p style={{ marginTop: 18 }}>
              <Link
                href={`/${locale}/due/${cohortSlug({ year: result.due.getFullYear(), month: result.due.getMonth() + 1 })}`}
                className="t-hint"
                style={{ textDecoration: "underline" }}
              >
                {T.timeline[locale]}
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
