"use client";
import { motion, type Easing } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { Meteors } from "@/components/ui/meteors";
import { WordFadeIn } from "@/components/ui/word-fade-in";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
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

  const cardSlide = (dir: "left" | "right") => ({
    hidden: { opacity: 0, x: dir === "left" ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.28, ease, delay: 0.3 },
    },
  });

  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1A1625] px-6 pt-24 pb-16 lg:flex-row lg:px-20 lg:gap-16">
      <Spotlight className="-top-40 -left-20" fill="#C9728A" />
      <Meteors number={18} />

      <div className={cn("z-10 flex flex-col gap-6 max-w-xl", isAr && "text-right items-end")}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease }}
          className="text-5xl lg:text-7xl font-medium bg-clip-text text-transparent"
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

      <div className="z-10 relative flex flex-col items-center gap-4 mt-12 lg:mt-0 lg:flex-row lg:items-end w-full max-w-sm lg:max-w-md">
        {/* Mother card — rose glow */}
        <motion.div
          variants={cardSlide("left")}
          initial="hidden"
          animate="visible"
          className="relative w-56 rounded-2xl bg-[#1A1625] border border-white/10 p-3 z-10 flex flex-col gap-2"
          style={{
            transform: "perspective(1000px) rotateX(8deg) rotateY(-12deg)",
            boxShadow: "0 0 60px rgba(201,114,138,0.3), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <BorderBeam size={80} duration={8} colorFrom="#C9728A" colorTo="#72243E" />
          {/* App header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#C9728A]/70">Mother</p>
              <p className="text-xs font-medium text-white/90">Hello, Mom</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#C9728A]" />
          </div>
          {/* Week sub-card */}
          <div className="rounded-xl bg-[#C9728A] p-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[9px] text-white/70 uppercase tracking-wider">Week</p>
                <p className="text-3xl font-medium text-white leading-none" style={{ fontFamily: "var(--font-playfair)" }}>11</p>
              </div>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-medium text-white">T1</span>
            </div>
            <p className="text-[10px] text-white/80 mb-1.5">Lime · 5.4 cm</p>
            <div className="h-1 w-full rounded-full bg-white/20">
              <div className="h-1 rounded-full bg-white" style={{ width: "27%" }} />
            </div>
          </div>
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-1.5 px-0.5">
            {["Symptoms", "Vitals", "Baby Names", "Journal"].map((label) => (
              <div key={label} className="rounded-lg bg-white/5 border border-white/5 px-2 py-1.5 text-center">
                <p className="text-[9px] text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Father card — navy glow */}
        <motion.div
          variants={cardSlide("right")}
          initial="hidden"
          animate="visible"
          className="relative w-56 rounded-2xl bg-[#1A1625] border border-white/10 p-3 lg:-ml-8 lg:mt-8 flex flex-col gap-2"
          style={{
            transform: "perspective(1000px) rotateX(8deg) rotateY(12deg)",
            boxShadow: "0 0 60px rgba(30,58,95,0.5), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* App header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#378ADD]/70">Father</p>
              <p className="text-xs font-medium text-white/90">Hello, Dad</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#378ADD]" />
          </div>
          {/* Week sub-card */}
          <div className="rounded-xl bg-[#1E3A5F] p-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Week</p>
                <p className="text-3xl font-medium text-white leading-none" style={{ fontFamily: "var(--font-playfair)" }}>11</p>
              </div>
              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white">T1</span>
            </div>
            <p className="text-[10px] text-white/70 mb-1.5">Lime · 5.4 cm</p>
            <div className="h-1 w-full rounded-full bg-white/15">
              <div className="h-1 rounded-full bg-[#378ADD]" style={{ width: "27%" }} />
            </div>
          </div>
          {/* Quote */}
          <div className="rounded-lg border-l-2 border-[#378ADD]/60 bg-white/[0.03] px-2 py-1.5">
            <p className="text-[9px] italic text-white/50 leading-relaxed">
              &ldquo;A child learns what a father&apos;s love looks like by watching you.&rdquo;
            </p>
          </div>
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-1.5 px-0.5">
            {["Appointments", "Baby Budget"].map((label) => (
              <div key={label} className="rounded-lg bg-white/5 border border-white/5 px-2 py-1.5 text-center">
                <p className="text-[9px] text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
