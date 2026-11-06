"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";

/**
 * A silent looping background video (`/home/<name>.webm|.mp4`) over its poster.
 *
 * - The poster is a real <Image> underneath, so it is what paints first (and the LCP
 *   element for the hero, via `priority`); the video covers it once frames arrive.
 * - Sources are attached only after hydration (and, with `lazy`, only when the section
 *   is near the viewport), so the video never competes with the first paint.
 * - `el.muted = true` is set on the element itself: React does not reflect the `muted`
 *   attribute, and browsers block autoplay with sound.
 * - prefers-reduced-motion: the poster only, no video at all.
 */
export function LoopVideo({
  name,
  position,
  priority = false,
  lazy = false,
}: {
  name: string;
  /** object-position, e.g. "center 62%" */
  position: string;
  priority?: boolean;
  lazy?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    if (!lazy) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy]);

  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    el.muted = true;
    el.load(); // pick up the <source>s that were just added
    el.play().catch(() => {}); // Low Power Mode etc. can still refuse; the poster stays
  }, [on]);

  return (
    <div className={s.media} aria-hidden="true">
      <Image
        src={`/home/${name}-poster.jpg`}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        style={{ objectPosition: position }}
      />
      <video ref={ref} muted loop playsInline preload="none" style={{ objectPosition: position }}>
        {on && (
          <>
            <source src={`/home/${name}.webm`} type="video/webm" />
            <source src={`/home/${name}.mp4`} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}
