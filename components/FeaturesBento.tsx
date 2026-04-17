"use client";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  Sparkles,
  Baby,
  Activity,
  CalendarCheck,
  Briefcase,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";

type CardSize = "tall-wide" | "wide" | "small";
type CardAccent = "rose" | "rose-soft" | "navy" | "navy-soft" | "ivory";

interface BentoCard {
  id: string;
  size: CardSize;
  title: string;
  body: string;
  accent: CardAccent;
}

const iconMap: Record<string, LucideIcon> = {
  journey: CalendarDays,
  partner: Users,
  nawal: Sparkles,
  names: Baby,
  vitals: Activity,
  appointments: CalendarCheck,
  hospital: Briefcase,
  budget: Wallet,
};

const accentStyle: Record<CardAccent, { bg: string; ring: string; icon: string; title: string; body: string }> = {
  rose: {
    bg: "bg-[#C9728A]",
    ring: "ring-[#C9728A]/30",
    icon: "text-white/90",
    title: "text-white",
    body: "text-white/80",
  },
  navy: {
    bg: "bg-[#1E3A5F]",
    ring: "ring-[#1E3A5F]/30",
    icon: "text-[#378ADD]",
    title: "text-white",
    body: "text-white/75",
  },
  "rose-soft": {
    bg: "bg-[#FDF2F4]",
    ring: "ring-[#C9728A]/20",
    icon: "text-[#C9728A]",
    title: "text-[#2C2C2A]",
    body: "text-[#5F5E5A]",
  },
  "navy-soft": {
    bg: "bg-[#EFF3F8]",
    ring: "ring-[#1E3A5F]/15",
    icon: "text-[#1E3A5F]",
    title: "text-[#2C2C2A]",
    body: "text-[#5F5E5A]",
  },
  ivory: {
    bg: "bg-[#F5F2EC]",
    ring: "ring-[#2C2C2A]/10",
    icon: "text-[#2C2C2A]",
    title: "text-[#2C2C2A]",
    body: "text-[#5F5E5A]",
  },
};

const sizeClass: Record<CardSize, string> = {
  "tall-wide": "sm:col-span-2 sm:row-span-2 min-h-[320px]",
  wide: "sm:col-span-2 min-h-[180px]",
  small: "min-h-[180px]",
};

function BentoVisual({ id, accent }: { id: string; accent: CardAccent }) {
  const onDark = accent === "rose" || accent === "navy";

  if (id === "journey") {
    return (
      <div className="absolute right-5 top-5 flex items-center gap-3">
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
          <circle cx="28" cy="28" r="24" fill="none" stroke={onDark ? "rgba(255,255,255,0.2)" : "rgba(44,44,42,0.1)"} strokeWidth="3" />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke={onDark ? "rgba(255,255,255,0.95)" : "#C9728A"}
            strokeWidth="3"
            strokeDasharray="150.8"
            strokeDashoffset="110"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (id === "partner") {
    return (
      <div className="absolute inset-x-5 bottom-5 flex gap-2">
        <div className="flex-1 rounded-lg border border-white/15 bg-[#C9728A]/60 p-2">
          <div className="mb-1 h-1.5 w-8 rounded-full bg-white/40" />
          <div className="h-1 w-full rounded-full bg-white/20" />
          <div className="mt-1 h-1 w-3/4 rounded-full bg-white/20" />
        </div>
        <div className="flex-1 rounded-lg border border-white/15 bg-[#378ADD]/50 p-2">
          <div className="mb-1 h-1.5 w-8 rounded-full bg-white/40" />
          <div className="h-1 w-full rounded-full bg-white/20" />
          <div className="mt-1 h-1 w-3/4 rounded-full bg-white/20" />
        </div>
      </div>
    );
  }

  if (id === "names") {
    return (
      <div className="absolute right-5 top-5 text-right">
        <p className="text-2xl font-medium text-[#C9728A]" style={{ fontFamily: "var(--font-cairo)" }}>
          رامي
        </p>
        <p className="-mt-1 text-sm text-[#5F5E5A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Rami
        </p>
      </div>
    );
  }

  if (id === "vitals") {
    return (
      <svg className="absolute right-4 top-4" width="48" height="28" viewBox="0 0 48 28">
        <polyline
          points="0,20 10,14 20,18 30,10 40,12 48,4"
          fill="none"
          stroke="#C9728A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

function Card({ card, i }: { card: BentoCard; i: number }) {
  const Icon = iconMap[card.id] ?? Sparkles;
  const s = accentStyle[card.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: "easeOut", delay: (i % 4) * 0.05 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between ring-1",
        sizeClass[card.size],
        s.bg,
        s.ring
      )}
    >
      <BentoVisual id={card.id} accent={card.accent} />
      <Icon className={cn("h-6 w-6", s.icon)} strokeWidth={1.5} />
      <div className="mt-auto">
        <h3
          className={cn("text-xl lg:text-2xl font-medium leading-snug mb-2", s.title)}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {card.title}
        </h3>
        <p className={cn("text-sm leading-relaxed", s.body)}>{card.body}</p>
      </div>
    </motion.div>
  );
}

export function FeaturesBento() {
  const { t, lang } = useLang();
  const cards = t("bento.cards") as BentoCard[];
  const label = t("bento.sectionLabel") as string;
  const body = t("bento.sectionBody") as string;
  const isAr = lang === "ar";

  return (
    <section className="bg-[#FAFAF8] py-24 px-6 lg:px-20">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="text-3xl lg:text-5xl font-medium text-[#2C2C2A] leading-tight mb-3"
          style={{ fontFamily: isAr ? "var(--font-cairo)" : "var(--font-playfair)" }}
        >
          {label}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.28, ease: "easeOut", delay: 0.06 }}
          className="text-[#5F5E5A] text-lg"
        >
          {body}
        </motion.p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[180px]">
        {cards.map((card, i) => (
          <Card key={card.id} card={card} i={i} />
        ))}
      </div>
    </section>
  );
}
