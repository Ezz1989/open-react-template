"use client";

import { useState } from "react";
import type { Locale } from "@/lib/constants";
import { formatBothCalendars } from "@/lib/utils";

const T = {
  lastPeriod: { en: "First day of your last period", ar: "أول يوم من آخر دورة شهرية" },
  cycleLength: { en: "Average cycle length (days)", ar: "متوسط طول الدورة (بالأيام)" },
  ovulation: { en: "Estimated ovulation day", ar: "يوم التبويض المتوقع" },
  fertile: { en: "Fertile window", ar: "نافذة الخصوبة" },
  through: { en: "through", ar: "حتى" },
} as const;

/**
 * Ovulation date ≈ next expected period − 14 days (the average luteal-phase
 * length). Fertile window ≈ the ~6 days ending on ovulation day. Both
 * verified against fetched sources this session (see this tool's
 * `citations` in `lib/tools-content.ts`) — not a recalled formula.
 */
function computeOvulation(lmp: Date, cycleLength: number) {
  const nextPeriod = new Date(lmp);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(ovulation.getDate() - 14);
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);
  return { ovulation, fertileStart };
}

export function OvulationCalculator({ locale }: { locale: Locale }) {
  const [value, setValue] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const lmp = value ? new Date(value + "T00:00:00") : null;
  const result = lmp ? computeOvulation(lmp, cycleLength) : null;

  return (
    <div className="t-card">
      <label className="t-label" htmlFor="ov-lmp">
        {T.lastPeriod[locale]}
      </label>
      <input
        id="ov-lmp"
        type="date"
        className="t-input"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => setValue(e.target.value)}
      />

      <label className="t-label" style={{ marginTop: 14 }} htmlFor="ov-cycle">
        {T.cycleLength[locale]}
      </label>
      <input
        id="ov-cycle"
        type="number"
        className="t-input"
        min={20}
        max={40}
        value={cycleLength}
        onChange={(e) => setCycleLength(Math.min(40, Math.max(20, Number(e.target.value) || 28)))}
      />

      {result && (
        <div className="t-result">
          <p className="t-result-label">{T.ovulation[locale]}</p>
          <p className="t-result-value">{formatBothCalendars(result.ovulation, locale).gregorian}</p>
          <p className="t-result-sub">{formatBothCalendars(result.ovulation, locale).hijri}</p>

          <p className="t-result-label" style={{ marginTop: 18 }}>
            {T.fertile[locale]}
          </p>
          <p className="t-result-value" style={{ fontSize: 18 }}>
            {formatBothCalendars(result.fertileStart, locale).gregorian} {T.through[locale]}{" "}
            {formatBothCalendars(result.ovulation, locale).gregorian}
          </p>
        </div>
      )}
    </div>
  );
}
