"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { useMode } from "@/lib/mode-context";

/**
 * Top navigation.
 *
 * Desktop: Home · Features (dropdown) · Articles (dropdown) · About us.
 * Journey, Nawal and Names are sub-topics of the product rather than peers of
 * it, so they live under Features.
 *
 * Mobile: everything above collapses into a panel behind a menu button.
 *
 * Two problems this replaces, both real on the live site:
 *
 * 1. There was no mobile menu at all. The link row was simply
 *    `display: none` under the breakpoint, so a phone visitor could not reach
 *    Features, Articles, About or the guide from the header.
 * 2. The mother/father pill overlapped the wordmark at 390px, rendering the
 *    logo as "Nawa". The bar was trying to hold a logo, a two-option toggle
 *    and a language button in 390px minus padding.
 *
 * The fix for (2) is that the mother/father toggle moves into the panel on
 * mobile. It is a preference control, not navigation, so it is the right thing
 * to demote when space runs out. The language toggle stays in the bar because
 * an Arabic reader landing on English text needs it immediately, without
 * hunting through a menu.
 */

interface MenuItem {
  label: string;
  href: string;
  /** Internal route (Next Link) rather than an on-page anchor. */
  route?: boolean;
}

function Dropdown({
  label,
  href,
  items,
  open,
  setOpen,
}: {
  label: string;
  href: string;
  items: MenuItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, setOpen]);

  return (
    <div
      className="nav-dd"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="nav-dd-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="nav-dd-caret" aria-hidden="true">
          ⌄
        </span>
      </button>

      <div className={`nav-dd-panel ${open ? "is-open" : ""}`} role="menu">
        <a href={href} role="menuitem" onClick={() => setOpen(false)}>
          {label}
        </a>
        {items.map((it) =>
          it.route ? (
            <Link key={it.label} href={it.href} role="menuitem" onClick={() => setOpen(false)}>
              {it.label}
            </Link>
          ) : (
            <a key={it.label} href={it.href} role="menuitem" onClick={() => setOpen(false)}>
              {it.label}
            </a>
          ),
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const { t, lang, toggle } = useLang();
  const { mode, setMode } = useMode();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile panel on Escape and when the viewport grows past the
  // breakpoint. Without the resize handler, rotating a phone to landscape
  // leaves an open panel floating over a layout that no longer needs it.
  useEffect(() => {
    if (!mobileOpen) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    function onResize() {
      if (window.innerWidth > 860) setMobileOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  const featureItems: MenuItem[] = [
    { label: t("nav.journey") as string, href: "#journey" },
    { label: t("nav.nawal") as string, href: "#nawal" },
    { label: t("nav.names") as string, href: "#names" },
  ];

  const articleItems: MenuItem[] = [
    { label: t("nav.guide") as string, href: `/${lang}/guide`, route: true },
  ];

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Image
          src="/nawah-logo-dark.png"
          alt="Nawah"
          width={32}
          height={32}
          style={{ width: 32, height: 32, objectFit: "contain" }}
        />
        <span>Nawah</span>
      </div>

      <div className="nav-links nav-links-desktop">
        <Link href="/">{t("nav.home") as string}</Link>

        <Dropdown
          label={t("nav.features") as string}
          href="#features"
          items={featureItems}
          open={openMenu === "features"}
          setOpen={(v) => setOpenMenu(v ? "features" : null)}
        />

        <Dropdown
          label={t("nav.articles") as string}
          href={`/${lang}/guide`}
          items={articleItems}
          open={openMenu === "articles"}
          setOpen={(v) => setOpenMenu(v ? "articles" : null)}
        />

        <Link href={`/${lang}/about`}>{t("nav.about") as string}</Link>
      </div>

      <div className="nav-right">
        <div className="pill-toggle nav-modes" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
          <button
            className={mode === "mother" ? "active" : ""}
            onClick={() => setMode("mother")}
            aria-label="Mother mode"
          >
            ♀ {t("nav.mother") as string}
          </button>
          <button
            className={mode === "father" ? "active" : ""}
            onClick={() => setMode("father")}
            aria-label="Father mode"
          >
            ♂ {t("nav.father") as string}
          </button>
        </div>

        <button
          onClick={toggle}
          className="btn-ghost btn nav-lang"
          style={{ padding: "8px 14px", fontSize: 13 }}
          aria-label="Toggle language"
        >
          {lang === "en" ? "ع" : "EN"}
        </button>

        <button
          type="button"
          className="nav-burger"
          aria-expanded={mobileOpen}
          aria-controls="nav-mobile-panel"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={mobileOpen ? "is-x" : ""} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <div
        id="nav-mobile-panel"
        className={`nav-mobile ${mobileOpen ? "is-open" : ""}`}
        hidden={!mobileOpen}
      >
        <Link href="/" onClick={close}>
          {t("nav.home") as string}
        </Link>

        <p className="nav-mobile-label">{t("nav.features") as string}</p>
        {featureItems.map((it) => (
          <a key={it.label} href={it.href} className="nav-mobile-sub" onClick={close}>
            {it.label}
          </a>
        ))}

        <p className="nav-mobile-label">{t("nav.articles") as string}</p>
        {articleItems.map((it) => (
          <Link key={it.label} href={it.href} className="nav-mobile-sub" onClick={close}>
            {it.label}
          </Link>
        ))}

        <Link href={`/${lang}/about`} onClick={close}>
          {t("nav.about") as string}
        </Link>

        {/* The mode toggle lives here on mobile. It is a preference, not
            navigation, so it is what gets demoted when the bar runs out of
            room. */}
        <div className="nav-mobile-modes">
          <div className="pill-toggle" style={{ fontSize: 13 }}>
            <button
              className={mode === "mother" ? "active" : ""}
              onClick={() => setMode("mother")}
            >
              ♀ {t("nav.mother") as string}
            </button>
            <button
              className={mode === "father" ? "active" : ""}
              onClick={() => setMode("father")}
            >
              ♂ {t("nav.father") as string}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .nav-dd { position: relative; }
        .nav-dd-trigger {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 14px; color: var(--fg-muted); padding: 0;
        }
        .nav-dd-trigger:hover { color: var(--fg); }
        .nav-dd-caret { font-size: 11px; line-height: 1; opacity: 0.7; }

        .nav-dd-panel {
          position: absolute; inset-inline-start: 0; top: calc(100% + 10px);
          min-width: 180px; padding: 8px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: 0 12px 32px rgba(20,14,12,0.10);
          display: flex; flex-direction: column; gap: 2px;
          opacity: 0; visibility: hidden; transform: translateY(-6px);
          transition: opacity 0.2s var(--ease), transform 0.2s var(--ease), visibility 0.2s;
        }
        .nav-dd-panel.is-open { opacity: 1; visibility: visible; transform: translateY(0); }
        .nav-dd-panel a {
          padding: 9px 12px; border-radius: 8px;
          font-size: 14px; color: var(--fg-muted); white-space: nowrap;
        }
        .nav-dd-panel a:hover { background: var(--bg); color: var(--fg); }
        .nav-dd-panel a:first-child { color: var(--fg); font-weight: 500; }

        /* Menu button: three bars that become an X. Hidden above the
           breakpoint, where the full link row is visible instead. */
        .nav-burger { display: none; padding: 8px; margin-inline-start: 2px; }
        .nav-burger span {
          display: block; width: 20px; height: 14px; position: relative;
        }
        .nav-burger i {
          position: absolute; inset-inline: 0; height: 1.5px;
          background: var(--fg); border-radius: 2px;
          transition: transform 0.25s var(--ease), opacity 0.2s var(--ease);
        }
        .nav-burger i:nth-child(1) { top: 0; }
        .nav-burger i:nth-child(2) { top: 6px; }
        .nav-burger i:nth-child(3) { top: 12px; }
        .nav-burger .is-x i:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nav-burger .is-x i:nth-child(2) { opacity: 0; }
        .nav-burger .is-x i:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        .nav-mobile {
          position: absolute; top: calc(100% + 10px);
          inset-inline: 0; padding: 12px;
          background: var(--bg-elev); border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: 0 16px 40px rgba(20,14,12,0.12);
          display: flex; flex-direction: column;
          max-height: calc(100vh - 120px); overflow-y: auto;
        }
        .nav-mobile > a {
          padding: 12px 14px; border-radius: 10px;
          font-size: 16px; color: var(--fg);
        }
        .nav-mobile > a:active { background: var(--bg); }
        .nav-mobile-label {
          padding: 14px 14px 6px; margin: 0;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--fg-soft);
        }
        .nav-mobile-sub {
          padding: 10px 14px 10px 26px; border-radius: 10px;
          font-size: 15px; color: var(--fg-muted);
        }
        [dir="rtl"] .nav-mobile-sub { padding: 10px 26px 10px 14px; }
        .nav-mobile-modes {
          margin-top: 12px; padding-top: 14px;
          border-top: 1px solid var(--border);
          display: flex; justify-content: center;
        }

        @media (max-width: 860px) {
          .nav-links-desktop { display: none; }
          .nav-burger { display: block; }
          /* Frees the row so the wordmark stops colliding with the toggle. */
          .nav-modes { display: none; }
        }
        @media (min-width: 861px) {
          .nav-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
