"use client";

import { m } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import VisitorCount from "@/components/ui/visitor-count";
import SoundToggle from "@/components/ui/sound-toggle";
import { openShortcuts } from "@/components/ui/shortcuts";
import Doodle from "@/components/ui/doodle";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAINT = [0.65, 0, 0.35, 1] as const;
const ONCE = { once: true, margin: "0px 0px -10% 0px" } as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-column px-4 pb-8">
      {/*
        Sign-off, like the close of a letter: the line is written and the name
        is signed with a brush stroke under it. 終 ("the end") sits faintly
        behind, as on an old film's end card.
      */}
      <m.div
        className="relative mb-10 mt-4 overflow-hidden rounded-xl border border-dotted border-line/30 bg-card/70 px-6 py-9 sm:px-10 sm:py-11"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ONCE}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <m.span
          className="pointer-events-none absolute -bottom-12 right-10 select-none font-display text-[10rem] leading-none text-ink/[0.05] sm:-bottom-16 sm:right-16 sm:text-[14rem]"
          lang="ja"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        >
          終
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
                      transition={{ duration: 0.9, ease: PAINT, delay: 0.6 }}
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <m.span
            className="tategaki shrink-0 font-display text-[0.95rem] tracking-[0.35em] text-ink-soft sm:text-[1.15rem]"
            lang="ja"
            aria-hidden="true"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: PAINT, delay: 0.3 }}
          >
            ありがとう
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
