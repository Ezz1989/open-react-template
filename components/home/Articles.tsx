"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import { ForwardArrow } from "./icons";
import s from "./home.module.css";

export const CHIPS = ["all", "food", "mother", "father", "cost"] as const;
export type Chip = (typeof CHIPS)[number];

/** One article row, already trimmed on the server (see app/(home)/page.tsx). */
export interface HomeArticle {
  path: string; // "articles/<cluster>/<slug>", prefixed with /ar or /en here
  img: string;
  width: number;
  height: number;
  cat: { ar: string; en: string };
  title: { ar: string; en: string };
}

/** The articles index: heading, «كل المقالات», filter chips, five linked rows. */
export function Articles({ groups }: { groups: Record<Chip, HomeArticle[]> }) {
  const { t, lang } = useLang();
  const [chip, setChip] = useState<Chip>("all");
  const a = (k: string) => t(`home.articles.${k}`) as string;

  return (
    <section id="articles" aria-labelledby="articles-h" className={s.articles}>
      <div className={s.articlesHead}>
        <h2 id="articles-h" className={s.h2}>
          {a("heading")}
        </h2>
        <Link href={`/${lang}/articles`} className={s.allLink}>
          {a("all")}
          <ForwardArrow />
        </Link>
      </div>

      <div className={s.chips} role="group" aria-label={a("heading")}>
        {CHIPS.map((c) => (
          <button key={c} type="button" className={s.chip} aria-pressed={chip === c} onClick={() => setChip(c)}>
            {a(`chips.${c}`)}
          </button>
        ))}
      </div>

      <div className={s.rows}>
        {groups[chip].map((art) => (
          <Link key={art.path} href={`/${lang}/${art.path}`} className={s.row}>
            <Image
              src={art.img}
              alt=""
              width={art.width}
              height={art.height}
              sizes="(max-width: 700px) 104px, 200px"
              className={s.rowImg}
            />
            <span className={s.rowText}>
              <span className={s.rowCat}>{art.cat[lang]}</span>
              <span className={s.rowTitle}>{art.title[lang]}</span>
            </span>
            <span className={s.rowArrow}>
              <ForwardArrow size={32} width={1.6} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
