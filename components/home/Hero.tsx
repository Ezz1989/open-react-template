"use client";
import { useLang } from "@/lib/lang-context";
import { Navbar } from "../Navbar";
import { LoopVideo } from "./LoopVideo";
import { DownArrow } from "./icons";
import s from "./home.module.css";

/** The whole first screen is the bump video, behind the nav too; the giant line sits diagonally at the bottom. */
export function Hero() {
  const { t } = useLang();
  const h = (k: string) => t(`home.hero.${k}`) as string;

  return (
    <div className={`${s.hero} ${s.onDark}`}>
      <LoopVideo name="hero-full" position="center 62%" priority />
      <div className={s.heroScrim} aria-hidden="true" />
      <Navbar />
      <header className={s.heroBody}>
        <h1 className={s.giant} aria-label={`${h("giantA")} ${h("giantB")}`}>
          <span aria-hidden="true">{h("giantA")}</span>
          <span aria-hidden="true" className={s.giantB}>
            {h("giantB")}
          </span>
        </h1>
        <div className={s.heroRow}>
          <div className={s.heroText}>
            <p className={s.motto}>{h("motto")}</p>
            <p className={s.intro}>
              {h("intro")} {h("langs")}
            </p>
          </div>
          <div className={s.heroCtas}>
            <a href="/go/home_hero" rel="nofollow" className={s.pill}>
              {t("home.download") as string}
            </a>
            <a href="#what" className={s.heroLink}>
              {h("link")}
              <DownArrow />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
