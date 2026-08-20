"use client";
import { useLang } from "@/lib/lang-context";
import { LegalLayout } from "@/components/LegalLayout";

type Section = { heading: string; body: string[] };

/**
 * Public privacy policy. Google Play requires this URL on the store listing and
 * the Data Safety declaration must agree with what it says, so the disclosures
 * here are written from the app's actual integrations (Supabase, Firebase,
 * PostHog, AdMob, RevenueCat, Groq) rather than from a template.
 */
export default function PrivacyPage() {
  const { t } = useLang();
  const sections = t("privacy.sections") as Section[];

  return (
    <LegalLayout
      eyebrow={t("privacy.eyebrow") as string}
      title={t("privacy.title") as string}
      updated={t("privacy.updated") as string}
    >
      <p style={{ fontSize: 18, lineHeight: 1.7 }}>{t("privacy.intro") as string}</p>

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
        <h2 className="display-sm">{t("privacy.contactHeading") as string}</h2>
        <p style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}>
          {t("privacy.contactBody") as string}
        </p>
        <a
          href={`mailto:${t("privacy.contactEmail") as string}`}
          className="btn btn-primary"
          style={{ marginTop: 20 }}
        >
          {t("privacy.contactEmail") as string}
        </a>
      </section>
    </LegalLayout>
  );
}
