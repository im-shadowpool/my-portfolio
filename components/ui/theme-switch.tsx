"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    const hasViewTransition =
      typeof document !== "undefined" && "startViewTransition" in document;

    if (
      !hasViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      toggleTheme();
      return;
    }

    (document as any).startViewTransition(() => {
      toggleTheme();
    });
  };

  return (
    <button
      className="fixed bottom-5 right-5 bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950 z-[9999] overflow-hidden"
      onClick={handleThemeToggle}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -180, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 180, scale: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {theme === "light" ? (
            <BsSun className="text-[1.2rem]" />
          ) : (
            <BsMoon className="text-[1.1rem]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
