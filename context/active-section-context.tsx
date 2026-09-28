"use client";

import type { SectionName } from "@/lib/types";
import React, { createContext, useContext, useMemo, useRef, useState } from "react";

/*
  Which section is on screen, for the header's underline. It's split in two:
  the current section (read only by the header) and the functions to report
  it (used by every section). The functions never change, so sections don't
  re-render every time the active section moves; only the header does.
*/

type Actions = {
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  /** When a nav link was last clicked; sections hold off reporting for a moment after. */
  lastClick: React.MutableRefObject<number>;
};

const ActiveSectionValue = createContext<SectionName | null>(null);
const ActiveSectionActions = createContext<Actions | null>(null);

export default function ActiveSectionContextProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const lastClick = useRef(0);
  const actions = useMemo(() => ({ setActiveSection, lastClick }), []);

  return (
    <ActiveSectionActions.Provider value={actions}>
      <ActiveSectionValue.Provider value={activeSection}>{children}</ActiveSectionValue.Provider>
    </ActiveSectionActions.Provider>
  );
}

/** For sections reporting themselves: stable, so it causes no re-renders. */
export function useActiveSectionActions() {
  const actions = useContext(ActiveSectionActions);
  if (!actions) throw new Error("useActiveSectionActions must be used within an ActiveSectionContextProvider");
  return actions;
}

/** For the header: the current section, plus a way to set it from a nav click. */
export function useActiveSectionContext() {
  const activeSection = useContext(ActiveSectionValue);
  const { setActiveSection, lastClick } = useActiveSectionActions();
  if (activeSection === null) throw new Error("useActiveSectionContext must be used within an ActiveSectionContextProvider");
  return {
    activeSection,
    setActiveSection,
    setTimeOfLastClick: (time: number) => {
      lastClick.current = time;
    },
  };
}
