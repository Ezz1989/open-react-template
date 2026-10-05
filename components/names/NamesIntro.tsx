import Link from "next/link";
import { namesPlayUrl, type Locale } from "@/lib/constants";
import { NAMES_BOYS, NAMES_GIRLS, NAMES_HUB, NAMES_INTRO } from "@/lib/names-content";

/**
 * Shared head of /names/boys and /names/girls (user, 2026-10-06): one title,
 * "دليل الأسماء", with boys/girls as tabs under it, then the intro. The tabs
 * keep "أسماء أولاد" / "أسماء بنات" on the page for the searches that land
 * here; the <title> and meta description stay the keyword ones.
 */
export function NamesIntro({ locale, active }: { locale: Locale; active: "boys" | "girls" }) {
  const intro = NAMES_INTRO[locale];
  const tabs = [
    { key: "boys", label: NAMES_BOYS.title[locale] },
    { key: "girls", label: NAMES_GIRLS.title[locale] },
  ] as const;
  return (
    <header className="ni">
      <h1 className="display-md">{NAMES_HUB.title[locale]}</h1>
      <nav className="ni-tabs" aria-label={locale === "ar" ? "نوع الأسماء" : "Name lists"}>
        {tabs.map((t) => (
          <Link key={t.key} href={`/${locale}/names/${t.key}`} className="ni-tab"
            aria-current={t.key === active ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      <p className="ni-lead">
        {intro.lead}
        <a href={namesPlayUrl(locale, `intro_${active}`)} rel="noopener">{intro.link}</a>
        {intro.tail}
      </p>
      <style>{`
        .ni { margin-bottom: clamp(36px, 6vw, 56px); }
        .ni-tabs { display: inline-flex; gap: 4px; margin-top: 24px; padding: 4px; border-radius: 999px; background: var(--chip-bg); }
        .ni-tab {
          padding: 10px 22px; border-radius: 999px; font-size: 16px; color: var(--fg-muted);
          transition: background-color 0.25s var(--ease), color 0.25s var(--ease);
        }
        .ni-tab:hover { color: var(--fg); }
        .ni-tab[aria-current="page"] { background: var(--bg-elev); color: var(--fg); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .ni-tab:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: 2px; }
        .ni-lead { margin-top: 24px; max-width: 68ch; font-size: 19px; line-height: 1.9; color: var(--fg-muted); }
        .ni-lead a { color: var(--accent-strong); text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
        .ni-lead a:hover { text-decoration-thickness: 2px; }
      `}</style>
    </header>
  );
}
