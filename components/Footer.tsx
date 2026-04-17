"use client";
import { useLang } from "@/lib/lang-context";

export function Footer() {
  const { t, lang } = useLang();
  const wordmark = lang === "ar" ? "نواة" : "Nawah";
  const font = lang === "ar" ? "var(--font-cairo)" : "var(--font-playfair)";

  return (
    <footer className="bg-[#1A1625] border-t border-white/5 py-10 px-6">
      <div className="flex flex-col items-center gap-4 text-center text-sm text-white/40">
        <span className="text-white/90 text-2xl" style={{ fontFamily: font }}>
          {wordmark}
        </span>
        <p>{t("footer.copy") as string}</p>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-white/80 transition">
            {t("footer.privacy") as string}
          </a>
          <span aria-hidden>·</span>
          <a
            href="https://instagram.com/nawahapp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80 transition"
          >
            {t("footer.instagram") as string}
          </a>
        </div>
      </div>
    </footer>
  );
}
