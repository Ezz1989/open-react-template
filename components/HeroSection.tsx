"use client";
import { motion, type Easing } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { Meteors } from "@/components/ui/meteors";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { Spotlight } from "@/components/ui/spotlight";
import { ScreenshotsMarquee } from "@/components/ScreenshotsMarquee";
import { cn } from "@/lib/utils";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function HeroSection() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";
  const ease: Easing = "easeOut";

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease, delay },
    }),
  };

  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section className="relative min-h-[70vh] bg-[#1A1625] overflow-hidden pt-28 pb-0">
      <Spotlight className="-top-40 left-1/2 -translate-x-1/2" fill="#C9728A" />
      <Meteors number={18} />

      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease }}
          className="text-6xl lg:text-8xl font-medium bg-clip-text text-transparent"
          style={{
            fontFamily: displayFont,
            backgroundImage: "linear-gradient(135deg, #FAFAF8 0%, #C9728A 60%, #378ADD 100%)",
          }}
        >
          {t("hero.wordmark") as string}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-3xl lg:text-5xl font-medium text-white leading-tight"
          style={{ fontFamily: displayFont }}
        >
          {t("hero.headline") as string}
        </motion.h1>

        <WordFadeIn
          words={t("hero.subheadline") as string}
          className={cn(
            "text-xl lg:text-2xl text-[#C9728A]",
            isAr && "[font-family:var(--font-cairo)]"
          )}
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-white/60 text-base lg:text-lg leading-relaxed max-w-lg"
        >
          {t("hero.body") as string}
        </motion.p>

        <motion.a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-2 inline-block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt={t("hero.cta") as string}
            className="h-14 w-auto"
          />
        </motion.a>
      </div>

      <div className="relative z-10 mt-16">
        <ScreenshotsMarquee />
      </div>
    </section>
  );
}
