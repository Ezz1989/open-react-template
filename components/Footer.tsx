"use client";
import { useLang } from "@/lib/lang-context";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-[#1A1625] border-t border-white/5 py-8 px-6">
      <div className="flex flex-col items-center gap-4 text-center text-sm text-[#888780]">
        <span className="text-white text-xl" style={{ fontFamily: "var(--font-playfair)" }}>نواة</span>
        <p>{t("footer.copy") as string}</p>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-white transition">{t("footer.privacy") as string}</a>
          <span>·</span>
          <a
            href="https://instagram.com/nawahapp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            {t("footer.instagram") as string}
          </a>
        </div>
      </div>
    </footer>
  );
}
