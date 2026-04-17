"use client";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { useLang } from "@/lib/lang-context";

const screenshots = [
  { src: "/screenshots/mother-home.jpg", alt: "Mother dashboard — week 11" },
  { src: "/screenshots/father-home.jpg", alt: "Father dashboard — week 11" },
  { src: "/screenshots/baby-names.jpg", alt: "Baby names — bilingual" },
  { src: "/screenshots/nawal-ai.jpg", alt: "Nawal — AI pregnancy companion" },
  { src: "/screenshots/baby-budget.jpg", alt: "Baby budget — regional currency" },
];

export function ScreenshotsMarquee() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const heading = isAr ? "داخل التطبيق" : "Inside the app";
  const displayFont = isAr ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <section className="bg-[#1A1625] py-20 overflow-hidden">
      <h2
        className="text-center text-2xl lg:text-3xl font-medium text-white/90 mb-12 px-6"
        style={{ fontFamily: displayFont }}
      >
        {heading}
      </h2>
      <Marquee pauseOnHover className="[--gap:1.5rem]">
        {screenshots.map((s, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-56 h-[380px] rounded-[28px] overflow-hidden border border-white/10 bg-[#0F0B18] relative"
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,114,138,0.12)" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="224px"
              className="object-cover object-top"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
