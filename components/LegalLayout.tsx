"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { useLang } from "@/lib/lang-context";
import { Footer } from "./Footer";

/**
 * Shared chrome for the standalone legal routes (/privacy, /delete-account).
 *
 * Deliberately not the site Navbar: that one links to on-page anchors
 * (#features, #nawal) which do not exist here, and carries the mother/father
 * toggle, which is meaningless on a legal page.
 *
 * All spacing uses logical properties (paddingInline, marginInlineStart) rather
 * than left/right, so the pages mirror correctly when LangProvider flips
 * document.documentElement.dir to rtl.
 */
export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const { t, lang, toggle } = useLang();

  return (
    <>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBlock: 18,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            <Image
              src="/nawah-logo-dark.png"
              alt="Nawah"
              width={36}
              height={36}
              style={{ height: 36, width: "auto", display: "block" }}
            />
            <span style={{ fontSize: 14, color: "var(--fg-muted)" }}>
              {t("legal.back") as string}
            </span>
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--fg)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </header>

      <main
        className="container"
        style={{ maxWidth: 760, paddingBlock: "clamp(48px, 8vw, 96px)" }}
      >
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="display-md" style={{ marginTop: 16 }}>
          {title}
        </h1>
        <p style={{ marginTop: 12, fontSize: 14, color: "var(--fg-muted)" }}>
          {updated}
        </p>
        <div style={{ marginTop: 40 }}>{children}</div>
      </main>

      <Footer />
    </>
  );
}

export default LegalLayout;
