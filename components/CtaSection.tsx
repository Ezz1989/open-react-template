"use client";
import { useLang } from "@/lib/lang-context";
import { PLAY_STORE_URL } from "@/lib/constants";

export function CtaSection() {
  const { t } = useLang();
  const eyebrow = t("cta.eyebrow") as string;
  const headlineA = t("cta.headlineA") as string;
  const headlineB = t("cta.headlineB") as string;
  const sub = t("cta.sub") as string;
  const downloadSmall = t("cta.downloadSmall") as string;
  const downloadBig = t("cta.downloadBig") as string;
  const appStoreSmall = t("cta.appStoreSmall") as string;
  const appStoreBig = t("cta.appStoreBig") as string;

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
            {/*
              🔗 MEMO — LINK UPDATE REQUIRED AT LAUNCH (Google Play)
              PLAY_STORE_URL currently 404s. Verified 2026-08-11: the listing
              for com.nawahapp is not public because the app is only on the
              INTERNAL TESTING track, so this button sends visitors to an error
              page. It starts resolving once the app is published to production
              (tracker step P15). Re-check the URL then; nothing here needs
              editing if the package id is unchanged.
            */}
            <a
              href={PLAY_STORE_URL}
              className="btn btn-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5V3.5c0-.27.11-.52.29-.7L13 12l-9.71 9.2c-.18-.18-.29-.43-.29-.7zM14.14 12l2.65-2.51 3.82 2.18c.56.32.56 1.14 0 1.46l-3.82 2.18L14.14 12zM5.29 2.5l10.39 5.93-2.44 2.31L5.29 2.5zM5.29 21.5l7.95-7.74 2.44 2.31L5.29 21.5z" />
              </svg>
              <span>
                <small>{downloadSmall}</small>
                <strong>{downloadBig}</strong>
              </span>
            </a>

            {/*
              🔗 MEMO — LINK REQUIRED WHEN THE iOS APP SHIPS (App Store)
              There is no iOS build yet, so this is deliberately a <span>, not an
              <a>: a badge linking to a non-existent app misleads users and is
              exactly the kind of claim Play/App Store review penalises.
              WHEN THE iOS APP IS LIVE: add APP_STORE_URL to lib/constants.ts,
              swap this <span> for an <a href={APP_STORE_URL}>, drop the
              btn-store-soon class, and change cta.appStoreSmall from
              "Coming soon to" / "قريباً على" back to "Download on" / "حمّل من".
              Tracker step P18.
            */}
            <span className="btn btn-store btn-store-soon" aria-disabled="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.36 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.19.76 1.11 1.67 2.36 2.86 2.31 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.41-.93-2.41-3.7zM14.1 5.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.77-.96 2.81 1.01.08 2.05-.52 2.69-1.28z" />
              </svg>
              <span>
                <small>{appStoreSmall}</small>
                <strong>{appStoreBig}</strong>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
