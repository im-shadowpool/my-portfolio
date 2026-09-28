import { useActiveSectionActions } from "@/context/active-section-context";
import { useCallback, useEffect, useRef } from "react";
import type { SectionName } from "./types";

/**
 * Reports a section to the header when it scrolls into view. It watches with
 * a plain IntersectionObserver rather than React state, so the section itself
 * never re-renders as the visitor scrolls.
 */
export function useSectionInView(sectionName: SectionName, threshold = 0.75) {
  const { setActiveSection, lastClick } = useActiveSectionActions();
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node?: Element | null) => {
      observer.current?.disconnect();
      if (!node) return;
      observer.current = new IntersectionObserver(
        ([entry]) => {
          // Right after a nav click the page scrolls past other sections; ignore those.
          if (entry.isIntersecting && Date.now() - lastClick.current > 1000) setActiveSection(sectionName);
        },
        { threshold },
      );
      observer.current.observe(node);
    },
    [sectionName, threshold, setActiveSection, lastClick],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  return { ref };
}
