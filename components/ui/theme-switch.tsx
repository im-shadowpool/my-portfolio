"use client";

import { useTheme } from "@/context/theme-context";
import React, { useRef } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { motion } from "framer-motion";

type ViewTransition = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioning = useRef(false);

  const handleThemeToggle = () => {
    const transitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      !transitionDocument.startViewTransition ||
      prefersReducedMotion ||
      !buttonRef.current
    ) {
      toggleTheme();
      return;
    }

    if (isTransitioning.current) return;

    const buttonBounds = buttonRef.current.getBoundingClientRect();
    const x = buttonBounds.left + buttonBounds.width / 2;
    const y = buttonBounds.top + buttonBounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const snapshotScale = window.devicePixelRatio || 1;

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--theme-transition-x", `${x * snapshotScale}px`);
    rootStyle.setProperty("--theme-transition-y", `${y * snapshotScale}px`);
    rootStyle.setProperty(
      "--theme-transition-radius",
      `${radius * snapshotScale}px`,
    );

    isTransitioning.current = true;
    const transition = transitionDocument.startViewTransition(() => {
      toggleTheme();
    });

    transition.finished.finally(() => {
      isTransitioning.current = false;
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="theme-toggle fixed bottom-5 right-5 z-[9999] flex h-[3rem] w-[3rem] items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white shadow-lg shadow-black/10 transition-transform hover:scale-105 active:scale-95"
      onClick={handleThemeToggle}
    >
      <span className="relative block h-5 w-5" aria-hidden="true">
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={
            theme === "light"
              ? { opacity: 1, rotate: 0, scale: 1 }
              : { opacity: 0, rotate: 90, scale: 0.65 }
          }
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <BsSun className="text-[1.2rem]" />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={
            theme === "dark"
              ? { opacity: 1, rotate: 0, scale: 1 }
              : { opacity: 0, rotate: -90, scale: 0.65 }
          }
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <BsMoon className="text-[1.1rem]" />
        </motion.span>
      </span>
    </button>
  );
}
