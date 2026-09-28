"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

/** Cycles through a list of phrases, each rolling up out of a blur. */
export default function FlipText({ items, interval = 2800 }: { items: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom" aria-live="off">
      <span className="sr-only">{items.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={items[index]}
          initial={{ y: "80%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-80%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {items[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
