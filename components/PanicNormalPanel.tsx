import type { Locale } from "@/lib/constants";
import type { RedFlags, Section } from "@/lib/guide-content";

/**
 * "What's common" (green) next to "call now" (red) — the market-research
 * report's "Panic vs Normal" pattern, built from data the site already has:
 * green comes from flattening every section's `bullets` (the same
 * already-written, already-cited common-symptom lists each article shows
 * inline), red is the existing `redFlags` block, unchanged.
 *
 * Deliberately NOT a click-to-reveal toggle. `guide/[month]/page.tsx`'s own
 * comment calls the red-flags block "the highest-stakes content on the
 * page" — gating it behind an interaction risks a reader never opening it.
 * Both panels render together, always, just visually distinguished.
 *
 * Renders nothing if there is no `redFlags` to contrast against (matches
 * `FatherArticle.redFlags` already being optional for articles — a budget or
 * packing list — with no emergency symptoms to speak of).
 */

const T = {
  normalHeading: { en: "What's common", ar: "الشائع والمتوقع" },
  redHeadingDefault: { en: "When to call a doctor now", ar: "متى تتصلين بالطبيب فوراً" },
} as const;

export function PanicNormalPanel({
  sections,
  redFlags,
  locale,
  redHeadingOverride,
}: {
  sections: Section[];
  redFlags: RedFlags | undefined;
  locale: Locale;
  /** `FatherArticle.redFlags.heading` — some father articles (e.g. the
   *  paternal mental-health one) need a heading that isn't about calling a
   *  doctor, since the list is about the reader himself. */
  redHeadingOverride?: string;
}) {
  if (!redFlags) return null;

  const normalItems = sections.flatMap((s) => s.bullets ?? []);

  return (
    <div className="pn-grid">
      {normalItems.length > 0 && (
        <section className="pn-panel pn-normal">
          <h2>{T.normalHeading[locale]}</h2>
          <ul>
            {normalItems.map((it, i) => (
              <li key={i}>{it[locale]}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="pn-panel pn-red g-flags" aria-labelledby="redflags">
        <h2 id="redflags">{redHeadingOverride ?? T.redHeadingDefault[locale]}</h2>
        <p>{redFlags.intro[locale]}</p>
        <ul>
          {redFlags.items.map((it, i) => (
            <li key={i}>{it[locale]}</li>
          ))}
        </ul>
      </section>

      <style>{`
        .pn-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
          margin-top: 48px; align-items: start;
        }
        .pn-panel { padding: 24px; border-radius: var(--radius-md); }
        .pn-panel h2 { font-size: 20px; font-weight: 500; margin-bottom: 10px; }
        .pn-panel ul { margin: 12px 0 0; padding-inline-start: 20px; list-style: disc; }
        .pn-panel li { margin-bottom: 8px; line-height: 1.6; }

        .pn-normal {
          background: color-mix(in srgb, var(--sage) 10%, var(--bg-elev));
          border: 1px solid color-mix(in srgb, var(--sage) 35%, transparent);
        }
        .pn-normal h2 { color: var(--sage); }

        .pn-red { border: 1px solid var(--accent); }
        .pn-red h2 { color: var(--accent-strong); }

        /* One panel alone (no bullets to build the green side from) should
           still read as a normal single-column block, not a lone narrow
           column stranded on one side of an empty grid track. */
        .pn-grid:has(> .pn-panel:only-child) { grid-template-columns: 1fr; }

        @media (max-width: 700px) {
          .pn-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
