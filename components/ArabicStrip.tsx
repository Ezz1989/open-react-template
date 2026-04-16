"use client";
import { useLang } from "@/lib/lang-context";
import BlurIn from "@/components/ui/blur-in";

export function ArabicStrip() {
  const { t } = useLang();

  return (
    <section
      className="py-20 px-6 text-center"
      style={{ background: "linear-gradient(135deg, #C9728A, #72243E)" }}
    >
      <BlurIn
        word={t("arabic.headline") as string}
        className="text-4xl lg:text-6xl font-medium text-white mb-4"
      />
      <p className="text-white/70 text-lg" style={{ fontFamily: "var(--font-cairo)" }}>
        {t("arabic.countries") as string}
      </p>
    </section>
  );
}
