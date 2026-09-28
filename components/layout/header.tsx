"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import type { SectionName } from "@/lib/types";
import Hanko from "@/components/ui/hanko";
import ThemeToggle from "@/components/ui/theme-toggle";

const NAV: { name: SectionName; label: string; hash: string }[] = [
  { name: "About", label: "About", hash: "#about" },
  { name: "Experience", label: "Work", hash: "#experience" },
  { name: "Projects", label: "Projects", hash: "#projects" },
  { name: "Skills", label: "Stack", hash: "#skills" },
];

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const pathname = usePathname();
  // Section links are same-page anchors on the home page, and routes back to it elsewhere.
  const onHome = pathname === "/";
  const to = (hash: string) => (onHome ? hash : `/${hash}`);

  // Once the name in the intro scrolls up behind the header, it carries on beside the seal.
  const [showName, setShowName] = useState(false);
  useEffect(() => {
    const name = document.getElementById("intro-name");
    setShowName(false);
    if (!name) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowName(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-48px 0px 0px 0px" },
    );
    observer.observe(name);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-column items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2.5">
          <Link
            href={to("#home")}
            onClick={() => {
              setActiveSection("Home");
              setTimeOfLastClick(Date.now());
            }}
            className="group relative flex items-center"
            aria-label="Saipavan Veeravalli — back to top"
          >
            <Hanko className="h-7 w-7 text-[0.7rem] transition-transform duration-500 ease-silk group-hover:-rotate-[8deg]" />
            <AnimatePresence initial={false}>
              {showName && (
                <m.span
                  key="name"
                  aria-hidden="true"
                  className="hidden overflow-hidden whitespace-nowrap font-display text-[0.98rem] font-medium tracking-tight text-ink md:block"
                  initial={{ width: 0, opacity: 0, marginLeft: 0, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ width: "auto", opacity: 1, marginLeft: 10, clipPath: "inset(0 0% 0 0)" }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0, clipPath: "inset(0 100% 0 0)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  Saipavan Veeravalli
                </m.span>
              )}
            </AnimatePresence>
            {/* On phones the status shrinks to a dot on the seal. */}
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 sm:hidden" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-matcha opacity-60" />
              <span className="relative h-2 w-2 rounded-full border border-paper bg-matcha" />
            </span>
          </Link>
          <span className="sr-only sm:not-sr-only sm:inline-flex sm:items-center sm:gap-1.5 sm:rounded-full sm:border sm:border-line/10 sm:bg-card sm:px-2.5 sm:py-1 sm:text-[0.72rem] sm:text-ink-soft">
            <span className="relative hidden h-1.5 w-1.5 sm:flex" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-matcha opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-matcha" />
            </span>
            Open to work
          </span>
        </div>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <ul className="flex items-center">
            {NAV.map((item) => {
              const active = onHome && activeSection === item.name;
              return (
                <li key={item.hash} className="relative">
                  <Link
                    href={to(item.hash)}
                    onClick={() => {
                      setActiveSection(item.name);
                      setTimeOfLastClick(Date.now());
                    }}
                    aria-current={active ? "location" : undefined}
                    className={clsx(
                      "block px-2 py-1.5 text-[0.84rem] transition-colors duration-300 sm:px-2.5",
                      active ? "text-ink" : "text-ink-faint hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                  {active && (
                    <m.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-[0.55rem] h-px bg-ink sm:inset-x-2.5"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <span className="mx-1 h-4 w-px bg-line/15" aria-hidden="true" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
