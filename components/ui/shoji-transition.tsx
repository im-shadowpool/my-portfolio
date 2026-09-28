"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";
import Hanko from "@/components/ui/hanko";
import { sound } from "@/lib/sound";

const PAINT = [0.65, 0, 0.35, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

// Door timings in seconds, shared by the motion and its sound.
const CLOSE = 0.55;
const OPEN = 0.85;
const OPEN_DELAY = 0.2;

type Phase = "idle" | "closing" | "closed" | "opening";

// Thin kumiko lattice drawn over washi paper.
const LATTICE = {
  backgroundColor: "rgb(var(--card))",
  backgroundImage:
    "linear-gradient(rgb(var(--line) / 0.13) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.13) 1px, transparent 1px)",
  backgroundSize: "56px 72px",
} as const;

function Door({ side, open, onDone }: { side: "left" | "right"; open: boolean; onDone?: () => void }) {
  const left = side === "left";
  const away = left ? "-100%" : "100%";
  return (
    <m.div
      className="absolute inset-y-0 w-1/2"
      style={{ ...LATTICE, [side]: 0, backgroundPosition: left ? "right top" : "left top" }}
      initial={{ x: away }}
      animate={{ x: open ? away : "0%" }}
      transition={open ? { duration: OPEN, ease: PAINT, delay: OPEN_DELAY } : { duration: CLOSE, ease: PAINT }}
      onAnimationComplete={onDone}
    >
      {/* The wooden frame where the two doors meet */}
      <span
        className="absolute inset-y-0 w-[3px] bg-ink/25"
        style={{ [left ? "right" : "left"]: 0 }}
        aria-hidden="true"
      />
    </m.div>
  );
}

/**
 * Page changes happen behind shoji doors: clicking a link to another page
 * slides the doors shut over this one, the route changes behind them, and
 * they slide open onto the new page.
 */
export default function ShojiTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const target = useRef<{ href: string; hash: boolean } | null>(null);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  // Catch clicks on links to other pages before Next's <Link> handles them.
  useEffect(() => {
    if (reduce) return;
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      event.preventDefault();
      event.stopPropagation();
      if (phaseRef.current !== "idle") return;
      target.current = { href: url.pathname + url.search + url.hash, hash: Boolean(url.hash) };
      router.prefetch(url.pathname);
      go("closing");
      sound.shojiClose(CLOSE);
    }
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [reduce, router]);

  // The new page has rendered behind the closed doors: open them.
  useEffect(() => {
    if (phaseRef.current !== "closed") return;
    if (!target.current?.hash) window.scrollTo({ top: 0, behavior: "instant" });
    go("opening");
    sound.shojiOpen(OPEN_DELAY, OPEN);
  }, [pathname]);

  const onDoorsDone = () => {
    if (phaseRef.current === "closing" && target.current) {
      go("closed");
      router.push(target.current.href);
    } else if (phaseRef.current === "opening") {
      target.current = null;
      go("idle");
    }
  };

  if (phase === "idle") return null;
  const open = phase === "opening";

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      <Door side="left" open={open} onDone={onDoorsDone} />
      <Door side="right" open={open} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <m.span
          initial={{ scale: 1.6, opacity: 0, rotate: -16 }}
          animate={open ? { scale: 0.85, opacity: 0, rotate: -10 } : { scale: 1, opacity: 1, rotate: -4 }}
          transition={
            open ? { duration: 0.3, ease: EASE } : { type: "spring", stiffness: 460, damping: 18, delay: 0.3 }
          }
        >
          <Hanko className="h-14 w-14 text-lg" />
        </m.span>
      </div>
    </div>
  );
}
