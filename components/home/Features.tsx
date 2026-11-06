"use client";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useLang } from "@/lib/lang-context";
import { StoreButtons } from "./StoreButtons";
import { HandoffArrow } from "./icons";
import s from "./home.module.css";

interface Tile {
  title: string;
  text: string;
  alt: string;
}
interface MoreGroup {
  label: string;
  items: string[];
}

/** A real 1.0.8 screen (Arabic or English, following the page) in a phone frame cropped by the tile's bottom. */
function Phone({ screen, alt, style }: { screen: string; alt: string; style?: CSSProperties }) {
  const { lang } = useLang();
  return (
    <div className={s.phone} style={style}>
      <Image src={`/home/screens/${lang}_${screen}.png`} alt={alt} width={1080} height={2400} sizes="240px" />
    </div>
  );
}

const GROUP_TONE = [s.both, s.her, s.his];

/** «تطبيقٌ واحد على هاتفين»: one tile per shared feature, then the rest of the app as a list. */
export function Features() {
  const { t } = useLang();
  const f = (k: string) => t(`home.features.${k}`);
  const tile = (k: string) => f(k) as Tile;
  const week = tile("week");
  const names = tile("names");
  const nawal = tile("nawal");
  const kicks = f("kicks") as Tile & { her: string; him: string; altHer: string; altHim: string };
  const nudges = tile("nudges");
  const bag = tile("bag");
  const more = f("more") as { heading: string; groups: MoreGroup[] };

  return (
    <section id="what" aria-labelledby="what-h" className={s.section}>
      <div className={s.sectionHead}>
        <h2 id="what-h" className={s.h2}>
          {f("heading") as string}
        </h2>
        <p className={s.sub}>{f("sub") as string}</p>
      </div>

      <div className={s.bento}>
        <div className={`${s.tile} ${s.tileBig} ${s.tileWeek} ${s.rose}`}>
          <div className={s.tileWeekText}>
            <h3 className={s.tileTitle}>{week.title}</h3>
            <p className={s.tileText}>{week.text}</p>
          </div>
          <Phone screen="her_home" alt={week.alt} style={{ width: 236, height: 440 }} />
        </div>

        <div className={`${s.tile} ${s.green}`}>
          <h3 className={s.tileTitle}>{names.title}</h3>
          <p className={s.tileText}>{names.text}</p>
          <Phone screen="him_names" alt={names.alt} style={{ width: 220, height: 300 }} />
        </div>

        <div className={`${s.tile} ${s.white}`}>
          <h3 className={s.tileTitle}>{nawal.title}</h3>
          <p className={s.tileText}>{nawal.text}</p>
          <Phone screen="her_nawal" alt={nawal.alt} style={{ width: 220, height: 320 }} />
        </div>

        <div className={`${s.tile} ${s.tileBig} ${s.mint}`}>
          <h3 className={s.tileTitle}>{kicks.title}</h3>
          <p className={s.tileText}>{kicks.text}</p>
          <div className={s.kicksPair}>
            <div className={s.kicksCol}>
              <span className={s.kicksLabel}>{kicks.her}</span>
              <Phone screen="her_kicks" alt={kicks.altHer} />
            </div>
            <HandoffArrow className={s.kicksArrow} />
            <div className={s.kicksCol}>
              <span className={s.kicksLabel}>{kicks.him}</span>
              <Phone screen="him_kickalerts" alt={kicks.altHim} />
            </div>
          </div>
        </div>

        <div className={`${s.tile} ${s.tileSmall} ${s.white}`}>
          <h3 className={s.tileTitle}>{nudges.title}</h3>
          <p className={s.tileText}>{nudges.text}</p>
          <Phone screen="him_nudges" alt={nudges.alt} style={{ width: 210, height: 280 }} />
        </div>

        <div className={`${s.tile} ${s.tileSmall} ${s.rose}`}>
          <h3 className={s.tileTitle}>{bag.title}</h3>
          <p className={s.tileText}>{bag.text}</p>
          <Phone screen="him_bag" alt={bag.alt} style={{ width: 210, height: 280 }} />
        </div>

        <div className={`${s.tile} ${s.tileDl} ${s.onDark}`}>
          <div className={s.tileDlInner}>
            <p className={s.tileDlTitle}>{t("home.download") as string}</p>
            <div className={s.tileStores}>
              <StoreButtons where="tile" />
            </div>
          </div>
        </div>
      </div>

      <div className={s.more}>
        <h3 className={s.moreHeading}>{more.heading}</h3>
        <div className={s.moreGroups}>
          {more.groups.map((g, i) => (
            <div key={g.label} className={`${s.moreGroup} ${GROUP_TONE[i]}`}>
              <p className={s.moreLabel}>{g.label}</p>
              <ul className={s.moreList}>
                {g.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" className={s.dot} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
