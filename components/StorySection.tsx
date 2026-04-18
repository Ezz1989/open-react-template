"use client";
import Image from "next/image";
import { motion, type Easing } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

interface StorySectionProps {
  bucket: "partnership" | "science" | "arabWorld";
  imageUrl: string;
  imageAlt: string;
  imageSide: "left" | "right";
  glow?: "rose" | "navy";
  priority?: boolean;
}

export function StorySection({
  bucket,
  imageUrl,
  imageAlt,
  imageSide,
  glow = "rose",
  priority = false,
}: StorySectionProps) {
  const { t, lang } = useLang();
  const isAr = lang === "ar";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";
  const ease: Easing = "easeOut";

  const eyebrow = t(`${bucket}.eyebrow`) as string;
  const headline = t(`${bucket}.headline`) as string;
  const body = t(`${bucket}.body`) as string;
  const bullets = t(`${bucket}.bullets`) as string[];

  const glowColor = glow === "rose" ? "rgba(201,114,138,0.25)" : "rgba(55,138,221,0.25)";
  const accentColor = glow === "rose" ? "#C9728A" : "#378ADD";

  return (
    <section className="relative py-24 px-6 lg:px-20 bg-[#1A1625] overflow-hidden">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: imageSide === "left" ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease }}
          className={cn(
            "relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-white/10",
            imageSide === "right" ? "lg:order-2" : "lg:order-1",
          )}
          style={{ boxShadow: `0 30px 80px rgba(0,0,0,0.4), 0 0 60px ${glowColor}` }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width:1024px) 40vw, 100vw"
            className="object-cover"
            priority={priority}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${glowColor} 100%)`,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className={cn(
            "flex flex-col gap-5 max-w-lg",
            imageSide === "right" ? "lg:order-1" : "lg:order-2",
            isAr && "text-right items-end",
          )}
        >
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-4xl lg:text-5xl font-medium text-white leading-tight"
            style={{ fontFamily: displayFont }}
          >
            {headline}
          </h2>
          <p className="text-white/70 text-base lg:text-lg leading-relaxed">
            {body}
          </p>
          <ul className={cn("flex flex-col gap-3 mt-2", isAr && "items-end")}>
            {bullets.map((b, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-3 text-white/80 text-sm lg:text-base",
                  isAr && "flex-row-reverse",
                )}
              >
                <span
                  className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
