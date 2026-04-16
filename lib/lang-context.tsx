"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { content } from "./content";

type Lang = "en" | "ar";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => unknown;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
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
