"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/constants";
import { localizedNumber } from "@/lib/utils";

const T = {
  start: { en: "Start contraction", ar: "بدء التقلّص" },
  stop: { en: "Stop", ar: "إيقاف" },
  duration: { en: "This one lasted", ar: "استمر هذا لمدة" },
  gap: { en: "Since the last one", ar: "منذ السابق" },
  history: { en: "Recent contractions", ar: "التقلّصات الأخيرة" },
  matched: {
    en: "Pattern matches the 5-1-1 rule — this usually means it's time to head to your hospital or midwife. Call them to confirm.",
    ar: "النمط يطابق قاعدة ٥-١-١ — عادة ما يعني هذا حان وقت التوجه للمستشفى أو التواصل مع القابلة. اتصلي بها للتأكيد.",
  },
} as const;

interface Contraction {
  start: number;
  end: number;
  gapFromPrevious: number | null;
}

function formatMinSec(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

/**
 * "5-1-1": contractions 5 minutes apart, lasting 1 minute each, for at
 * least 1 hour straight — verified against texashealth.org (fetched
 * 2026-09-15, cited in `lib/tools-content.ts`). Approximated here as: the
 * last 3+ contractions each lasted ≥60s, each gap was ≤5min, and the span
 * from the first of those to now is ≥60min.
 */
function matches511(history: Contraction[]): boolean {
  if (history.length < 3) return false;
  // No length cap: the streak has to SPAN 60 real minutes, and 5-minute-apart
  // contractions only cover ~5 per 25 minutes — a cap here (this function
  // used to stop at the 12 most recent) can silently make a textbook 5-1-1
  // pattern never span 60 minutes at all, no matter how long it continues.
  // `history` is one browser session's worth of taps, never large enough to
  // make walking all of it a real cost.
  let streak: Contraction[] = [];
  for (const c of history) {
    const durationOk = c.end - c.start >= 60_000;
    const gapOk = c.gapFromPrevious === null || c.gapFromPrevious <= 5 * 60_000;
    if (durationOk && gapOk) streak.push(c);
    else break;
  }
  if (streak.length < 3) return false;
  const span = streak[0].end - streak[streak.length - 1].start;
  return span >= 60 * 60_000;
}

export function ContractionTimer({ locale }: { locale: Locale }) {
  const [isContracting, setIsContracting] = useState(false);
  const [contractionStart, setContractionStart] = useState<number | null>(null);
  const [history, setHistory] = useState<Contraction[]>([]); // most-recent-first
  const [, forceTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isContracting) return;
    tickRef.current = setInterval(() => forceTick((n) => n + 1), 250);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isContracting]);

  function start() {
    setIsContracting(true);
    setContractionStart(Date.now());
  }

  function stop() {
    if (contractionStart === null) return;
    const end = Date.now();
    const previous = history[0];
    const gapFromPrevious = previous ? contractionStart - previous.end : null;
    setHistory((h) => [{ start: contractionStart, end, gapFromPrevious }, ...h]);
    setIsContracting(false);
    setContractionStart(null);
  }

  const liveDuration = isContracting && contractionStart ? Date.now() - contractionStart : 0;
  const last = history[0];
  const flagged = matches511(history);

  return (
    <div className="t-card t-card-center">
      <button
        type="button"
        className={isContracting ? "t-tap-btn t-tap-btn-active" : "t-tap-btn"}
        onClick={isContracting ? stop : start}
      >
        <span className="t-tap-count">{isContracting ? formatMinSec(liveDuration) : "●"}</span>
        <span className="t-tap-label">{isContracting ? T.stop[locale] : T.start[locale]}</span>
      </button>

      {last && !isContracting && (
        <div className="t-tap-stats">
          <div>
            <span className="t-result-label">{T.duration[locale]}</span>
            <span className="t-result-value">{formatMinSec(last.end - last.start)}</span>
          </div>
          {last.gapFromPrevious !== null && (
            <div>
              <span className="t-result-label">{T.gap[locale]}</span>
              <span className="t-result-value">{formatMinSec(last.gapFromPrevious)}</span>
            </div>
          )}
        </div>
      )}

      {flagged && <p className="t-hint t-hint-warn">{T.matched[locale]}</p>}

      {history.length > 0 && (
        <div className="t-history">
          <p className="t-result-label">{T.history[locale]}</p>
          <ul>
            {history.slice(0, 8).map((c, i) => (
              <li key={c.start}>
                {new Date(c.start).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" · "}
                {formatMinSec(c.end - c.start)}
                {c.gapFromPrevious !== null && ` · +${formatMinSec(c.gapFromPrevious)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
