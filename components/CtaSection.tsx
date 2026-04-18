"use client";
import { useLang } from "@/lib/lang-context";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function CtaSection() {
  const { t } = useLang();
  const eyebrow = t("cta.eyebrow") as string;
  const headlineA = t("cta.headlineA") as string;
  const headlineB = t("cta.headlineB") as string;
  const sub = t("cta.sub") as string;
  const downloadSmall = t("cta.downloadSmall") as string;
  const downloadBig = t("cta.downloadBig") as string;

  return (
    <section
      id="cta"
      style={{
        background: "var(--bg-inv)",
        color: "#fff",
        padding: "clamp(80px, 12vw, 160px) 0 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>
            {eyebrow}
          </div>
          <h2 className="display-xl" style={{ marginTop: 20, color: "#fff" }}>
            {headlineA}
            <br />
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{headlineB}</em>
          </h2>
          <p
            style={{
              marginTop: 28,
              fontSize: 18,
              opacity: 0.7,
              maxWidth: 560,
              margin: "28px auto 0",
            }}
          >
            {sub}
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginTop: 44,
              flexWrap: "wrap",
            }}
          >
            <a
              href={PLAY_STORE_URL}
              className="btn btn-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5V3.5c0-.27.11-.52.29-.7L13 12l-9.71 9.2c-.18-.18-.29-.43-.29-.7zM14.14 12l2.65-2.51 3.82 2.18c.56.32.56 1.14 0 1.46l-3.82 2.18L14.14 12zM5.29 2.5l10.39 5.93-2.44 2.31L5.29 2.5zM5.29 21.5l7.95-7.74 2.44 2.31L5.29 21.5z" />
              </svg>
              <span>
                <small>{downloadSmall}</small>
                <strong>{downloadBig}</strong>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
