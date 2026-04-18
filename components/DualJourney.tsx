"use client";
import { useLang } from "@/lib/lang-context";
import { useMode } from "@/lib/mode-context";
import { FetusSVG } from "./FetusSVG";

interface JourneySide {
  eyebrow: string;
  headlineA: string;
  headlineB: string;
  bullets: readonly string[];
}

export function DualJourney() {
  const { t } = useLang();
  const { mode, setMode } = useMode();
  const mother = t("journey.mother") as JourneySide;
  const father = t("journey.father") as JourneySide;

  return (
    <section id="journey" style={{ padding: 0 }}>
      <div
        className="dual-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "80vh" }}
      >
        <div
          onClick={() => setMode("mother")}
          className={`journey-side ${mode === "mother" ? "active" : ""}`}
          style={{
            background: "#B55F77",
            color: "#fff",
            padding: "clamp(60px, 10vw, 120px) clamp(32px, 6vw, 80px)",
            cursor: "pointer",
            transition: "all 0.5s var(--ease)",
            position: "relative",
            overflow: "hidden",
            opacity: mode === "mother" ? 1 : 0.7,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {mother.eyebrow}
          </div>
          <h3 className="display-md" style={{ marginTop: 20, maxWidth: 420 }}>
            {mother.headlineA}{" "}
            <em style={{ fontStyle: "italic" }}>{mother.headlineB}</em>
          </h3>
          <ul
            style={{
              marginTop: 32,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontSize: 16,
            }}
          >
            {mother.bullets.map((b) => (
              <li key={b}>◦ {b}</li>
            ))}
          </ul>
          <div style={{ position: "absolute", bottom: 60, right: 60, opacity: 0.85 }}>
            <FetusSVG week={20} color="#F5E3E2" size={180} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              fontFamily: "var(--font-display)",
              fontSize: 120,
              opacity: 0.1,
              lineHeight: 1,
            }}
          >
            ♀
          </div>
        </div>

        <div
          onClick={() => setMode("father")}
          className={`journey-side ${mode === "father" ? "active" : ""}`}
          style={{
            background: "#1F2C4F",
            color: "#fff",
            padding: "clamp(60px, 10vw, 120px) clamp(32px, 6vw, 80px)",
            cursor: "pointer",
            transition: "all 0.5s var(--ease)",
            position: "relative",
            overflow: "hidden",
            opacity: mode === "father" ? 1 : 0.7,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {father.eyebrow}
          </div>
          <h3 className="display-md" style={{ marginTop: 20, maxWidth: 420 }}>
            {father.headlineA}{" "}
            <em style={{ fontStyle: "italic" }}>{father.headlineB}</em>
          </h3>
          <ul
            style={{
              marginTop: 32,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontSize: 16,
            }}
          >
            {father.bullets.map((b) => (
              <li key={b}>◦ {b}</li>
            ))}
          </ul>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              fontFamily: "var(--font-display)",
              fontSize: 120,
              opacity: 0.1,
              lineHeight: 1,
            }}
          >
            ♂
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .dual-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default DualJourney;
