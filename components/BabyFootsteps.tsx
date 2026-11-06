"use client";
import { useEffect, useState } from "react";
import s from "./home/home.module.css";

/**
 * Tiny baby footprints that walk the page background (A2, logic ported from the
 * <script> in docs/revamp/A2.dc.html).
 *
 * Desktop: the walker keeps 10–15 cm from the cursor; when the cursor has been still
 * for 5 s it walks up to it, rests 2.5 s, then comes back in from a random edge.
 * Touch: it walks to the last tap after 5 s. Prints fade over 3.2 s, at most 16 at once.
 *
 * The layer is fixed behind the page content (z-index 0 vs 1), so prints only show on
 * the lace background, never over the videos, tiles or photos. Loaded client-only.
 */

interface Print {
  id: number;
  x: number;
  y: number;
  rot: number;
  flip: number;
}
type Pt = { x: number; y: number };

const STEP_MS = 320;
const LIFE_MS = 3200; // must match the printFade animation in home.module.css
const MAX_PRINTS = 16;
const STRIDE = 30;
// CSS px per cm at the 96-dpi reference. Real screens differ; this is the calibration knob
// for the "10–15 cm from the cursor" feel.
const CM = 37.8;
const NEAR = 10 * CM;
const FAR = 15 * CM;
const MID = 12.5 * CM;
const IDLE_MS = 5000;
const REST_MS = 2500;

export default function BabyFootsteps() {
  const [prints, setPrints] = useState<(Print & { born: number })[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const touchMode = window.matchMedia("(pointer: coarse)").matches;

    let pointer: Pt | null = null;
    let lastMove = 0;
    let pos: Pt | null = null;
    let side = 1;
    let nextId = 1;
    let restUntil = 0;
    let live: (Print & { born: number })[] = [];

    const spawn = (): Pt => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const r = Math.random();
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          return { x: r * W, y: -40 };
        case 1:
          return { x: W + 40, y: r * H };
        case 2:
          return { x: r * W, y: H + 40 };
        default:
          return { x: -40, y: r * H };
      }
    };

    const step = () => {
      if (document.hidden) return;
      const now = Date.now();
      const before = live.length;
      live = live.filter((p) => now - p.born < LIFE_MS);
      let target: Pt | null = null;

      if (pointer && now > restUntil) {
        if (!pos) pos = spawn();
        const dx = pos.x - pointer.x;
        const dy = pos.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        if (now - lastMove >= IDLE_MS) {
          if (d < 26) {
            // arrived: rest, then come back in from an edge
            restUntil = now + REST_MS;
            pos = null;
            lastMove = now;
          } else target = pointer;
        } else if (!touchMode && (d < NEAR || d > FAR)) {
          target = { x: pointer.x + (dx / d) * MID, y: pointer.y + (dy / d) * MID };
        }
      }

      if (target && pos) {
        const tx = target.x - pos.x;
        const ty = target.y - pos.y;
        const td = Math.hypot(tx, ty);
        if (td > 6) {
          const ux = tx / td;
          const uy = ty / td;
          const stride = Math.min(STRIDE, td);
          pos = { x: pos.x + ux * stride, y: pos.y + uy * stride };
          side = -side; // alternate left/right foot, offset sideways from the path
          live = [
            ...live,
            {
              id: nextId++,
              x: pos.x - uy * 8 * side,
              y: pos.y + ux * 8 * side,
              rot: (Math.atan2(uy, ux) * 180) / Math.PI + 90,
              flip: side,
              born: now,
            },
          ].slice(-MAX_PRINTS);
        }
      }

      if (live.length || before) setPrints(live);
    };

    const onMouse = (e: MouseEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      lastMove = Date.now();
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer = { x: t.clientX, y: t.clientY };
      lastMove = Date.now();
    };

    const timer = window.setInterval(step, STEP_MS);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return (
    <div className={s.prints} aria-hidden="true">
      {prints.map((p) => (
        <span
          key={p.id}
          className={s.print}
          style={{
            transform: `translate(${(p.x - 9).toFixed(1)}px, ${(p.y - 15).toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg) scaleX(${p.flip})`,
          }}
        >
          <svg width="18" height="30" viewBox="0 0 18 30">
            <path
              d="M9.6 29.2c-3.9 0-6.1-3.1-6.1-8.1 0-3.9 1-7 2.2-9.6 1-2.1 2.3-3.1 4.1-3.1 2 0 3.6 1.9 4.2 4.9.6 3 .4 6.2-.2 9.3-.7 3.9-1.9 6.6-4.2 6.6z"
              fill="currentColor"
            />
            <circle cx="12.4" cy="4.6" r="2.3" fill="currentColor" />
            <circle cx="8.6" cy="2.9" r="1.5" fill="currentColor" />
            <circle cx="5.6" cy="3.7" r="1.3" fill="currentColor" />
            <circle cx="3.4" cy="5.4" r="1.1" fill="currentColor" />
            <circle cx="2" cy="7.7" r="0.95" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}
