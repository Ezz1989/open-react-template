"use client";
import { createContext, useContext, useState, useLayoutEffect, ReactNode } from "react";
import { content } from "./content";

export type Lang = "en" | "ar";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => unknown;
}

const LangContext = createContext<LangContextType | null>(null);

/**
 * Only written when the visitor presses the language switch.
 *
 * New key 2026-11-06: the old "nawah-lang" was written on EVERY visit with the
 * then-default "en", so every past visitor has "en" stored without ever having
 * chosen it — reading it would keep them off the new Arabic-first home page.
 */
const LANG_STORAGE_KEY = "nawah-lang-picked";

function readPickedLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : null;
  } catch {
    return null;
  }
}

/**
 * `defaultLang` comes from the root layout, which also server-renders the same
 * `<html lang dir>` — so the first client render matches the server HTML (no
 * hydration mismatch) and a new visitor never sees the other language flash.
 * A visitor who picked the other language gets it in a layout effect, which
 * re-renders before the browser paints.
 */
export function LangProvider({ children, defaultLang }: { children: ReactNode; defaultLang: Lang }) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useLayoutEffect(() => {
    const picked = readPickedLang();
    if (picked) setLang(picked);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  function toggle() {
    const next: Lang = lang === "en" ? "ar" : "en";
    setLang(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode etc.) — the switch still works,
      // it just won't be remembered on the next visit
    }
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
