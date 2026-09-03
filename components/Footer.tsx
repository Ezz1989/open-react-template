"use client";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";

type SocialIcon = "instagram" | "tiktok" | "facebook";

// Hand-drawn rather than pulled from an icon package: lucide-react (already a
// dependency) dropped brand/social glyphs, so there is nothing to import.
const ICONS: Record<SocialIcon, React.ReactNode> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 3c.4 2.2 1.9 3.6 4.1 3.8v2.9c-1.5.1-2.9-.4-4.1-1.3v6.4c0 3.2-2.6 5.2-5.4 5.2-2.9 0-5.2-2.1-5.2-5.1 0-3 2.6-5.2 5.5-5V13c-1.3-.1-2.6.7-2.6 2.1 0 1.3 1 2.1 2.3 2.1 1.5 0 2.5-1.2 2.5-3V3h2.9Z"
        fill="currentColor"
      />
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 21v-7.5h2.5l.4-3H14V8.4c0-.9.2-1.5 1.5-1.5H17V4.2C16.7 4.1 15.8 4 14.7 4c-2.2 0-3.7 1.3-3.7 3.8V10.5H8.5v3H11V21h3Z"
        fill="currentColor"
      />
    </svg>
  ),
};

export function Footer() {
  const { t } = useLang();
  const links = t("footer.links") as {
    label: string;
    href: string;
    icon?: SocialIcon;
  }[];
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
              دليل الأم
            </a>
            <a href="/en/guide" hrefLang="en" lang="en">
              Mother&apos;s guide
            </a>
            {/* The father hub had no link from the homepage at all, so it was
                reachable only from the guide header and the sitemap. Same
                both-locales reasoning as above. */}
            <a href="/ar/father" hrefLang="ar" lang="ar">
              دليل الأب
            </a>
            <a href="/en/father" hrefLang="en" lang="en">
              Father&apos;s guide
            </a>
            <a href="/ar/about" hrefLang="ar" lang="ar">
              من نحن
            </a>
            <a href="/en/about" hrefLang="en" lang="en">
              About us
            </a>
            {links.map((l) => {
              const external = l.href.startsWith("http");
              return (
                <a
                  key={l.label}
                  href={l.href}
                  aria-label={l.icon ? l.label : undefined}
                  title={l.icon ? l.label : undefined}
                  style={l.icon ? { display: "inline-flex", color: "inherit" } : undefined}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.icon ? ICONS[l.icon] : l.label}
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
