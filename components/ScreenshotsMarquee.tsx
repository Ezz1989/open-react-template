"use client";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { useLang } from "@/lib/lang-context";

const rowA = [
  { src: "/screenshots/mother-home.jpg", alt: "Mother home" },
  { src: "/screenshots/nawal-ai.jpg", alt: "Nawal AI companion" },
  { src: "/screenshots/baby-names.jpg", alt: "Bilingual baby names" },
  { src: "/screenshots/appointments.jpg", alt: "Appointments timeline" },
  { src: "/screenshots/vitals.jpg", alt: "Vitals and nutrition" },
  { src: "/screenshots/mood.jpg", alt: "Mood check-in" },
];

const rowB = [
  { src: "/screenshots/father-home.jpg", alt: "Father home" },
  { src: "/screenshots/hospital-bag.jpg", alt: "Hospital bag checklist" },
  { src: "/screenshots/baby-budget.jpg", alt: "Baby budget" },
  { src: "/screenshots/contractions.jpg", alt: "Contraction timer" },
  { src: "/screenshots/kick-counter.jpg", alt: "Kick counter" },
  { src: "/screenshots/journal.jpg", alt: "Shared journal" },
];

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="flex-shrink-0 w-52 h-[380px] rounded-[28px] overflow-hidden border border-white/10 bg-[#0F0B18] relative"
      style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,114,138,0.12)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="208px"
        className="object-cover object-top"
      />
    </div>
  );
}

export function ScreenshotsMarquee() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const heading = isAr ? "\u062f\u0627\u062e\u0644 \u0627\u0644\u062a\u0637\u0628\u064a\u0642" : "Inside the app";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <div className="relative overflow-hidden">
      <p
        className="text-center text-xs uppercase tracking-[0.3em] text-white/50 mb-8 px-6"
        style={{ fontFamily: displayFont }}
      >
        {heading}
      </p>

      <div className="flex flex-col gap-4">
        <Marquee pauseOnHover className="[--duration:50s] [--gap:1.25rem]">
          {rowA.map((s, i) => (
            <Phone key={i} {...s} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:55s] [--gap:1.25rem]">
          {rowB.map((s, i) => (
            <Phone key={i} {...s} />
          ))}
        </Marquee>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, #1A1625, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, #1A1625, transparent)" }}
      />
    </div>
  );
}
