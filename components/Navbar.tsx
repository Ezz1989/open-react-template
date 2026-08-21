"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { useMode } from "@/lib/mode-context";

/**
 * Top navigation.
 *
 * Structure: Home · Features (dropdown) · Articles (dropdown) · About us.
 *
 * Journey, Nawal and Names used to sit in the top row as flat anchors. They
 * are sub-topics of the product, not peers of it, and five flat items left no
 * room for Articles or About. They now live under Features.
 *
 * The dropdowns open on hover for mouse users and on click for everyone else.
 * Click matters: hover alone is unreachable by touch and by keyboard, and the
 * whole point of Articles is that it leads somewhere a search engine and a
 * phone user both need to reach.
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

  // Close when focus or a click leaves the group. Without this the panel stays
  // open after navigating by keyboard and covers the content below it.
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
        <div className="pill-toggle" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
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
          className="btn-ghost btn"
          style={{ padding: "8px 14px", fontSize: 13 }}
          aria-label="Toggle language"
        >
          {lang === "en" ? "ع" : "EN"}
        </button>
      </div>

      <style>{`
        .nav-dd { position: relative; }
        .nav-dd-trigger {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 14px; color: var(--fg-muted); padding: 0;
        }
        .nav-dd-trigger:hover, .nav-dd[data-open="true"] .nav-dd-trigger { color: var(--fg); }
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
        /* The first entry repeats the trigger label and leads to the section
           itself, so the parent is reachable and not just a menu handle. */
        .nav-dd-panel a:first-child { color: var(--fg); font-weight: 500; }

        @media (max-width: 860px) {
          .nav-links-desktop { display: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
