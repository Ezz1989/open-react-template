"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { getSupabase } from "@/lib/supabase";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

type Phase = "checking" | "ready" | "invalid" | "success";

export default function ResetPasswordPage() {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // The email template sends users here with ?token_hash=...&type=recovery.
    // verifyOtp turns that into a session without needing a PKCE verifier and
    // without being consumed by email-scanner pre-fetches (those don't run JS).
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    if (!tokenHash || type !== "recovery") {
      setPhase("invalid");
      return;
    }

    const supabase = getSupabase();
    supabase.auth
      .verifyOtp({ type: "recovery", token_hash: tokenHash })
      .then(({ data, error }) => {
        if (error || !data.session) {
          setPhase("invalid");
        } else {
          setPhase("ready");
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t("resetPassword.errorShort") as string);
      return;
    }
    if (password !== confirm) {
      setError(t("resetPassword.errorMismatch") as string);
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || (t("resetPassword.errorGeneric") as string));
        setSubmitting(false);
        return;
      }
      await supabase.auth.signOut();
      setPhase("success");
    } catch {
      setError(t("resetPassword.errorGeneric") as string);
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vw, 80px) 0",
        background: "var(--bg)",
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            background: "var(--bg-elev)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(32px, 5vw, 48px)",
            boxShadow: "var(--shadow-md)",
          }}
          className="fade-up"
        >
          {phase === "checking" && <CheckingView />}
          {phase === "invalid" && <InvalidView />}
          {phase === "success" && <SuccessView />}
          {phase === "ready" && (
            <FormView
              password={password}
              confirm={confirm}
              submitting={submitting}
              error={error}
              onPasswordChange={setPassword}
              onConfirmChange={setConfirm}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function CheckingView() {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div
        style={{
          width: 28,
          height: 28,
          margin: "0 auto 20px",
          border: "2px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InvalidView() {
  const { t } = useLang();
  return (
    <div style={{ textAlign: "center" }}>
      <div className="eyebrow" style={{ color: "var(--accent-strong)" }}>
        {t("resetPassword.eyebrow") as string}
      </div>
      <h1 className="display-sm" style={{ marginTop: 16 }}>
        {t("resetPassword.invalidTitle") as string}
      </h1>
      <p style={{ marginTop: 16, color: "var(--fg-muted)", fontSize: 16, lineHeight: 1.6 }}>
        {t("resetPassword.invalidSub") as string}
      </p>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
        style={{ marginTop: 28 }}
      >
        {t("resetPassword.openApp") as string}
      </a>
    </div>
  );
}

function SuccessView() {
  const { t } = useLang();
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 20px",
          borderRadius: "50%",
          background: "var(--chip-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-strong)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="eyebrow" style={{ color: "var(--accent-strong)" }}>
        {t("resetPassword.eyebrow") as string}
      </div>
      <h1 className="display-sm" style={{ marginTop: 16 }}>
        {t("resetPassword.successTitle") as string}
      </h1>
      <p style={{ marginTop: 16, color: "var(--fg-muted)", fontSize: 16, lineHeight: 1.6 }}>
        {t("resetPassword.successSub") as string}
      </p>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
        style={{ marginTop: 28 }}
      >
        {t("resetPassword.openApp") as string}
      </a>
    </div>
  );
}

interface FormViewProps {
  password: string;
  confirm: string;
  submitting: boolean;
  error: string | null;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FormView({
  password,
  confirm,
  submitting,
  error,
  onPasswordChange,
  onConfirmChange,
  onSubmit,
}: FormViewProps) {
  const { t } = useLang();
  return (
    <form onSubmit={onSubmit}>
      <div className="eyebrow" style={{ color: "var(--accent-strong)" }}>
        {t("resetPassword.eyebrow") as string}
      </div>
      <h1 className="display-sm" style={{ marginTop: 16 }}>
        {t("resetPassword.title") as string}
      </h1>
      <p style={{ marginTop: 14, color: "var(--fg-muted)", fontSize: 16, lineHeight: 1.6 }}>
        {t("resetPassword.sub") as string}
      </p>

      <Field
        label={t("resetPassword.newLabel") as string}
        value={password}
        placeholder={t("resetPassword.newPlaceholder") as string}
        onChange={onPasswordChange}
        autoComplete="new-password"
      />
      <Field
        label={t("resetPassword.confirmLabel") as string}
        value={confirm}
        placeholder={t("resetPassword.confirmPlaceholder") as string}
        onChange={onConfirmChange}
        autoComplete="new-password"
      />

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--chip-bg)",
            color: "var(--accent-strong)",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{
          marginTop: 28,
          width: "100%",
          opacity: submitting ? 0.7 : 1,
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting
          ? (t("resetPassword.submitting") as string)
          : (t("resetPassword.submit") as string)}
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  autoComplete: string;
}

function Field({ label, value, placeholder, onChange, autoComplete }: FieldProps) {
  return (
    <label style={{ display: "block", marginTop: 22 }}>
      <span
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--fg)",
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      <input
        type="password"
        required
        minLength={8}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: 15,
          fontFamily: "inherit",
          color: "var(--fg)",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          outline: "none",
          transition: "border-color 0.2s var(--ease)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </label>
  );
}
