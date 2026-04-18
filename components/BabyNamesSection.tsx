"use client";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";

interface Name {
  ar: string;
  en: string;
  meaning: string;
  origin: string;
  gender: "M" | "F" | "U";
  num: string;
}

export function BabyNamesSection() {
  const { t } = useLang();
  const names = t("names.seeds") as readonly Name[];
  const originChips = t("names.originChips") as readonly string[];
  const savedLabel = t("names.savedLabel") as string;
  const eyebrow = t("names.eyebrow") as string;
  const headlineA = t("names.headlineA") as string;
  const headlineB = t("names.headlineB") as string;
  const sub = t("names.sub") as string;

  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [dir, setDir] = useState(0);
  const [animating, setAnimating] = useState(false);

  const current = names[idx];

  const act = (like: boolean) => {
    if (animating) return;
    setAnimating(true);
    setDir(like ? 1 : -1);
    setTimeout(() => {
      if (like) setLiked((l) => [...l, current.en]);
      setIdx((i) => (i + 1) % names.length);
      setDir(0);
      setAnimating(false);
    }, 350);
  };

  const genderChipBg =
    current.gender === "F" ? "#F5E3E2" : current.gender === "M" ? "#DCE7F5" : "#EBE5D9";
  const genderChipColor =
    current.gender === "F" ? "#8F3C52" : current.gender === "M" ? "#3A486B" : "#7A5D2B";
  const genderLabel =
    current.gender === "F" ? "♀" : current.gender === "M" ? "♂" : "⚥";

  return (
    <section id="names" style={{ background: "var(--cream-200)", position: "relative", overflow: "hidden" }}>
      <div
        className="container names-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
      >
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 className="display-lg" style={{ marginTop: 16 }}>
            {headlineA} <em style={{ fontStyle: "italic" }}>{headlineB}</em>
          </h2>
          <p className="muted" style={{ marginTop: 22, fontSize: 17, maxWidth: 480 }}>
            {sub}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            {originChips.map((c) => (
              <div key={c} className="chip" style={{ background: "var(--bg-elev)" }}>
                {c}
              </div>
            ))}
          </div>
          {liked.length > 0 && (
            <div style={{ marginTop: 28, fontSize: 14, color: "var(--fg-muted)" }}>
              {savedLabel}{" "}
              <span style={{ color: "var(--accent-strong)", fontWeight: 500 }}>
                {liked.join(" · ")}
              </span>
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              background: "var(--bg-elev)",
              borderRadius: 24,
              padding: 36,
              boxShadow: "var(--shadow-md)",
              minHeight: 360,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="chip"
                style={{ background: genderChipBg, color: genderChipColor }}
              >
                {genderLabel} {current.gender}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--fg-soft)",
                  fontFamily: "monospace",
                }}
              >
                {current.num}
              </span>
            </div>
            <div
              style={{
                marginTop: 28,
                transform: `translateX(${dir * 60}px) rotate(${dir * 4}deg)`,
                opacity: animating ? 0 : 1,
                transition: "all 0.35s var(--ease)",
              }}
            >
              <div
                className="ar"
                style={{
                  fontSize: 84,
                  lineHeight: 1,
                  color: "var(--accent-strong)",
                  direction: "rtl",
                }}
              >
                {current.ar}
              </div>
              <div
                className="serif"
                style={{ fontSize: 36, marginTop: 12, letterSpacing: "-0.01em" }}
              >
                {current.en}
              </div>
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--fg-soft)",
                  }}
                >
                  Meaning
                </div>
                <div style={{ marginTop: 6, fontSize: 17 }}>{current.meaning}</div>
                <div
                  className="chip"
                  style={{ marginTop: 14, background: "var(--cream-200)" }}
                >
                  {current.origin}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                justifyContent: "center",
                marginTop: 32,
              }}
            >
              <button
                onClick={() => act(false)}
                aria-label="Dismiss"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  border: "2px solid var(--border)",
                  background: "var(--bg-elev)",
                  fontSize: 22,
                  color: "var(--fg-muted)",
                  transition: "transform 0.2s var(--ease)",
                }}
              >
                ✕
              </button>
              <button
                onClick={() => act(true)}
                aria-label="Save"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  fontSize: 22,
                  transition: "transform 0.2s var(--ease)",
                }}
              >
                ♥
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .names-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

export default BabyNamesSection;
