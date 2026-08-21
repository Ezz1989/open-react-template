"use client";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";

/**
 * Homepage entry point to the pregnancy guide, placed between the hero and the
 * feature grid.
 *
 * Two reasons it sits that high rather than in the footer:
 *
 * 1. A reader who lands on nawahapp.net has no other way to discover the
 *    guide. Nothing else on the page links to it.
 * 2. The guide pages are the only thing on this site a search engine can
 *    plausibly rank. Internal links from the homepage are the strongest signal
 *    this site can send about which pages matter, and a footer link buried
 *    under everything sends a much weaker one.
 *
 * `useLang()` gives the language the visitor is currently reading the
 * marketing page in, so the link lands them on the matching guide locale
 * instead of dumping an Arabic reader on /en/guide.
 */
export function GuidePromo() {
  const { t, lang } = useLang();

  return (
    <section id="guide" className="guide-promo">
      <div className="container guide-promo-inner">
        <div>
          <p className="eyebrow">{t("guidePromo.eyebrow") as string}</p>
          <h2 className="display-sm guide-promo-h">
            {t("guidePromo.headlineA") as string}
            <br />
            <em>{t("guidePromo.headlineB") as string}</em>
          </h2>
        </div>

        <div className="guide-promo-right">
          <p className="guide-promo-sub">{t("guidePromo.sub") as string}</p>
          <Link href={`/${lang}/guide`} className="btn btn-primary">
            {t("guidePromo.cta") as string}
          </Link>
          <p className="guide-promo-note">{t("guidePromo.note") as string}</p>
        </div>
      </div>

      <style>{`
        .guide-promo { border-block: 1px solid var(--border); }
        .guide-promo-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 40px; align-items: start;
        }
        .guide-promo-h { margin-top: 12px; }
        .guide-promo-h em { font-style: italic; color: var(--accent-strong); }
        .guide-promo-sub { line-height: 1.75; color: var(--fg-muted); margin-bottom: 24px; }
        .guide-promo-note { margin-top: 14px; font-size: 13px; color: var(--fg-soft); }

        @media (max-width: 760px) {
          .guide-promo-inner { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </section>
  );
}

export default GuidePromo;
