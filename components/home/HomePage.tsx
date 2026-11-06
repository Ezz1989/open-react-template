"use client";
import dynamic from "next/dynamic";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Articles, type Chip, type HomeArticle } from "./Articles";
import { Download, HomeFooter } from "./Download";
import s from "./home.module.css";

// Client-only and out of the first bundle: purely decorative, no server HTML.
const BabyFootsteps = dynamic(() => import("../BabyFootsteps"), { ssr: false });

/** Home page A2 (docs/REVAMP_A2_SPEC.md): hero video → one app on two phones → articles → download → footer. */
export function HomePage({ articles }: { articles: Record<Chip, HomeArticle[]> }) {
  return (
    <div className={s.root}>
      <BabyFootsteps />
      <div className={s.content}>
        <Hero />
        <main>
          <Features />
          <Articles groups={articles} />
          <Download />
        </main>
        <HomeFooter />
      </div>
    </div>
  );
}
