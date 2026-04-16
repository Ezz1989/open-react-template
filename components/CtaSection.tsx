"use client";
import { useLang } from "@/lib/lang-context";
import { BorderBeam } from "@/components/ui/border-beam";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function CtaSection() {
  const { t } = useLang();

  return (
    <section id="cta" className="bg-[#1A1625] py-24 px-6 flex justify-center">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-12 text-center max-w-lg w-full">
        <BorderBeam size={120} duration={10} colorFrom="#C9728A" colorTo="#1E3A5F" />
        <h2
          className="text-3xl font-medium text-white mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("cta.headline") as string}
        </h2>
        <p className="text-[#C9728A] mb-8 text-lg" style={{ fontFamily: "var(--font-cairo)" }}>
          {t("cta.subheadline") as string}
        </p>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt={t("cta.badge") as string}
            className="h-16 w-auto mx-auto"
          />
        </a>
        <div className="mt-8 flex justify-center gap-6 text-sm text-[#888780]">
          <a href="/privacy" className="hover:text-white transition">{t("cta.privacy") as string}</a>
          <span>·</span>
          <a href="mailto:nawahapp@outlook.com" className="hover:text-white transition">nawahapp@outlook.com</a>
        </div>
      </div>
    </section>
  );
}
