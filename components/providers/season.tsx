"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SEASONS, seasonFor, type Season } from "@/lib/season";

type SeasonContextType = {
  /** Season being shown; null until mounted, since the page is prerendered. */
  season: Season | null;
  /** Today's real season. */
  actual: Season | null;
  cycle: () => void;
};

const SeasonContext = createContext<SeasonContextType | null>(null);
const STORAGE_KEY = "season-preview";

export default function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [actual, setActual] = useState<Season | null>(null);
  const [preview, setPreview] = useState<Season | null>(null);

  useEffect(() => {
    setActual(seasonFor());
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Season | null;
      if (stored && SEASONS.includes(stored)) setPreview(stored);
    } catch {}
  }, []);

  const cycle = useCallback(() => {
    if (!actual) return;
    const current = preview ?? actual;
    const next = SEASONS[(SEASONS.indexOf(current) + 1) % SEASONS.length];
    const value = next === actual ? null : next;
    setPreview(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [actual, preview]);

  return (
    <SeasonContext.Provider value={{ season: actual ? (preview ?? actual) : null, actual, cycle }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (!context) throw new Error("useSeason must be used within a SeasonProvider");
  return context;
}
