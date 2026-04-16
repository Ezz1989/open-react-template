"use client";
import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  const beams = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9728A" stopOpacity="0" />
            <stop offset="50%" stopColor="#C9728A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
          </linearGradient>
        </defs>
        {beams.map((i) => (
          <line
            key={i}
            x1={`${10 + i * 12}%`}
            y1="0%"
            x2={`${i * 15}%`}
            y2="100%"
            stroke="url(#beam-gradient)"
            strokeWidth="1"
            opacity="0.4"
            style={{
              animation: `beam-move ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
