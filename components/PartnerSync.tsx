"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function PartnerSync() {
  const { t, lang } = useLang();
  const features = t("partner.features") as string[];
  const isAr = lang === "ar";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section className="relative overflow-hidden bg-[#1A1625] py-24 px-6 lg:px-20">
      <BackgroundBeams />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row lg:gap-20">
        <div className="flex flex-shrink-0 items-end scale-[0.78] origin-top sm:scale-90 lg:scale-100">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-48 h-[360px] rounded-[28px] border border-white/10 bg-[#1A1625] p-4 flex flex-col gap-3"
            style={{
              transform: "perspective(1000px) rotateY(-15deg)",
              boxShadow: "0 0 80px rgba(201,114,138,0.25), 0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#C9728A]">Mother</p>
                <p className="text-sm text-white/80">Hello, Mom</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[#C9728A]" />
            </div>
            <div className="rounded-2xl bg-[#C9728A] p-4">
              <p className="text-[10px] text-white/70">Week</p>
              <p className="text-3xl font-medium text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                11
              </p>
              <p className="text-xs text-white/80 mt-1">Lime</p>
              <div className="mt-3 h-1 w-full rounded-full bg-white/20">
                <div className="h-1 w-[27%] rounded-full bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 rounded-lg bg-white/5" />
              <div className="h-12 rounded-lg bg-white/5" />
            </div>
            <div className="h-2 w-3/4 rounded-full bg-white/5" />
            <div className="h-2 w-1/2 rounded-full bg-white/5" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}
            className="w-48 h-[360px] rounded-[28px] border border-white/10 bg-[#1A1625] p-4 flex flex-col gap-3 -ml-6 mt-8"
            style={{
              transform: "perspective(1000px) rotateY(15deg)",
              boxShadow: "0 0 80px rgba(30,58,95,0.4), 0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#378ADD]">Father</p>
                <p className="text-sm text-white/80">Hello, Dad</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-[#378ADD]" />
            </div>
            <div className="rounded-2xl bg-[#1E3A5F] p-4">
              <p className="text-[10px] text-white/60">Week</p>
              <p className="text-3xl font-medium text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                11
              </p>
              <p className="text-xs text-white/70 mt-1">Lime</p>
              <div className="mt-3 h-1 w-full rounded-full bg-white/15">
                <div className="h-1 w-[27%] rounded-full bg-[#378ADD]" />
              </div>
            </div>
            <div className="rounded-lg border-l-2 border-[#378ADD] bg-white/5 p-2">
              <p className="text-[10px] text-white/60">A child learns what a father&apos;s love looks like by watching you.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 rounded-lg bg-white/5" />
              <div className="h-12 rounded-lg bg-white/5" />
            </div>
          </motion.div>
        </div>

        <div className={isAr ? "text-right max-w-lg" : "max-w-lg"}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-3xl lg:text-5xl font-medium text-white mb-3 leading-tight"
            style={{ fontFamily: displayFont }}
          >
            {t("partner.headline") as string}
          </motion.h2>
          <p className="text-[#C9728A] text-lg mb-6" style={{ fontFamily: displayFont }}>
            {t("partner.subheadline") as string}
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">{t("partner.body") as string}</p>
          <ul className="flex flex-col gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-white/70">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C9728A]/20">
                  <Check className="h-3 w-3 text-[#C9728A]" strokeWidth={2.5} />
                </span>
                <span className="text-sm lg:text-base leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
