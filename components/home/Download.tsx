"use client";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { LoopVideo } from "./LoopVideo";
import { StoreButtons } from "./StoreButtons";
import { ICONS, type SocialIcon } from "../Footer";
import s from "./home.module.css";

/** Pregnancy at the top of the page, the baby at the bottom: the newborn-feet video behind the last call to download. */
export function Download() {
  const { t } = useLang();
  const d = (k: string) => t(`home.downloadSection.${k}`) as string;

  return (
    <section id="download" aria-labelledby="download-h" className={`${s.dl} ${s.onDark}`}>
      <LoopVideo name="feet-full" position="center 55%" lazy />
      <div className={s.dlScrim} aria-hidden="true" />
      <h2 id="download-h" className={s.dlHeading}>
        {d("heading")}
      </h2>
      <div className={s.dlRow}>
        <p className={s.tagline}>
          {d("taglineA")}
          <br />
          <span>{d("taglineB")}</span>
        </p>
        <div className={s.dlCtas}>
          <a href="/go/home_download" rel="nofollow" className={s.pill}>
            {t("home.download") as string}
          </a>
          <StoreButtons where="download" />
          {/* nawahapp.net/qr → store by device, counted as `qr_scan` (app/go/[platform]/route.ts). */}
          <div className={s.qr}>
            <Image src="/home/qr.svg" alt={d("qr")} width={116} height={116} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lockup · privacy · terms · support · Instagram/TikTok/Facebook (support + socials back by owner 2026-11-06). */
export function HomeFooter() {
  const { t } = useLang();
  // Support label + social links come from the site-wide footer list, so they stay in one place.
  const links = t("footer.links") as { label: string; href: string; icon?: SocialIcon }[];
  const support = links.find((l) => l.href === "/support");
  return (
    <footer className={s.footer}>
      <Image src="/home/lockup-light.svg" alt={t("home.nav.logo") as string} width={1954} height={965} />
      <div className={s.footerLinks}>
        <a href="/privacy">{t("home.footer.privacy") as string}</a>
        <a href="/terms">{t("home.footer.terms") as string}</a>
        {support && <a href={support.href}>{support.label}</a>}
        {links
          .filter((l) => l.icon)
          .map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-label={l.label}
              title={l.label}
              className={s.social}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ICONS[l.icon!]}
            </a>
          ))}
      </div>
    </footer>
  );
}
