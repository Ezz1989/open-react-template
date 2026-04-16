"use client";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function PartnerSync() {
  const { t } = useLang();
  const features = t("partner.features") as string[];

  return (
    <section className="relative overflow-hidden bg-[#1A1625] py-24 px-6 lg:px-20">
      <BackgroundBeams />
      <div className="relative z-10 flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
        {/* Two floating 3D screens */}
        <div className="flex items-end flex-shrink-0 scale-[0.78] origin-top sm:scale-90 lg:scale-100">
          {/* Mother screen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-44 h-80 rounded-2xl border border-white/10 bg-[#1A1625] p-4 flex flex-col gap-3"
            style={{
              transform: "perspective(1000px) rotateY(-15deg)",
              boxShadow: "0 0 80px rgba(201,114,138,0.25), 0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="h-2 w-12 rounded-full bg-[#C9728A]/40" />
            <div className="h-20 rounded-xl bg-[#C9728A]/10 border border-[#C9728A]/20 flex items-center justify-center">
              <span className="text-3xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>24</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5" />
            <div className="h-2 w-3/4 rounded-full bg-white/5" />
            <div className="h-2 w-1/2 rounded-full bg-white/5" />
          </motion.div>

          {/* Father screen */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}
            className="w-44 h-80 rounded-2xl border border-white/10 bg-[#1A1625] p-4 flex flex-col gap-3 -ml-4 mt-6"
            style={{
              transform: "perspective(1000px) rotateY(15deg)",
              boxShadow: "0 0 80px rgba(30,58,95,0.4), 0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="h-2 w-12 rounded-full bg-[#378ADD]/40" />
            <div className="h-20 rounded-xl bg-[#1E3A5F]/40 border border-[#378ADD]/20 flex items-center justify-center">
              <span className="text-3xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>24</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5" />
            <div className="h-2 w-3/4 rounded-full bg-white/5" />
            <div className="h-2 w-1/2 rounded-full bg-white/5" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="text-3xl lg:text-4xl font-medium text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("partner.headline") as string}
          </motion.h2>
          <p className="text-[#C9728A] text-lg mb-6" style={{ fontFamily: "var(--font-cairo)" }}>
            {t("partner.subheadline") as string}
          </p>
          <p className="text-[#5F5E5A] mb-8 leading-relaxed">{t("partner.body") as string}</p>
          <ul className="flex flex-col gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[#888780]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9728A] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
