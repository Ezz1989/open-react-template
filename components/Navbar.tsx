"use client";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { useMode } from "@/lib/mode-context";

export function Navbar() {
  const { t, lang, toggle } = useLang();
  const { mode, setMode } = useMode();

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
        <a href="#features">{t("nav.features") as string}</a>
        <a href="#journey">{t("nav.journey") as string}</a>
        <a href="#nawal">{t("nav.nawal") as string}</a>
        <a href="#names">{t("nav.names") as string}</a>
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
        @media (max-width: 720px) {
          .nav-links-desktop { display: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
