"use client";
import { useLang } from "@/lib/lang-context";
import { LegalLayout } from "@/components/LegalLayout";

type Section = { heading: string; body: string[] };

/**
 * Public support page — the App Store "Support URL" (Apple requires it to lead
 * to real contact details). Same shape as /privacy, content in lib/content.ts.
 */
export default function SupportPage() {
  const { t } = useLang();
  const sections = t("support.sections") as Section[];

  return (
    <LegalLayout
      eyebrow={t("support.eyebrow") as string}
      title={t("support.title") as string}
      updated={t("support.updated") as string}
    >
      <p style={{ fontSize: 18, lineHeight: 1.7 }}>{t("support.intro") as string}</p>

      {sections.map((s) => (
        <section key={s.heading} style={{ marginTop: 44, padding: 0 }}>
          <h2 className="display-sm">{s.heading}</h2>
          {s.body.map((para) => (
            <p
              key={para}
              style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}
            >
              {para}
            </p>
          ))}
        </section>
      ))}

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("support.contactHeading") as string}</h2>
        <p style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}>
          {t("support.contactBody") as string}
        </p>
        <a
          href={`mailto:${t("support.contactEmail") as string}`}
          className="btn btn-primary"
          style={{ marginTop: 20 }}
        >
          {t("support.contactEmail") as string}
        </a>
      </section>
    </LegalLayout>
  );
}
