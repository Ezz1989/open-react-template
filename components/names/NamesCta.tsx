import { namesPlayUrl, type Locale } from "@/lib/constants";
import { NAME_QUOTES } from "@/lib/names-content";

/**
 * The names → app pitch. The site gives away what a name means; the app's
 * reason to exist is choosing TOGETHER — each partner swipes on their own
 * phone and Nawah shows only the names both liked (`baby_names_screen.dart`,
 * Matches tab). It promises only MATCHES — the app never shows one partner
 * the other's individual picks.
 *
 * MSA since 2026-10-06 (user: "page standardization"); the quote rotates per
 * listing page. Kept free of `names-data` imports so client components can
 * render it without pulling the Supabase client into the bundle.
 */
export function NamesCta({
  display,
  locale,
  where,
  quoteIndex = 0,
}: {
  display: string;
  locale: Locale;
  where: string;
  quoteIndex?: number;
}) {
  const ar = locale === "ar";
  const quote = NAME_QUOTES[quoteIndex % NAME_QUOTES.length][locale];
  return (
    <aside className="n-cta">
      <p className="n-cta-quote">{quote}</p>
      <p className="n-cta-body">
        {ar
          ? `أعجبك اسم ${display}؟ اختاراه معًا — يتصفّح كلٌّ منكما الأسماء من هاتفه، ولا تُظهر لكما نواة إلا الأسماء التي أحببتماها معًا.`
          : `Like the name ${display}? Choose it together: you each swipe names on your own phone, and Nawah shows you only the names you both loved.`}
      </p>
      <a className="btn btn-primary" href={namesPlayUrl(locale, where)} rel="noopener">
        {ar ? "حمّلي التطبيق" : "Get the app"}
      </a>
      <style>{`
        .n-cta {
          padding: clamp(28px, 5vw, 48px);
          border-radius: var(--radius-md);
          background: var(--chip-bg);
        }
        .n-cta-quote {
          margin: 0 0 18px;
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.6rem);
          line-height: 1.3;
          color: var(--accent-strong);
          text-wrap: balance;
        }
        .n-cta-body {
          margin: 0 0 26px; max-width: 60ch;
          font-size: 17px; line-height: 1.8; color: var(--fg);
        }
      `}</style>
    </aside>
  );
}
