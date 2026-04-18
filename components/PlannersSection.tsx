"use client";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";

type Tab = "bag" | "budget" | "journal";
type Currency = "EGP" | "USD" | "SAR" | "AED";

interface BagItem {
  label: string;
  group: "M" | "B" | "F";
  checked: boolean;
}

interface BudgetItem {
  label: string;
  amount: number;
  checked: boolean;
}

interface JournalEntry {
  wk: number;
  who: string;
  title: string;
  date: string;
  shared?: boolean;
}

interface BagContent {
  packedFormat: string;
  progressNote: string;
  items: readonly BagItem[];
  groupLabels: Record<"M" | "B" | "F", string>;
}

interface BudgetContent {
  totalEyebrow: string;
  currencyEyebrow: string;
  spentLabel: string;
  remainingLabel: string;
  items: readonly BudgetItem[];
}

interface JournalContent {
  privacyNote: string;
  newEntryLabel: string;
  entries: readonly JournalEntry[];
  sharedLabel: string;
  privateLabel: string;
}

const FX: Record<Currency, number> = { EGP: 1, USD: 0.02, SAR: 0.076, AED: 0.075 };
const CURRENCIES: Currency[] = ["EGP", "USD", "SAR", "AED"];

function HospitalBagPanel({ content }: { content: BagContent }) {
  const [state, setState] = useState<boolean[]>(content.items.map((i) => i.checked));
  const packed = state.filter(Boolean).length;
  const total = content.items.length;
  const pct = Math.round((packed / total) * 100);
  const packedLabel = content.packedFormat
    .replace("{packed}", String(packed))
    .replace("{total}", String(total));

  return (
    <div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
        <div style={{ width: 72, height: 72, position: "relative" }}>
          <svg viewBox="0 0 72 72" width="72" height="72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="5" />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${pct * 1.88} 188`}
              transform="rotate(-90 36 36)"
              style={{ transition: "stroke-dasharray 0.5s var(--ease)" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {pct}%
          </div>
        </div>
        <div>
          <div className="serif" style={{ fontSize: 26 }}>
            {packedLabel}
          </div>
          <div className="muted" style={{ fontSize: 14 }}>
            {content.progressNote}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {content.items.map((item, i) => (
          <label
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              background: "var(--bg)",
              borderRadius: 12,
              cursor: "pointer",
              border: "1px solid var(--border)",
            }}
          >
            <input
              type="checkbox"
              checked={state[i]}
              onChange={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: state[i] ? "var(--accent)" : "transparent",
                border: `2px solid ${state[i] ? "var(--accent)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
              }}
            >
              {state[i] && "✓"}
            </div>
            <span
              style={{
                flex: 1,
                fontSize: 14,
                textDecoration: state[i] ? "line-through" : "none",
                opacity: state[i] ? 0.5 : 1,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "3px 8px",
                background: item.group === "B" ? "var(--chip-bg)" : "var(--cream-200)",
                borderRadius: 999,
                color: "var(--fg-muted)",
              }}
            >
              {content.groupLabels[item.group]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BudgetPanel({ content }: { content: BudgetContent }) {
  const [state, setState] = useState<boolean[]>(content.items.map((i) => i.checked));
  const [cur, setCur] = useState<Currency>("EGP");
  const total = content.items.reduce((s, i) => s + i.amount, 0);
  const spent = content.items.reduce((s, i, k) => s + (state[k] ? i.amount : 0), 0);
  const f = (n: number) =>
    (n * FX[cur]).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          alignItems: "flex-start",
          marginBottom: 32,
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="eyebrow">{content.totalEyebrow}</div>
          <div className="serif" style={{ fontSize: 48, marginTop: 4 }}>
            {cur} {f(total)}
          </div>
          <div
            style={{
              marginTop: 14,
              height: 6,
              background: "var(--border)",
              borderRadius: 3,
              overflow: "hidden",
              maxWidth: 400,
            }}
          >
            <div
              style={{
                width: `${(spent / total) * 100}%`,
                height: "100%",
                background: "var(--accent)",
                transition: "width 0.5s var(--ease)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              maxWidth: 400,
              fontSize: 13,
            }}
          >
            <span className="muted">
              {content.spentLabel} {cur} {f(spent)}
            </span>
            <span className="muted">
              {content.remainingLabel} {cur} {f(total - spent)}
            </span>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {content.currencyEyebrow}
          </div>
          <div className="pill-toggle" style={{ fontSize: 12 }}>
            {CURRENCIES.map((c) => (
              <button
                key={c}
                className={c === cur ? "active" : ""}
                onClick={() => setCur(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {content.items.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              background: "var(--bg)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
              aria-label="Toggle"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: state[i] ? "var(--accent)" : "transparent",
                border: `2px solid ${state[i] ? "var(--accent)" : "var(--border)"}`,
                color: "#fff",
                fontSize: 12,
              }}
            >
              {state[i] ? "✓" : ""}
            </button>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: state[i] ? "line-through" : "none",
                  opacity: state[i] ? 0.5 : 1,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--fg-muted)",
                  marginTop: 2,
                }}
              >
                {cur} {f(item.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalPanel({ content }: { content: JournalContent }) {
  return (
    <div>
      <div
        style={{
          background: "var(--chip-bg)",
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 13,
          color: "var(--accent-strong)",
          marginBottom: 24,
        }}
      >
        {content.privacyNote}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {content.entries.map((e, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg)",
              borderRadius: 14,
              padding: "18px 22px",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--accent-strong)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                WK {e.wk} · {e.date}
              </div>
              <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>
                {e.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--fg-muted)",
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {e.who[0]}
                </div>
                {e.who}
              </div>
            </div>
            <span
              className="chip"
              style={{
                background: e.shared ? "#E8F0E4" : "var(--cream-200)",
                color: e.shared ? "#4A6E3A" : "var(--fg-muted)",
              }}
            >
              {e.shared ? content.sharedLabel : content.privateLabel}
            </span>
          </div>
        ))}
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          {content.newEntryLabel}
        </button>
      </div>
    </div>
  );
}

export function PlannersSection() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("bag");
  const tabs = t("planners.tabs") as { bag: string; budget: string; journal: string };
  const eyebrow = t("planners.eyebrow") as string;
  const headlineA = t("planners.headlineA") as string;
  const headlineB = t("planners.headlineB") as string;
  const bag = t("planners.bag") as BagContent;
  const budget = t("planners.budget") as BudgetContent;
  const journal = t("planners.journal") as JournalContent;

  return (
    <section id="planners" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div style={{ maxWidth: 580 }}>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="display-lg" style={{ marginTop: 14 }}>
              {headlineA} <em style={{ fontStyle: "italic" }}>{headlineB}</em>
            </h2>
          </div>
          <div className="pill-toggle">
            <button className={tab === "bag" ? "active" : ""} onClick={() => setTab("bag")}>
              {tabs.bag}
            </button>
            <button
              className={tab === "budget" ? "active" : ""}
              onClick={() => setTab("budget")}
            >
              {tabs.budget}
            </button>
            <button
              className={tab === "journal" ? "active" : ""}
              onClick={() => setTab("journal")}
            >
              {tabs.journal}
            </button>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-elev)",
            borderRadius: 28,
            padding: 40,
            border: "1px solid var(--border)",
            minHeight: 420,
          }}
        >
          {tab === "bag" && <HospitalBagPanel content={bag} />}
          {tab === "budget" && <BudgetPanel content={budget} />}
          {tab === "journal" && <JournalPanel content={journal} />}
        </div>
      </div>
    </section>
  );
}

export default PlannersSection;
