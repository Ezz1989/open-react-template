"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Mode = "mother" | "father";
interface Ctx { mode: Mode; setMode: (m: Mode) => void; }

const ModeContext = createContext<Ctx | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("mother");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("nawah-mode")) as Mode | null;
    if (stored === "mother" || stored === "father") setMode(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    localStorage.setItem("nawah-mode", mode);
  }, [mode]);

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be inside ModeProvider");
  return ctx;
}
