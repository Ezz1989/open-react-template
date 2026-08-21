"use client";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function Footer() {
  const { t } = useLang();
  const links = t("footer.links") as { label: string; href: string }[];
  const copyright = t("footer.copyright") as string;

  return (
    <footer
      style={{
        background: "var(--bg-inv)",
        color: "#fff",
        padding: "0 0 40px",
      }}
    >
      <div className="container">
        <div
          style={{
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Image
              src="/nawah-logo-white.png"
              alt="Nawah"
              width={64}
              height={64}
              style={{ height: 64, width: "auto", display: "block" }}
            />
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {/* Both locales are linked explicitly, not via the current `lang`.
                The homepage renders server-side with lang defaulting to "en",
                so a language-aware link would leave /ar/guide with no internal
                link from anywhere on the site. Arabic is the primary audience,
                so it cannot be the one that goes unlinked. */}
            <a href="/ar/guide" hrefLang="ar" lang="ar">
              دليل الحمل
            </a>
            <a href="/en/guide" hrefLang="en" lang="en">
              Pregnancy guide
            </a>
            {links.map((l) => {
              const external = l.href.startsWith("http");
              return (
                <a
                  key={l.label}
                  href={l.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
          <div>{copyright}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
