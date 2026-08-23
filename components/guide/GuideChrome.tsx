import Image from "next/image";
import Link from "next/link";
import { DIR, type Locale } from "@/lib/constants";

/**
 * Header and footer for the guide routes.
 *
 * Server components on purpose. The marketing site's `Navbar` cannot be reused
 * here: it is a client component that reads `useLang()`, and its links are
 * on-page anchors (`#features`, `#nawal`) that do not exist on a guide page.
 * `LegalLayout` skips `Navbar` for the same reason — see `../CLAUDE.md`.
 *
 * The language switch is a real `<Link>` to the other locale's URL, not a
 * state toggle. That is the whole point of these routes: both languages have
 * to exist as fetchable, crawlable documents.
 */

const T = {
  home: { en: "Nawah", ar: "نواة" },
  guide: { en: "Mother's guide", ar: "دليل الأم" },
  father: { en: "Father's guide", ar: "دليل الأب" },
  switchTo: { en: "عربي", ar: "English" },
  switchLabel: { en: "Read this page in Arabic", ar: "Read this page in English" },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  deleteAccount: { en: "Delete account", ar: "حذف الحساب" },
  rights: {
    en: "Nawah. Become each other's center.",
    ar: "نواة. كونوا مركز بعضكم.",
  },
} as const;

export function GuideHeader({
  locale,
  altPath,
}: {
  locale: Locale;
  /** Path of the SAME page in the other locale, e.g. "/ar/guide/3". */
  altPath: string;
}) {
  const other: Locale = locale === "en" ? "ar" : "en";
  return (
    <header className="guide-head">
      <div className="container guide-head-inner">
        <Link href="/" className="nav-logo" aria-label={T.home[locale]}>
          <Image
            src="/nawah-logo-dark.png"
            alt=""
            width={28}
            height={28}
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <span>{T.home[locale]}</span>
        </Link>

        <nav className="guide-head-right">
          <Link href={`/${locale}/guide`}>{T.guide[locale]}</Link>
          {/* Without this the father series is reachable only from its own
              articles and the sitemap — orphaned from the month pages, which
              are the ones that actually have inbound links today. */}
          <Link href={`/${locale}/father`}>{T.father[locale]}</Link>
          <Link
            href={altPath}
            hrefLang={other}
            lang={other}
            dir={DIR[other]}
            className="guide-lang"
            aria-label={T.switchLabel[locale]}
          >
            {T.switchTo[locale]}
          </Link>
        </nav>
      </div>

      <style>{`
        .guide-head { border-bottom: 1px solid var(--border); background: var(--bg); }
        .guide-head-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding-block: 18px;
        }
        .guide-head-right { display: flex; align-items: center; gap: 20px; font-size: 14px; }
        /* nowrap because the third link ("For fathers") pushed the row past the
           width available at 390px, and flex resolved it by breaking each label
           over two lines — "Pregnancy / guide" reads as two nav items rather
           than one. The row does not overflow; only the labels were breaking. */
        .guide-head-right a { color: var(--fg-muted); white-space: nowrap; }
        .guide-head-right a:hover { color: var(--fg); }
        .guide-lang {
          border: 1px solid var(--border); border-radius: 999px;
          padding: 6px 14px; color: var(--fg) !important;
        }

        @media (max-width: 600px) {
          .guide-head-right { gap: 12px; font-size: 13px; }
          .guide-lang { padding: 5px 11px; }
        }
      `}</style>
    </header>
  );
}

export function GuideFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="guide-foot">
      <div className="container guide-foot-inner">
        <span>
          © {new Date().getFullYear()} {T.rights[locale]}
        </span>
        <span className="guide-foot-links">
          <Link href="/privacy">{T.privacy[locale]}</Link>
          <Link href="/delete-account">{T.deleteAccount[locale]}</Link>
        </span>
      </div>

      <style>{`
        .guide-foot {
          border-top: 1px solid var(--border); margin-top: 80px;
          padding-block: 28px; font-size: 13px; color: var(--fg-soft);
        }
        .guide-foot-inner {
          display: flex; flex-wrap: wrap; gap: 12px 24px;
          align-items: center; justify-content: space-between;
        }
        .guide-foot-links { display: flex; gap: 20px; }
        .guide-foot-links a:hover { color: var(--fg); }
      `}</style>
    </footer>
  );
}
