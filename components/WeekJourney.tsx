"use client";
import { useLang } from "@/lib/lang-context";
import { StickyScrollReveal } from "@/components/ui/sticky-scroll-reveal";
import BlurIn from "@/components/ui/blur-in";

interface WeekItem {
  week: string;
  headline: string;
  body: string;
  cardLabel: string;
  cardValue: string;
}

function WeekCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="h-full w-full rounded-2xl border border-white/20 p-6 flex flex-col justify-center"
      style={{
        background: "rgba(26,22,37,0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 40px rgba(201,114,138,0.15)",
      }}
    >
      <p className="text-xs mb-2 text-[#C9728A]">{label}</p>
      <p
        className="text-white text-lg font-medium leading-snug"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {value}
      </p>
    </div>
  );
}

export function WeekJourney() {
  const { t } = useLang();
  const sectionLabel = t("journey.sectionLabel") as string;
  const weeks = t("journey.weeks") as WeekItem[];

  const content = weeks.map((w) => ({
    title: `${w.week} — ${w.headline}`,
    description: w.body,
    content: <WeekCard label={w.cardLabel} value={w.cardValue} />,
  }));

  return (
    <section className="bg-[#FAFAF8] py-20 px-6 lg:px-20">
      <BlurIn
        word={sectionLabel}
        className="text-center text-2xl lg:text-3xl font-medium text-[#2C2C2A] mb-12"
      />
      <StickyScrollReveal content={content} contentClassName="bg-[#1A1625]" />
    </section>
  );
}
