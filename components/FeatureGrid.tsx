"use client";
import { useLang } from "@/lib/lang-context";

type IconKind = "kick" | "timer" | "vitals" | "symptoms" | "mood" | "cal";
const ICON_ORDER: IconKind[] = ["kick", "timer", "vitals", "symptoms", "mood", "cal"];

interface Card {
  title: string;
  desc: string;
}

function FeatureIcon({ kind }: { kind: IconKind }) {
  const c = "var(--accent)";
  const bg = "var(--chip-bg)";
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "kick" && (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M8 12l3 3 5-6" />
          </>
        )}
        {kind === "timer" && (
          <>
            <circle cx="12" cy="13" r="7" />
            <path d="M12 9v4l2 2M9 3h6" />
          </>
        )}
        {kind === "vitals" && <path d="M3 12h4l2-6 4 12 2-6h4" />}
        {kind === "symptoms" && (
          <>
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M8 10h8M8 14h5" />
          </>
        )}
        {kind === "mood" && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
          </>
        )}
        {kind === "cal" && (
          <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </>
        )}
      </svg>
    </div>
  );
}

export function FeatureGrid() {
  const { t } = useLang();
  const eyebrow = t("features.eyebrow") as string;
  const headlineA = t("features.headlineA") as string;
  const headlineB = t("features.headlineB") as string;
  const sub = t("features.sub") as string;
  const cards = t("features.cards") as readonly Card[];

  return (
    <section id="features">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="display-lg" style={{ marginTop: 14 }}>
              {headlineA}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--accent-strong)" }}>{headlineB}</em>
            </h2>
          </div>
          <p className="muted" style={{ maxWidth: 340, fontSize: 15 }}>
            {sub}
          </p>
        </div>

        <div className="feature-grid">
          {cards.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <FeatureIcon kind={ICON_ORDER[i] ?? "kick"} />
              <h3 className="serif" style={{ fontSize: 28, marginTop: 28, marginBottom: 12, lineHeight: 1.15 }}>
                {f.title}
              </h3>
              <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
        }
        .feature-card {
          background: var(--bg);
          padding: 44px 36px 48px;
          transition: background-color 0.3s var(--ease);
          min-height: 260px;
        }
        .feature-card:hover { background: var(--bg-elev); }
        @media (max-width: 900px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .feature-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

export default FeatureGrid;
