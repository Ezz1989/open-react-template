import { Fragment } from "react";
import Link from "next/link";
import { namesPlayUrl, type Locale } from "@/lib/constants";
import type { BabyName } from "@/lib/names-data";
import { slugForName } from "@/lib/names-data";
import { POPULAR_THRESHOLD } from "@/lib/names-content";

/** A store card after every CTA_EVERY names (user, 2026-10-05). Inline on
 *  purpose: Google demotes full-screen interstitials, not in-content banners. */
const CTA_EVERY = 5;

/**
 * The names → app pitch. The site gives away what a name means; the app's
 * reason to exist is choosing TOGETHER — each partner swipes on their own
 * phone and Nawah shows only the names both liked (`baby_names_screen.dart`,
 * Matches tab). Arabic copy approved verbatim by the user 2026-10-05.
 */
export function NamesCta({
  name,
  locale,
  where,
  variant = "match",
}: {
  name: BabyName;
  locale: Locale;
  where: string;
  /** "partner": gender-neutral second card (user's idea, 2026-10-05), plural
   *  so it addresses the couple, not one parent. It promises only MATCHES —
   *  the app never shows one partner the other's individual picks. */
  variant?: "match" | "partner";
}) {
  const display = locale === "ar" ? name.name_ar : name.name_en;
  const ar = locale === "ar";
  const copy =
    variant === "partner"
      ? {
          h: ar ? "شريك حياتك اختار اسم إيه؟" : "Which name did your partner pick?",
          p: ar
            ? "محتارين في الاسم؟ نزّلوا نواة انتو الاتنين، وكل واحد يقلّب الأسماء من موبايله، والتطبيق يقولكم على الأسامي اللي اتفقتوا عليها."
            : "Can't decide? Get Nawah, both of you. Each of you swipes names on your own phone, and the app shows you the names you agree on.",
          b: ar ? "نزّلوا التطبيق" : "Get the app",
        }
      : {
          h: ar ? "تصفحي واحتفظي بالمفضّل" : "Browse and keep your favourites",
          p: ar
            ? `عجبك اسم ${display}؟ اختاروه سوا — كل واحد يقلّب الأسماء من موبايله، ونواة يوريكم بس الأسامي اللي انتو الاتنين حبيتوها.`
            : `Like the name ${display}? Choose it together: you each swipe names on your own phone, and Nawah shows you only the names you both loved.`,
          b: ar ? "حمّلي التطبيق" : "Get the app",
        };
  return (
    <div className="n-cta">
      <h2>{copy.h}</h2>
      <p>{copy.p}</p>
      <a className="btn btn-primary" href={namesPlayUrl(locale, `${where}_${variant}`)} rel="noopener">
        {copy.b}
      </a>
      <style>{`
        .n-cta {
          padding: 20px 22px; border-radius: var(--radius-sm);
          border: 1px solid var(--accent); background: var(--chip-bg);
        }
        .n-cta h2 { font-family: var(--font-display); font-size: 20px; font-weight: 400; margin: 0 0 8px; }
        .n-cta p { margin: 0 0 14px; line-height: 1.7; }
      `}</style>
    </div>
  );
}

/** Reused by the main hub, /boys, /girls and every /origin/[o] page — one
 *  alphabetical grid of name cards, so the four listing pages don't each
 *  re-implement the same markup. */
export function NameGrid({ names, locale }: { names: BabyName[]; locale: Locale }) {
  return (
    <>
      <ol className="n-grid">
        {names.map((n, i) => (
          <Fragment key={n.id}>
            <li>
              <Link href={`/${locale}/names/${slugForName(n)}`}>
                <span className="n-grid-name">{locale === "ar" ? n.name_ar : n.name_en}</span>
                <span className="n-grid-meaning">{locale === "ar" ? n.meaning_ar : n.meaning_en}</span>
                {n.gcc_popularity >= POPULAR_THRESHOLD && (
                  <span className="n-grid-badge">{locale === "ar" ? "شائع" : "Popular"}</span>
                )}
              </Link>
            </li>
            {(i + 1) % CTA_EVERY === 0 && i + 1 < names.length && (
              <li className="n-grid-cta">
                <NamesCta
                  name={n}
                  locale={locale}
                  where="list"
                  variant={((i + 1) / CTA_EVERY) % 2 === 1 ? "match" : "partner"}
                />
              </li>
            )}
          </Fragment>
        ))}
      </ol>

      <style>{`
        .n-grid {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .n-grid-cta { grid-column: 1 / -1; }
        .n-grid a:not(.btn) {
          position: relative; display: block; padding: 16px 18px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg-elev); transition: border-color 0.2s var(--ease);
        }
        .n-grid a:not(.btn):hover { border-color: var(--accent); }
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
