"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/constants";
import { localizedNumber } from "@/lib/utils";

const T = {
  tap: { en: "Tap for every kick", ar: "اضغطي مع كل ركلة" },
  count: { en: "Movements felt", ar: "الحركات المحسوسة" },
  elapsed: { en: "Time elapsed", ar: "الوقت المنقضي" },
  reset: { en: "Reset", ar: "إعادة" },
  reached: {
    en: "10 movements felt — that's the typical range ACOG describes.",
    ar: "وصلتِ لعشر حركات — هذا هو المدى الطبيعي الذي تصفه ACOG.",
  },
} as const;

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function KickCounter({ locale }: { locale: Locale }) {
  const [count, setCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startedAt === null) return;
    intervalRef.current = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startedAt]);

  function tap() {
    if (startedAt === null) setStartedAt(Date.now());
    setCount((c) => c + 1);
  }

  function reset() {
    setCount(0);
    setStartedAt(null);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  const reachedTen = count >= 10;

  return (
    <div className="t-card t-card-center">
      <button type="button" className="t-tap-btn" onClick={tap} aria-label={T.tap[locale]}>
        <span className="t-tap-count">{localizedNumber(count, locale)}</span>
        <span className="t-tap-label">{T.tap[locale]}</span>
      </button>

      <div className="t-tap-stats">
        <div>
          <span className="t-result-label">{T.count[locale]}</span>
          <span className="t-result-value">{localizedNumber(count, locale)}</span>
        </div>
        <div>
          <span className="t-result-label">{T.elapsed[locale]}</span>
          <span className="t-result-value">{formatElapsed(elapsed)}</span>
        </div>
      </div>

      {reachedTen && <p className="t-hint t-hint-good">{T.reached[locale]}</p>}

      <button type="button" className="btn btn-ghost" onClick={reset}>
        {T.reset[locale]}
      </button>
    </div>
  );
}
