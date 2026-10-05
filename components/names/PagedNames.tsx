"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/constants";
import { NamesCta } from "./NamesCta";

export interface NameItem {
  id: string;
  href: string;
  name: string;
  meaning: string;
  popular: boolean;
}

/** Six per page as a 2×3 grid of framed squares (user, 2026-10-06). */
const PER_PAGE = 6;

/** One palette colour per square's frame, same order on every page. */
const FRAMES = ["var(--rose-400)", "var(--navy-500)", "var(--terracotta)", "var(--rose-600)", "var(--navy-300)", "var(--rose-300)"];

/** 1 … 6 7 8 … 25 — first, last, and the current page's neighbours. */
function pageWindow(cur: number, total: number): (number | "gap")[] {
  const keep = Array.from(new Set([1, total, cur - 1, cur, cur + 1]))
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  keep.forEach((p, i) => {
    if (i > 0 && p - keep[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

function Chevron({ back }: { back?: boolean }) {
  // Drawn pointing "forward" in reading order; CSS mirrors it under dir=rtl.
  return (
    <svg className={back ? "np-chev np-chev-back" : "np-chev"} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Every name stays in the HTML — the pages that aren't showing are `hidden`,
 * not unrendered — so all ~250 name pages keep their internal link from the
 * listing (the reason the grid existed). Paging is client state only.
 */
export function PagedNames({ items, locale, where }: { items: NameItem[]; locale: Locale; where: string }) {
  const [page, setPage] = useState(1);
  const [moved, setMoved] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";
  const total = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const num = (n: number) => n.toLocaleString(ar ? "ar-EG" : "en-US");

  const go = (p: number) => {
    if (p < 1 || p > total || p === page) return;
    setPage(p);
    setMoved(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    top.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const first = items[start];

  return (
    <div ref={top} className="np">
      <ol className={moved ? "np-list np-anim" : "np-list"} key={page}>
        {items.map((it, i) => {
          const shown = i >= start && i < start + PER_PAGE;
          return (
            <li key={it.id} hidden={!shown}
              style={{ ["--i" as string]: i - start, ["--frame" as string]: FRAMES[i % FRAMES.length] }}>
              <Link href={it.href} className="np-sq">
                {it.popular && <span className="np-badge">{ar ? "شائع" : "Popular"}</span>}
                <span className="np-name">{it.name}</span>
                <span className="np-meaning">{it.meaning}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {first && <NamesCta display={first.name} locale={locale} where={`${where}_p${page}`} quoteIndex={page - 1} />}

      {total > 1 && (
        <nav className="np-pager" aria-label={ar ? "صفحات الأسماء" : "Name pages"}>
          <button type="button" className="np-step" onClick={() => go(page - 1)} disabled={page === 1}>
            <Chevron back />
            <span>{ar ? "السابق" : "Previous"}</span>
          </button>
          <ol className="np-nums">
            {pageWindow(page, total).map((p, i) =>
              p === "gap" ? (
                <li key={`gap${i}`} className="np-gap" aria-hidden="true">…</li>
              ) : (
                <li key={p}>
                  <button type="button" className="np-num" onClick={() => go(p)}
                    aria-current={p === page ? "page" : undefined}
                    aria-label={ar ? `صفحة ${num(p)}` : `Page ${p}`}>
                    {num(p)}
                  </button>
                </li>
              ),
            )}
          </ol>
          <button type="button" className="np-step" onClick={() => go(page + 1)} disabled={page === total}>
            <span>{ar ? "التالي" : "Next"}</span>
            <Chevron />
          </button>
          <p className="np-status" aria-live="polite">
            {ar ? `صفحة ${num(page)} من ${num(total)}` : `Page ${page} of ${total}`}
          </p>
        </nav>
      )}

      <style>{`
        .np { scroll-margin-top: 96px; }
        .np-list {
          list-style: none; margin: 0 0 48px; padding: 0;
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(14px, 2.4vw, 28px);
        }
        .np-sq {
          position: relative; aspect-ratio: 1 / 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
          padding: clamp(18px, 4vw, 48px); text-align: center;
          background: var(--bg-elev);
          border: 2px solid var(--frame);
          border-radius: var(--radius-md);
          /* A mat inside the frame: bg gap, then a hairline in the frame colour. */
          box-shadow: inset 0 0 0 10px var(--bg-elev), inset 0 0 0 11px color-mix(in srgb, var(--frame) 45%, transparent);
          transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
        }
        .np-sq:hover {
          transform: translateY(-4px);
          box-shadow: inset 0 0 0 10px var(--bg-elev), inset 0 0 0 11px color-mix(in srgb, var(--frame) 70%, transparent),
            0 18px 36px -18px color-mix(in srgb, var(--frame) 55%, transparent);
        }
        .np-name {
          font-family: var(--font-display);
          font-size: clamp(2rem, 7vw, 5rem); line-height: 1.1; color: var(--fg);
          text-wrap: balance; overflow-wrap: anywhere;
        }
        [dir="rtl"] .np-name { font-weight: 700; }
        .np-meaning {
          max-width: 24ch; font-size: clamp(14px, 1.7vw, 20px); line-height: 1.55;
          color: var(--fg-muted); text-wrap: balance;
        }
        .np-badge {
          position: absolute; top: 22px; inset-inline-start: 22px;
          font-size: 12px; padding: 4px 12px; border-radius: 999px;
          background: color-mix(in srgb, var(--frame) 16%, var(--bg-elev)); color: var(--fg);
        }
        .np-chev { color: currentColor; }
        .np-chev-back { transform: scaleX(-1); }
        [dir="rtl"] .np-chev { transform: scaleX(-1); }
        [dir="rtl"] .np-chev-back { transform: none; }
        .np-sq:focus-visible, .np-num:focus-visible, .np-step:focus-visible {
          outline: 2px solid var(--accent-strong); outline-offset: 4px;
        }

        .np-anim > li:not([hidden]) {
          animation: np-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: calc(var(--i) * 45ms);
        }
        @keyframes np-in { from { opacity: 0.35; transform: translateY(10px); filter: blur(3px); } }
        @media (prefers-reduced-motion: reduce) { .np-anim > li:not([hidden]) { animation: none; } }

        .np-pager {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          gap: 10px 14px; margin: 40px 0 0;
        }
        .np-nums { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; }
        .np-num, .np-step {
          font: inherit; cursor: pointer; border: 1px solid transparent; background: transparent; color: var(--fg);
          font-variant-numeric: tabular-nums;
          transition: background-color 0.2s var(--ease), color 0.2s var(--ease), border-color 0.2s var(--ease);
        }
        .np-num { min-width: 44px; height: 44px; padding: 0 10px; border-radius: 999px; font-size: 16px; }
        .np-num:hover { background: var(--chip-bg); }
        .np-num[aria-current="page"] { background: var(--accent-strong); color: var(--accent-ink); }
        .np-step {
          display: inline-flex; align-items: center; gap: 6px;
          height: 44px; padding: 0 16px; border-radius: 999px; border-color: var(--border); font-size: 15px;
        }
        .np-step:hover:not(:disabled) { border-color: var(--accent); }
        .np-step:disabled { opacity: 0.4; cursor: default; }
        .np-gap { align-self: center; padding: 0 2px; color: var(--fg-muted); }
        .np-status { flex-basis: 100%; margin: 4px 0 0; text-align: center; font-size: 13px; color: var(--fg-muted); }

        @media (max-width: 640px) {
          .np-sq { gap: 8px; box-shadow: inset 0 0 0 6px var(--bg-elev), inset 0 0 0 7px color-mix(in srgb, var(--frame) 45%, transparent); }
          .np-badge { top: 12px; inset-inline-start: 12px; font-size: 10px; padding: 2px 8px; }
          .np-step span { display: none; }
          .np-step { padding: 0 12px; }
        }
      `}</style>
    </div>
  );
}
