"use client";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";

export function Navbar() {
  const { lang, toggle, t } = useLang();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 60));
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: scrolled ? "rgba(26,22,37,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background-color 0.28s ease-out, backdrop-filter 0.28s ease-out",
      }}
    >
      <Image
        src="/logo.png"
        alt="Nawah"
        width={100}
        height={32}
        className="h-8 w-auto object-contain"
      />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 transition hover:border-white/50 hover:text-white"
        >
          {lang === "en" ? "عربي" : "EN"}
        </button>
        <a
          href="#cta"
          className="rounded-full border border-[#C9728A] px-4 py-1.5 text-sm text-[#C9728A] transition hover:bg-[#C9728A] hover:text-white"
        >
          {t("nav.download") as string}
        </a>
      </div>
    </motion.nav>
  );
}
