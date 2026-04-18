"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { GrowthVisualizer } from "./GrowthVisualizer";

const WEEK_KEYS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function HeroSection() {
  const { t } = useLang();
  const [week, setWeek] = useState(12);

  const snappedKey = WEEK_KEYS.reduce((a, b) => (Math.abs(b - week) < Math.abs(a - week) ? b : a));
  const pct = Math.round((week / 40) * 100);

  // force subtle re-animation pulse on week change for visualizer
  const [, setPulse] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setPulse((p) => p + 1), 50);
    return () => clearTimeout(id);
  }, [week]);

  return (
    <section id="hero" style={{ paddingTop: 140, paddingBottom: 100, position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 80% 10%, color-mix(in oklch, var(--accent), transparent 88%), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        <div
          className="hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 60, alignItems: "center" }}
        >
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28 }}>
              <span className="chip">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                {t("hero.badge") as string}
              </span>
              <span className="ar muted" style={{ fontSize: 14 }}>
                نواة
              </span>
            </div>

            <h1 className="display-xl" id="hero-headline">
              {t("hero.headlineA") as string}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--accent-strong)" }}>
                {t("hero.headlineB") as string}
              </em>
            </h1>

            <p style={{ marginTop: 28, fontSize: 19, color: "var(--fg-muted)", maxWidth: 520, lineHeight: 1.55 }}>
              {t("hero.sub") as string}
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
              <a href={PLAY_STORE_URL} className="btn btn-store" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5V3.5c0-.27.11-.52.29-.7L13 12l-9.71 9.2c-.18-.18-.29-.43-.29-.7zM14.14 12l2.65-2.51 3.82 2.18c.56.32.56 1.14 0 1.46l-3.82 2.18L14.14 12zM5.29 2.5l10.39 5.93-2.44 2.31L5.29 2.5zM5.29 21.5l7.95-7.74 2.44 2.31L5.29 21.5z" />
                </svg>
                <span>
                  <small>{t("cta.downloadSmall") as string}</small>
                  <strong>{t("cta.downloadBig") as string}</strong>
                </span>
              </a>
            </div>

            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
                fontSize: 13,
                color: "var(--fg-muted)",
              }}
            >
              <div>
                <strong
                  style={{
                    color: "var(--fg)",
                    fontSize: 20,
                    fontFamily: "var(--font-display)",
                    display: "block",
                  }}
                >
                  {t("hero.stat1Num") as string}
                </strong>
                {t("hero.stat1Label") as string}
              </div>
              <div>
                <strong
                  style={{
                    color: "var(--fg)",
                    fontSize: 20,
                    fontFamily: "var(--font-display)",
                    display: "block",
                  }}
                >
                  {t("hero.stat2Num") as string}
                </strong>
                {t("hero.stat2Label") as string}
              </div>
              <div>
                <strong
                  style={{
                    color: "var(--fg)",
                    fontSize: 20,
                    fontFamily: "var(--font-display)",
                    display: "block",
                  }}
                >
                  {t("hero.stat3Num") as string}
                </strong>
                {t("hero.stat3Label") as string}
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <GrowthVisualizer week={snappedKey} weekVal={week} />

            <div
              style={{
                marginTop: 24,
                padding: "22px 26px",
                background: "var(--bg-elev)",
                borderRadius: 20,
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "var(--fg-muted)",
                  marginBottom: 10,
                }}
              >
                <span>{t("hero.scrubHint") as string}</span>
                <span>
                  {(t("hero.weekLabel") as string)} {week} · {pct}%
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={40}
                step={1}
                value={week}
                onChange={(e) => setWeek(+e.target.value)}
                className="week-slider"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                  fontSize: 10,
                  color: "var(--fg-soft)",
                  fontFamily: "monospace",
                }}
              >
                <span>4</span>
                <span>12</span>
                <span>20</span>
                <span>28</span>
                <span>40</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
        .week-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: color-mix(in oklch, var(--accent), transparent 80%);
          border-radius: 2px;
          outline: none;
        }
        .week-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px; height: 22px;
          background: var(--accent);
          border-radius: 50%;
          cursor: grab;
          border: 4px solid var(--bg-elev);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }
        .week-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .week-slider::-moz-range-thumb {
          width: 22px; height: 22px;
          background: var(--accent);
          border-radius: 50%;
          cursor: grab;
          border: 4px solid var(--bg-elev);
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
