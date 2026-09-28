"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Up/down arrows. Closed, they point apart (expand); open, they fold to point
// at each other (collapse). The paths share a shape so one morphs into the other.
const ARROWS = {
  closed: { top: "M4.5 6 L8 2.5 L11.5 6", bottom: "M4.5 10 L8 13.5 L11.5 10" },
  open: { top: "M4.5 2.5 L8 6 L11.5 2.5", bottom: "M4.5 13.5 L8 10 L11.5 13.5" },
};
const ARROW_SPRING = { type: "spring", stiffness: 380, damping: 22, mass: 0.6 } as const;

function ExpandArrows({ open }: { open: boolean }) {
  const state = open ? ARROWS.open : ARROWS.closed;
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* On hover a closed row's arrows lean apart, hinting at what a click does. */}
      <g className={clsx("transition-transform duration-300 ease-silk", !open && "group-hover/row:-translate-y-[1.5px]")}>
        <motion.path initial={false} animate={{ d: state.top }} transition={ARROW_SPRING} />
      </g>
      <g className={clsx("transition-transform duration-300 ease-silk", !open && "group-hover/row:translate-y-[1.5px]")}>
        <motion.path initial={false} animate={{ d: state.bottom }} transition={{ ...ARROW_SPRING, delay: 0.04 }} />
      </g>
    </svg>
  );
}

/**
 * Accordion row. `trailing` sits beside the toggle rather than inside it, so it
 * can hold links without nesting interactive elements in the button.
 */
export default function Collapsible({
  id,
  open,
  onToggle,
  header,
  trailing,
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="group/row relative">
      <div className="flex items-center gap-2 pr-4">
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-left"
        >
          <div className="min-w-0 flex-1">{header}</div>
        </button>
        {trailing}
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-hidden="true"
          className={clsx(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent transition-colors duration-300",
            open ? "text-shu" : "text-ink-faint group-hover/row:text-ink",
          )}
        >
          <ExpandArrows open={open} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -6, filter: "blur(3px)" }}
              animate={{ y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="px-4 pb-5"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
