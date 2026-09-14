import Link from "next/link";
import type { Locale } from "@/lib/constants";
import type { BabyName } from "@/lib/names-data";
import { slugForName } from "@/lib/names-data";
import { POPULAR_THRESHOLD } from "@/lib/names-content";

/** Reused by the main hub, /boys, /girls and every /origin/[o] page — one
 *  alphabetical grid of name cards, so the four listing pages don't each
 *  re-implement the same markup. */
export function NameGrid({ names, locale }: { names: BabyName[]; locale: Locale }) {
  return (
    <>
      <ol className="n-grid">
        {names.map((n) => (
          <li key={n.id}>
            <Link href={`/${locale}/names/${slugForName(n)}`}>
              <span className="n-grid-name">{locale === "ar" ? n.name_ar : n.name_en}</span>
              <span className="n-grid-meaning">{locale === "ar" ? n.meaning_ar : n.meaning_en}</span>
              {n.gcc_popularity >= POPULAR_THRESHOLD && (
                <span className="n-grid-badge">{locale === "ar" ? "شائع" : "Popular"}</span>
              )}
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        .n-grid {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .n-grid a {
          position: relative; display: block; padding: 16px 18px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg-elev); transition: border-color 0.2s var(--ease);
        }
        .n-grid a:hover { border-color: var(--accent); }
        .n-grid-name { display: block; font-family: var(--font-display); font-size: 19px; }
        .n-grid-meaning {
          display: block; margin-top: 4px; font-size: 13px; color: var(--fg-muted);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .n-grid-badge {
          position: absolute; top: 10px; inset-inline-end: 10px;
          font-size: 10px; padding: 2px 8px; border-radius: 999px;
          background: var(--chip-bg); color: var(--accent-strong);
        }
        @media (max-width: 720px) { .n-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px) { .n-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
