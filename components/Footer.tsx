"use client";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function Footer() {
  const { t } = useLang();
  const links = t("footer.links") as {
    privacy: string;
    terms: string;
    safety: string;
    contact: string;
  };
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
            <a href="#">{links.privacy}</a>
            <a href="#">{links.terms}</a>
            <a href="#">{links.safety}</a>
            <a href="#">{links.contact}</a>
          </div>
          <div>{copyright}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
