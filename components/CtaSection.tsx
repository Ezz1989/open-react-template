"use client";
import { useLang } from "@/lib/lang-context";
import { BorderBeam } from "@/components/ui/border-beam";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function CtaSection() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section id="cta" className="bg-[#1A1625] py-28 px-6 flex justify-center">
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center max-w-xl w-full">
        <BorderBeam size={120} duration={10} colorFrom="#C9728A" colorTo="#378ADD" />
        <h2
          className="text-4xl lg:text-5xl font-medium text-white mb-3 leading-tight"
          style={{ fontFamily: displayFont }}
        >
          {t("cta.headline") as string}
        </h2>
        <p className="text-white/60 mb-8 text-lg max-w-sm mx-auto leading-relaxed">
          {t("cta.subheadline") as string}
        </p>
        <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt={t("cta.badge") as string}
            className="h-16 w-auto mx-auto"
          />
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/40">
          <a href="/privacy" className="hover:text-white/80 transition">
            {t("cta.privacy") as string}
          </a>
          <span aria-hidden>·</span>
          <a href="mailto:nawahapp@outlook.com" className="hover:text-white/80 transition">
            nawahapp@outlook.com
          </a>
        </div>
      </div>
    </section>
  );
}
