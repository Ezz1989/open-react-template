"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { DownloadIcon } from "./home/icons";
import s from "./home/home.module.css";

/**
 * Home-page navigation (A2, 2026-11-06), drawn over the hero video: white lockup, links in
 * old lace with «المقالات» in saffron, the language switch, and the saffron download pill.
 * On phones the links become a scrolling second row and the pill hides — the hero's own
 * pill is on the same first screen.
 */
export function Navbar() {
  const { t, lang, toggle } = useLang();
  const n = (k: string) => t(`home.nav.${k}`) as string;
  const other = lang === "ar" ? "en" : "ar";

  return (
    <nav aria-label={n("aria")} className={s.nav}>
      <Link href="/" aria-label={n("home")} className={s.navLogo}>
        <Image src="/home/lockup-white.svg" alt={n("logo")} width={1954} height={965} priority />
      </Link>

      <div className={s.navLinks}>
        <a href="#what">{n("what")}</a>
        <a href="#articles" className={s.navAccent}>
          {n("articles")}
        </a>
        <Link href={`/${lang}/guide`}>{n("guide")}</Link>
        <Link href={`/${lang}/father`}>{n("father")}</Link>
        <Link href={`/${lang}/tools`}>{n("tools")}</Link>
        <Link href={`/${lang}/names`}>{n("names")}</Link>
      </div>

      <div className={s.navEnd}>
        <button type="button" onClick={toggle} className={s.langBtn} lang={other} aria-label={n("switchLabel")}>
          {n("switchTo")}
        </button>
        <a href="/go/home_nav" rel="nofollow" className={`${s.pill} ${s.navPill}`}>
          {t("home.download") as string}
          <DownloadIcon />
        </a>
      </div>
    </nav>
  );
}
