"use client";
import { useLang } from "@/lib/lang-context";
import { LegalLayout } from "@/components/LegalLayout";

type Section = { heading: string; body: string[] };

/**
 * Terms of Use v1 (app 1.0.8). The app's sign-up consent line and paywall link
 * here, and Apple 3.1.2 needs it to answer, so the text comes verbatim from
 * pregnancy_companion/docs/legal_1.0.8/terms_*.json (EN generated, AR by Gemini
 * and checked against EN). The app stores the accepted version number: bump
 * "Version" here only together with the app's terms version.
 */
export default function TermsPage() {
  const { t } = useLang();
  const sections = t("terms.sections") as Section[];

  return (
    <LegalLayout
      eyebrow={t("terms.eyebrow") as string}
      title={t("terms.title") as string}
      updated={t("terms.updated") as string}
    >
      <p style={{ fontSize: 18, lineHeight: 1.7 }}>{t("terms.intro") as string}</p>

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
    </LegalLayout>
  );
}
