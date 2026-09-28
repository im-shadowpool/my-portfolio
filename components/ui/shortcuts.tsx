"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTheme } from "@/context/theme-context";
import { useSeason } from "@/components/providers/season";
import { SEASONS, SEASON_META } from "@/lib/season";
import { setSoundOn, sound, soundOn } from "@/lib/sound";

/*
  Single-key shortcuts for the whole site. Letters used by the pond's easter
  eggs (typing "hire", and the Konami code's B and A) are left alone.
*/

const SECTIONS: [string, string, string][] = [
  ["1", "about", "About"],
  ["2", "experience", "Work"],
  ["3", "projects", "Projects"],
  ["4", "skills", "Stack"],
  ["5", "contact", "Contact"],
];

const LIST: [string, string][] = [
  ["D", "Dark / light mode"],
  ["M", "Sound on / off"],
  ["S", "Next season in the pond"],
  ["F", "Feed the koi"],
  ["1–5", "Jump to About, Work, Projects, Stack, Contact"],
  ["T", "Back to top"],
  ["?", "Show these shortcuts"],
];

/** Opens the shortcuts panel from anywhere (e.g. the footer button). */
export const openShortcuts = () => window.dispatchEvent(new Event("shortcuts:open"));

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line/20 border-b-2 bg-card px-1.5 font-mono text-[0.72rem] text-ink">
      {children}
    </kbd>
  );
}

export default function Shortcuts() {
  const { toggleTheme } = useTheme();
  const { season, cycle } = useSeason();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ key: string; text: string; id: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const notify = useCallback((key: string, text: string) => setToast({ key, text, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("shortcuts:open", onOpen);
    return () => window.removeEventListener("shortcuts:open", onOpen);
  }, []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (key === "?") {
        setOpen((v) => !v);
        return;
      }
      if (open) return;

      const section = SECTIONS.find(([k]) => k === key);
      if (section) {
        const [, id, label] = section;
        if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: smooth() });
        else router.push(`/#${id}`);
        notify(key, label);
        return;
      }

      switch (key) {
        case "d": {
          const toDark = !document.documentElement.classList.contains("dark");
          sound.themeSwitch();
          toggleTheme();
          notify("D", toDark ? "Dark mode" : "Light mode");
          break;
        }
        case "m": {
          const next = !soundOn();
          setSoundOn(next);
          if (next) sound.tick();
          notify("M", next ? "Sound on" : "Sound off");
          break;
        }
        case "s": {
          if (pathname !== "/" || !season) return;
          const next = SEASONS[(SEASONS.indexOf(season) + 1) % SEASONS.length];
          cycle();
          notify("S", `${SEASON_META[next].kanji} ${SEASON_META[next].label}`);
          break;
        }
        case "f": {
          if (pathname !== "/") return;
          window.dispatchEvent(new Event("koi:feed"));
          notify("F", "Fed the koi");
          break;
        }
        case "t": {
          window.scrollTo({ top: 0, behavior: smooth() });
          notify("T", "Back to top");
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pathname, router, season, cycle, toggleTheme, notify]);

  return (
    <>
      {/* A small confirmation that the shortcut did something */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[95] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-line/10 bg-paper/95 py-1.5 pl-1.5 pr-3 text-[0.8rem] text-ink shadow-sm backdrop-blur-sm"
          >
            <Key>{toast.key}</Key>
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[96] flex items-center justify-center bg-ink/20 px-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortcuts-title"
              className="w-full max-w-sm rounded-xl border border-line/15 bg-paper p-5 shadow-lg"
              initial={{ y: 12, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-baseline gap-2.5">
                <h2 id="shortcuts-title" className="font-display text-[1.25rem] font-semibold text-shu">
                  Shortcuts
                </h2>
                <span className="font-display text-[0.85rem] text-ink-faint" lang="ja" aria-hidden="true">
                  近道
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close shortcuts"
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>
              <ul className="space-y-2.5">
                {LIST.map(([key, text]) => (
                  <li key={key} className="flex items-center gap-3 text-[0.88rem] text-ink-soft">
                    <span className="w-10 shrink-0">
                      <Key>{key}</Key>
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <p className="dots-t mt-4 pt-3 text-[0.75rem] text-ink-faint">
                The koi have a few secrets of their own…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
