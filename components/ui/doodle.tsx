"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

/*
  A handwritten note in the page margin, with a little hand-drawn arrow
  pointing at the thing it describes, like notes scribbled beside a sketch.
  Margins only exist on wide screens, so doodles only appear there.
*/

const PAINT = [0.65, 0, 0.35, 1] as const;

// Arrows drawn pointing right (towards the content on a left-side doodle);
// right-side doodles mirror them.
const ARROWS = {
  // Curls down and in, e.g. from a note above the target
  down: { body: "M4 3 C 7 17, 19 27, 38 29", head: "M31 23.5 L38 29 L30.5 33" },
  // Curls up and in, e.g. from a note below the target
  up: { body: "M4 31 C 7 17, 19 7, 38 5", head: "M30.5 1 L38 5 L31 10.5" },
  // Straight-ish, across
  side: { body: "M3 18 C 14 11, 26 11, 40 16", head: "M33 10.5 L40 16 L32.5 20" },
};

export default function Doodle({
  side,
  arrow = "side",
  className,
  children,
}: {
  /** Which margin the note sits in. */
  side: "left" | "right";
  arrow?: keyof typeof ARROWS;
  /** Vertical placement, e.g. "top-10". */
  className?: string;
  children: React.ReactNode;
}) {
  const path = ARROWS[arrow];
  const left = side === "left";
  const svg = (
    <svg
      viewBox="0 0 44 34"
      className="h-[34px] w-[44px] shrink-0 overflow-visible"
      style={{ transform: left ? undefined : "scaleX(-1)" }}
    >
      {[path.body, path.head].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: i ? 0.25 : 0.7, delay: 0.35 + i * 0.65, ease: PAINT } },
          }}
        />
      ))}
    </svg>
  );

  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className={clsx(
        "pointer-events-none absolute z-10 hidden w-40 select-none font-hand text-[1.15rem] leading-[1.1] text-ink-faint min-[1100px]:flex",
        left ? "right-full mr-3 items-end text-right" : "left-full ml-3 items-start text-left",
        arrow === "side" ? (left ? "flex-row items-center" : "flex-row-reverse items-center") : "flex-col",
        className,
      )}
    >
      {arrow === "up" && svg}
      <motion.span
        className={clsx("block", left ? "-rotate-3" : "rotate-3")}
        variants={{ hidden: { opacity: 0, y: 4 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      >
        {children}
      </motion.span>
      {arrow !== "up" && svg}
    </motion.div>
  );
}
