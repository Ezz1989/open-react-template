"use client";
import { useLang } from "@/lib/lang-context";
import { appStoreUrl, homePlayUrl } from "@/lib/constants";
import s from "./home.module.css";

/**
 * App Store + Google Play, each straight to its store with the home campaign tags
 * (`where` names the button in Play Console / App Store Connect). New tab, so a desktop
 * visitor keeps the page with the QR code.
 */
export function StoreButtons({ where }: { where: string }) {
  const { t } = useLang();
  const d = (k: string) => t(`home.downloadSection.${k}`) as string;
  return (
    <>
      <a href={appStoreUrl(`web_${where}`)} className={s.store} target="_blank" rel="noopener noreferrer">
        <span className={s.storeSmall}>{d("appStoreSmall")}</span>
        <span className={s.storeBig}>{d("appStore")}</span>
      </a>
      <a href={homePlayUrl(where)} className={s.store} target="_blank" rel="noopener noreferrer">
        <span className={s.storeSmall}>{d("playSmall")}</span>
        <span className={s.storeBig}>{d("play")}</span>
      </a>
    </>
  );
}
