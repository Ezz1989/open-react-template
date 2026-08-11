"use client";
import { useLang } from "@/lib/lang-context";
import { LegalLayout } from "@/components/LegalLayout";

/**
 * Account deletion instructions.
 *
 * Google Play requires a PUBLICLY REACHABLE URL for deletion requests — an
 * in-app path alone is not sufficient, because the reviewer (and a user who has
 * uninstalled) must be able to reach it without an account. Hence this page
 * documents both the in-app route and an email route, and states what is
 * deleted, what is retained and for how long.
 */
export default function DeleteAccountPage() {
  const { t } = useLang();
  const steps = t("deleteAccount.inAppSteps") as string[];
  const deleted = t("deleteAccount.deletedItems") as string[];
  const kept = t("deleteAccount.keptItems") as string[];

  const listStyle = {
    marginTop: 14,
    lineHeight: 1.75,
    color: "var(--fg-muted)",
    paddingInlineStart: 22,
  } as const;

  return (
    <LegalLayout
      eyebrow={t("deleteAccount.eyebrow") as string}
      title={t("deleteAccount.title") as string}
      updated={t("deleteAccount.updated") as string}
    >
      <p style={{ fontSize: 18, lineHeight: 1.7 }}>
        {t("deleteAccount.intro") as string}
      </p>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.inAppHeading") as string}</h2>
        <ol style={listStyle}>
          {steps.map((s) => (
            <li key={s} style={{ marginTop: 8 }}>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.emailHeading") as string}</h2>
        <p style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}>
          {t("deleteAccount.emailBody") as string}
        </p>
        <a
          href={`mailto:${t("deleteAccount.contactEmail") as string}?subject=${encodeURIComponent(
            "Delete my account",
          )}`}
          className="btn btn-primary"
          style={{ marginTop: 20 }}
        >
          {t("deleteAccount.contactEmail") as string}
        </a>
      </section>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.deletedHeading") as string}</h2>
        <ul style={listStyle}>
          {deleted.map((d) => (
            <li key={d} style={{ marginTop: 8 }}>
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.keptHeading") as string}</h2>
        <ul style={listStyle}>
          {kept.map((k) => (
            <li key={k} style={{ marginTop: 8 }}>
              {k}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.timingHeading") as string}</h2>
        <p style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}>
          {t("deleteAccount.timingBody") as string}
        </p>
      </section>

      <section style={{ marginTop: 44, padding: 0 }}>
        <h2 className="display-sm">{t("deleteAccount.partnerHeading") as string}</h2>
        <p style={{ marginTop: 14, lineHeight: 1.75, color: "var(--fg-muted)" }}>
          {t("deleteAccount.partnerBody") as string}
        </p>
      </section>
    </LegalLayout>
  );
}
