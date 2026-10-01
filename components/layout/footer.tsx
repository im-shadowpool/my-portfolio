"use client";

import { m } from "framer-motion";
import { useEffect, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import VisitorCount from "@/components/ui/visitor-count";
import SoundToggle from "@/components/ui/sound-toggle";
import { openShortcuts } from "@/components/ui/shortcuts";
import Doodle from "@/components/ui/doodle";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAINT = [0.65, 0, 0.35, 1] as const;
const ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;

// Concentric rings of dots, like ripples spreading on the pond. Only the top
// half shows above the card's edge; dots near the pointer swell and brighten.
// Rings 7 units apart, each with about one dot per 7 units of circumference.
const RINGS = Array.from({ length: 9 }, (_, i) => {
  const r = i * 7;
  return { r, n: i === 0 ? 1 : Math.round((2 * Math.PI * r) / 7) };
});
const REACH = 24; // pointer influence, in svg units
const BASE = 0.1;

function RippleMark() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    const card = el?.closest("[data-sign]");
    if (!el || !card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dots = [...el.querySelectorAll<SVGCircleElement>("circle")];
    const pts = dots.map((d) => ({ x: Number(d.getAttribute("cx")), y: Number(d.getAttribute("cy")) }));

    const move = (e: Event) => {
      const { clientX, clientY } = e as PointerEvent;
      const box = el.getBoundingClientRect();
      const k = 120 / box.width;
      const px = (clientX - box.left) * k;
      const py = (clientY - box.top) * k;
      dots.forEach((d, i) => {
        const w = Math.max(0, 1 - Math.hypot(pts[i].x - px, pts[i].y - py) / REACH);
        d.style.transform = `scale(${1 + w * 1.9})`;
        d.style.opacity = String(BASE + w * 0.55);
      });
    };
    const leave = () =>
      dots.forEach((d) => {
        d.style.transform = "";
        d.style.opacity = "";
      });

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 120 120" className="h-44 w-44 overflow-visible sm:h-56 sm:w-56">
      {RINGS.map(({ r, n }, ring) =>
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={`${ring}-${i}`}
              className="ripple-dot"
              cx={(60 + r * Math.cos(a)).toFixed(2)}
              cy={(60 + r * Math.sin(a)).toFixed(2)}
              r={ring === 0 ? 1.8 : 1.15}
            />
          );
        }),
      )}
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-column px-4 pb-8">
      {/*
        Sign-off, like the close of a letter: the line is written and the name
        is signed with a brush stroke under it. A large monogram sits faintly
        behind, like a watermark.
      */}
      <m.div
        data-sign className="group/sign relative mb-10 mt-4 overflow-hidden rounded-xl border border-dotted border-line/30 bg-card/70 px-6 py-9 sm:px-10 sm:py-11"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ONCE}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <m.span
          className="pointer-events-none absolute -bottom-[5.5rem] right-10 select-none sm:-bottom-28 sm:right-24"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <RippleMark />
        </m.span>

        <div className="relative flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <p className="max-w-md font-display text-[1.45rem] font-medium leading-snug tracking-tight text-ink sm:text-[2rem]">
              Thank you for reading all the way down.
            </p>

            {/* Signature */}
            <div className="mt-7 flex items-center gap-4">
              <div>
                <span className="relative inline-block font-display text-[1.15rem] text-ink sm:text-[1.3rem]">
                  Saipavan Veeravalli
                  <svg
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-2.5 w-full text-shu"
                    aria-hidden="true"
                  >
                    <m.path
                      d="M2 6 C 40 2, 80 9, 120 5 S 180 3, 198 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.8 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: PAINT, delay: 0.25 }}
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <m.span
            className="tategaki shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-ink-soft sm:text-[0.8rem]"
            aria-hidden="true"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: PAINT, delay: 0.15 }}
          >
            Thank you
          </m.span>
        </div>
      </m.div>

      <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.75rem] text-ink-faint">
        <Doodle side="right" className="-top-2">
          sound on / off
        </Doodle>
        <span className="whitespace-nowrap">&copy; 2023–{currentYear} devshadow.space</span>
        <VisitorCount className="font-mono text-[0.72rem] text-ink-faint" />
        <div className="flex items-center gap-3">
          <a href="#main" className="group inline-flex w-fit items-center gap-1.5 whitespace-nowrap transition-colors hover:text-ink">
            Back to top
            <FiArrowUp className="transition-transform duration-300 ease-silk group-hover:-translate-y-0.5" />
          </a>
          {/* Keyboard shortcuts only matter with a keyboard, so not on phones */}
          <button
            type="button"
            onClick={openShortcuts}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
            aria-keyshortcuts="?"
            className="hidden h-6 min-w-6 items-center justify-center rounded-md border border-b-2 border-line/20 px-1.5 font-mono text-[0.7rem] text-ink-faint transition-colors hover:border-line/40 hover:text-ink sm:flex"
          >
            ?
          </button>
          <SoundToggle />
        </div>
      </div>
    </footer>
  );
}
