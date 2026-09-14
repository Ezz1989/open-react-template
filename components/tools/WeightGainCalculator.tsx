"use client";

import { useState } from "react";
import type { Locale } from "@/lib/constants";
import { localizedNumber } from "@/lib/utils";

const T = {
  weight: { en: "Pre-pregnancy weight (kg)", ar: "الوزن قبل الحمل (كجم)" },
  height: { en: "Height (cm)", ar: "الطول (سم)" },
  bmi: { en: "Your pre-pregnancy BMI", ar: "مؤشر كتلة جسمك قبل الحمل" },
  range: { en: "Healthy total weight gain", ar: "الزيادة الصحية الإجمالية في الوزن" },
  categories: {
    under: { en: "Underweight (BMI under 18.5)", ar: "نقص في الوزن (كتلة الجسم أقل من ١٨.٥)" },
    normal: { en: "Normal weight (BMI 18.5–24.9)", ar: "وزن طبيعي (كتلة الجسم ١٨.٥–٢٤.٩)" },
    over: { en: "Overweight (BMI 25–29.9)", ar: "زيادة في الوزن (كتلة الجسم ٢٥–٢٩.٩)" },
    obese: { en: "Obese (BMI 30 or above)", ar: "سمنة (كتلة الجسم ٣٠ فأكثر)" },
  },
} as const;

/**
 * CDC total-gestational-weight-gain ranges by pre-pregnancy BMI, for a
 * singleton pregnancy — fetched from cdc.gov/maternal-infant-health/
 * pregnancy-weight/index.html on 2026-09-15 (source given in `lib/
 * tools-content.ts`'s citation for this tool). CDC states pounds; these kg
 * figures are that same lb range × 0.45359237, rounded to one decimal —
 * not re-derived from a different (unfetched) kg table, so they trace to
 * one source rather than mixing two.
 */
const RANGES = [
  { max: 18.5, key: "under", kg: [12.7, 18.1] as const, lb: [28, 40] as const },
  { max: 25, key: "normal", kg: [11.3, 15.9] as const, lb: [25, 35] as const },
  { max: 30, key: "over", kg: [6.8, 11.3] as const, lb: [15, 25] as const },
  { max: Infinity, key: "obese", kg: [5.0, 9.1] as const, lb: [11, 20] as const },
] as const;

export function WeightGainCalculator({ locale }: { locale: Locale }) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const w = Number(weight);
  const h = Number(height) / 100;
  const bmi = w > 0 && h > 0 ? w / (h * h) : null;
  const row = bmi !== null ? RANGES.find((r) => bmi < r.max) ?? RANGES[RANGES.length - 1] : null;

  return (
    <div className="t-card">
      <label className="t-label" htmlFor="wg-weight">
        {T.weight[locale]}
      </label>
      <input
        id="wg-weight"
        type="number"
        inputMode="decimal"
        className="t-input"
        min={30}
        max={200}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <label className="t-label" style={{ marginTop: 14 }} htmlFor="wg-height">
        {T.height[locale]}
      </label>
      <input
        id="wg-height"
        type="number"
        inputMode="decimal"
        className="t-input"
        min={120}
        max={210}
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      {row && bmi && (
        <div className="t-result">
          <p className="t-result-label">{T.bmi[locale]}</p>
          <p className="t-result-value">{localizedNumber(Math.round(bmi * 10) / 10, locale)}</p>
          <p className="t-result-sub">{T.categories[row.key][locale]}</p>

          <p className="t-result-label" style={{ marginTop: 18 }}>
            {T.range[locale]}
          </p>
          <p className="t-result-value">
            {localizedNumber(row.kg[0], locale)}–{localizedNumber(row.kg[1], locale)} {locale === "ar" ? "كجم" : "kg"}
          </p>
          <p className="t-result-sub">
            {localizedNumber(row.lb[0], locale)}–{localizedNumber(row.lb[1], locale)} {locale === "ar" ? "رطل" : "lb"}
          </p>
        </div>
      )}
    </div>
  );
}
