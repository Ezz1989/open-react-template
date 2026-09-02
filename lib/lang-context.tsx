"use client";
import { createContext, useContext, useState, useLayoutEffect, ReactNode } from "react";
import { content } from "./content";

type Lang = "en" | "ar";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => unknown;
}

const LangContext = createContext<LangContextType | null>(null);

const LANG_STORAGE_KEY = "nawah-lang";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage synchronously on mount, before first
  // paint — a returning Arabic visitor's <html> never shows en/ltr at all.
  const [lang, setLang] = useState<Lang>(readStoredLang);

  // useLayoutEffect (not useEffect) fires before the browser paints, so a
  // language change never flashes the previous dir/lang for one frame —
  // useEffect ran after paint, which is what caused the flash.
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // storage unavailable (private mode etc.) — language still works,
      // it just won't be remembered on the next visit
    }
  }, [lang]);

  function toggle() {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }

  function t(key: string): unknown {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = content[lang];
    for (const k of keys) val = val?.[k];
    return val ?? key;
  }

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be inside LangProvider");
  return ctx;
}
