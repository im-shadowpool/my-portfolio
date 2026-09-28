"use client";

import clsx from "clsx";
import { m, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAINT = [0.65, 0, 0.35, 1] as const;
const IN_VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

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
              shown: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: PAINT, delay: i * 0.18 } },
            }}
          />
        ))}
      </m.svg>
    </div>
  );
}

// A soft-edged wash slid across the title so it appears painted in.
const WASH = "linear-gradient(90deg, #000 0%, #000 42%, transparent 58%, transparent 100%)";

/**
 * Children of a panel can use these variants to join its reveal: they start
 * once the title has been painted in.
 */
export const panelItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * A section of the page. When it scrolls into view the title is painted in
 * first, the Japanese word follows, and only then does the content rise in.
 */
export default function Panel({
  id,
  title,
  kanji,
  meta,
  children,
  className,
  sectionRef,
}: {
  id: string;
  title: string;
  kanji: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sectionRef?: (node?: Element | null) => void;
}) {
  const titleDuration = 0.8 + title.length * 0.04;

  return (
    <section id={id} ref={sectionRef} className="scroll-mt-16" aria-labelledby={`${id}-title`}>
      <m.div initial="hidden" whileInView="shown" viewport={IN_VIEW}>
        <div className="flex items-end gap-3 px-4 pb-2 pt-6">
          <m.h2
            id={`${id}-title`}
            className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-shu"
            style={{
              maskImage: WASH,
              WebkitMaskImage: WASH,
              maskSize: "260% 100%",
              WebkitMaskSize: "260% 100%",
              maskPosition: "var(--wash) 0%",
              WebkitMaskPosition: "var(--wash) 0%",
            }}
            variants={{
              hidden: { "--wash": "100%", filter: "blur(2px)" },
              shown: { "--wash": "0%", filter: "blur(0px)", transition: { duration: titleDuration, ease: PAINT } },
            }}
          >
            {title}
          </m.h2>
          <m.span
            className="pb-1 font-display text-[0.95rem] text-ink-faint"
            lang="ja"
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: -4, filter: "blur(3px)" },
              shown: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, delay: titleDuration * 0.55 },
              },
            }}
          >
            {kanji}
          </m.span>
          {meta && (
            <m.span
              className="label ml-auto pb-1.5"
              variants={{
                hidden: { opacity: 0 },
                shown: { opacity: 1, transition: { duration: 0.5, delay: titleDuration * 0.55 } },
              }}
            >
              {meta}
            </m.span>
          )}
        </div>

        <m.div
          className={clsx("px-4 pb-5 pt-3", className)}
          variants={{
            hidden: { opacity: 0, y: 18 },
            shown: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.7,
                ease: EASE,
                delay: titleDuration * 0.6,
                delayChildren: titleDuration * 0.6 + 0.1,
                staggerChildren: 0.07,
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
