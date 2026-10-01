"use client";

import clsx from "clsx";
import { m, type Variants } from "framer-motion";
import Glyph from "./glyph";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAINT = [0.65, 0, 0.35, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -6% 0px" } as const;

/**
 * Section break: one seigaiha wave (three nested arcs) resting in open space.
 * The arcs are drawn outermost first as it scrolls into view.
 */
export function WaveBreak({ className }: { className?: string }) {
  const arcs = ["M2 16 A14 14 0 0 1 30 16", "M7 16 A9 9 0 0 1 25 16", "M12 16 A4 4 0 0 1 20 16"];
  return (
    <div className={clsx("flex justify-center py-7", className)} aria-hidden="true">
      <m.svg
        viewBox="0 0 32 17"
        className="h-[17px] w-8 text-ink/30"
        initial="hidden"
        whileInView="shown"
        viewport={IN_VIEW}
      >
        {arcs.map((d, i) => (
          <m.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              shown: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: PAINT, delay: i * 0.08 } },
            }}
          />
        ))}
      </m.svg>
    </div>
  );
}

/**
 * Children of a panel can use these variants to join its reveal.
 */
export const panelItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/**
 * A section of the page. When it scrolls into view the title, its letter mark
 * and the content fade up together in one quick reveal.
 */
export default function Panel({
  id,
  title,
  glyph,
  meta,
  children,
  className,
  sectionRef,
}: {
  id: string;
  title: string;
  /** A single letter for the section's abstract mark. */
  glyph: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sectionRef?: (node?: Element | null) => void;
}) {
  return (
    <section id={id} ref={sectionRef} className="scroll-mt-16" aria-labelledby={`${id}-title`}>
      <m.div initial="hidden" whileInView="shown" viewport={IN_VIEW}>
        <div className="glyph-host flex items-end gap-3 px-4 pb-2 pt-6">
          <m.h2
            id={`${id}-title`}
            className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-shu"
            variants={{
              hidden: { opacity: 0, y: 8 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
            }}
          >
            {title}
          </m.h2>
          <m.span
            className="pb-1.5 text-ink-faint"
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: 8 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.05 } },
            }}
          >
            <Glyph id={id} letter={glyph} />
          </m.span>
          {meta && (
            <m.span
              className="label ml-auto pb-1.5"
              variants={{
                hidden: { opacity: 0 },
                shown: { opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
              }}
            >
              {meta}
            </m.span>
          )}
        </div>

        <m.div
          className={clsx("px-4 pb-5 pt-3", className)}
          variants={{
            hidden: { opacity: 0, y: 12 },
            shown: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.45,
                ease: EASE,
                delay: 0.05,
                delayChildren: 0.1,
                staggerChildren: 0.04,
              },
            },
          }}
        >
          {children}
        </m.div>
      </m.div>
    </section>
  );
}
