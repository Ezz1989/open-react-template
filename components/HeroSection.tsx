"use client";
import { motion, type Easing } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Meteors } from "@/components/ui/meteors";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

export function HeroSection() {
  const { t, lang } = useLang();

  const ease: Easing = "easeOut";

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease, delay },
    }),
  };

  const cardSlide = (dir: "left" | "right") => ({
    hidden: { opacity: 0, x: dir === "left" ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.28, ease, delay: 0.3 },
    },
  });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1A1625] px-6 pt-24 pb-16 lg:flex-row lg:px-20 lg:gap-16">
      <Spotlight className="-top-40 -left-20" fill="#C9728A" />
      <Meteors number={18} />

      {/* Left: Text */}
      <div className={cn("z-10 flex flex-col gap-6 max-w-xl", lang === "ar" && "text-right items-end")}>
        <AnimatedGradientText className="text-5xl lg:text-7xl [font-family:var(--font-playfair)]">
          {t("hero.wordmark") as string}
        </AnimatedGradientText>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-3xl lg:text-5xl font-medium text-white leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("hero.headline") as string}
        </motion.h1>

        <WordFadeIn
          words={t("hero.subheadline") as string}
          className="text-xl lg:text-2xl text-[#C9728A] [font-family:var(--font-cairo)]"
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-[#5F5E5A] text-base leading-relaxed"
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
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt={t("hero.cta") as string}
            className="h-14 w-auto"
          />
        </motion.a>
      </div>

      {/* Right: Floating cards */}
      <div className="z-10 relative flex items-center justify-center mt-12 lg:mt-0 w-full max-w-sm lg:max-w-md">
        {/* Mother card — rose glow */}
        <motion.div
          variants={cardSlide("left")}
          initial="hidden"
          animate="visible"
          className="relative w-52 rounded-2xl bg-[#1A1625] border border-white/10 p-5 z-10"
          style={{
            transform: "perspective(1000px) rotateX(8deg) rotateY(-12deg)",
            boxShadow: "0 0 60px rgba(201,114,138,0.3), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <BorderBeam size={80} duration={8} colorFrom="#C9728A" colorTo="#72243E" />
          <p className="text-xs text-[#C9728A] mb-1">{t("hero.motherCardLabel") as string}</p>
          <p
            className="text-4xl font-medium text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            24
          </p>
          <p className="text-xs text-[#888780] leading-snug">{t("hero.motherCardSub") as string}</p>
        </motion.div>

        {/* Father card — navy glow */}
        <motion.div
          variants={cardSlide("right")}
          initial="hidden"
          animate="visible"
          className="relative w-52 rounded-2xl bg-[#1A1625] border border-white/10 p-5 -ml-6 mt-8"
          style={{
            transform: "perspective(1000px) rotateX(8deg) rotateY(12deg)",
            boxShadow: "0 0 60px rgba(30,58,95,0.5), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <p className="text-xs text-[#378ADD] mb-1">{t("hero.fatherCardLabel") as string}</p>
          <p
            className="text-4xl font-medium text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            24
          </p>
          <p className="text-xs text-[#888780] leading-snug">{t("hero.fatherCardSub") as string}</p>
        </motion.div>
      </div>
    </section>
  );
}
