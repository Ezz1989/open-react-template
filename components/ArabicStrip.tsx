"use client";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";

export function ArabicStrip() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section
      className="relative overflow-hidden py-24 px-6 text-center"
      style={{ background: "linear-gradient(135deg, #C9728A 0%, #72243E 100%)" }}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4"
      >
        {t("arabic.eyebrow") as string}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.28, ease: "easeOut", delay: 0.06 }}
        className="text-4xl lg:text-6xl font-medium text-white leading-tight max-w-3xl mx-auto"
        style={{ fontFamily: displayFont }}
      >
        {t("arabic.headline") as string}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.28, ease: "easeOut", delay: 0.12 }}
        className="mt-6 text-white/75 text-lg max-w-xl mx-auto leading-relaxed"
      >
        {t("arabic.body") as string}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.28, ease: "easeOut", delay: 0.2 }}
        className="mt-8 text-white/60 text-sm"
        style={{ fontFamily: "var(--font-cairo)" }}
      >
        {t("arabic.countries") as string}
      </motion.p>
    </section>
  );
}
