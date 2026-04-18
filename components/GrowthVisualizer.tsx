"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";

const WEEK_IMAGES: Record<number, string> = {
  4: "/week-04.png",
  8: "/week-08.png",
  12: "/week-12.png",
  16: "/week-16.png",
  20: "/week-20.png",
  24: "/week-24.png",
  28: "/week-28.png",
  32: "/week-32.png",
  36: "/week-36.png",
  40: "/week-40.png",
};

interface WeekInfo {
  fruit: string;
  size: string;
  trimester: string;
  note: string;
}

export function GrowthVisualizer({ week, weekVal }: { week: number; weekVal: number }) {
  const { t } = useLang();
  const info = t(`weeks.${week}`) as WeekInfo;
  const [imgSrc, setImgSrc] = useState<string>(WEEK_IMAGES[week]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(true);
    const timer = setTimeout(() => {
      setImgSrc(WEEK_IMAGES[week]);
      setFading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [week]);

  const trimesterRaw = info.trimester;
  const trimesterNum = /^T\d$/.test(trimesterRaw) ? trimesterRaw.slice(1) : trimesterRaw;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        background: "var(--bg-inv)",
        aspectRatio: "1 / 1.05",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `url(${imgSrc}) center/cover no-repeat`,
          opacity: fading ? 0.4 : 1,
          transition: "opacity 0.4s ease, transform 1.2s cubic-bezier(0.22,1,0.36,1)",
          transform: `scale(${1 + (week - 4) * 0.003})`,
          filter: "saturate(1.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,5,8,0.35) 0%, rgba(10,5,8,0) 30%, rgba(10,5,8,0) 60%, rgba(10,5,8,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 22,
          left: 22,
          color: "#fff",
          display: "flex",
          alignItems: "baseline",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 72,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}
        >
          {weekVal}
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          {t("hero.weekLabel") as string}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 22,
          right: 22,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          borderRadius: 999,
          color: "#fff",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {trimesterNum}
      </div>

      <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontStyle: "italic" }}>
            {info.fruit}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, fontFamily: "monospace" }}>~{info.size}</div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, maxWidth: 420 }}>{info.note}</div>
      </div>
    </div>
  );
}
