"use client";
import { Marquee } from "@/components/ui/marquee";

const screenshots = [
  "/screenshot-mother.png",
  "/screenshot-father.png",
  "/screenshot-mother.png",
  "/screenshot-father.png",
  "/screenshot-mother.png",
];

export function ScreenshotsMarquee() {
  return (
    <section className="bg-[#1A1625] py-20 overflow-hidden">
      <Marquee pauseOnHover className="gap-6">
        {screenshots.map((src, i) => (
          <div
            key={i}
            className="w-52 h-96 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5"
            style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
          >
            <img
              src={src}
              alt={`Nawah screenshot ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
