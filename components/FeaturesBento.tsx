"use client";
import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import BlurIn from "@/components/ui/blur-in";
import { cn } from "@/lib/utils";

interface BentoCard {
  title: string;
  body: string;
  size: string;
}

const cardAccents: Record<number, string> = {
  0: "linear-gradient(135deg, rgba(201,114,138,0.13), rgba(30,58,95,0.13))",
  1: "rgba(201,114,138,0.08)",
  2: "rgba(136,135,128,0.08)",
  3: "rgba(30,58,95,0.08)",
  4: "rgba(201,114,138,0.08)",
  5: "linear-gradient(135deg, rgba(201,114,138,0.13), rgba(114,36,62,0.13))",
};

function SpotlightCard({
  title,
  body,
  large,
  accent,
}: {
  title: string;
  body: string;
  large?: boolean;
  accent: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(
        "bento-card relative overflow-hidden rounded-2xl border border-[#2C2C2A]/10 p-6 flex flex-col justify-end",
        large ? "col-span-2 row-span-2 min-h-56" : "min-h-36"
      )}
      style={{ background: accent }}
    >
      <div className="bento-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" />
      <h3 className="text-sm text-[#5F5E5A] mb-1">{title}</h3>
      <p className="text-xl font-medium text-[#2C2C2A]" style={{ fontFamily: "var(--font-playfair)" }}>
        {body}
      </p>
    </motion.div>
  );
}

export function FeaturesBento() {
  const { t } = useLang();
  const cards = t("bento.cards") as BentoCard[];

  return (
    <section className="bg-[#FAFAF8] py-20 px-6 lg:px-20">
      <BlurIn
        word="Features"
        className="text-center text-2xl lg:text-3xl font-medium text-[#2C2C2A] mb-12"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <SpotlightCard
            key={i}
            title={card.title}
            body={card.body}
            large={card.size === "large"}
            accent={cardAccents[i]}
          />
        ))}
      </div>
    </section>
  );
}
