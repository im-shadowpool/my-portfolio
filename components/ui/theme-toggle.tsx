"use client";

import { useTheme } from "@/context/theme-context";
import { FiMoon, FiSun } from "react-icons/fi";
import { sound } from "@/lib/sound";

/**
 * Sun in light mode, moon in dark mode. The icons are driven by the `dark`
 * class itself rather than React state, so they can never disagree with the
 * page; the swap rotates one out as the other rises in.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle colour theme";

  return (
    <button
      type="button"
      onClick={() => {
        sound.themeSwitch();
        toggleTheme();
      }}
      aria-label={label}
      title={`${label} (D)`}
      aria-keyshortcuts="d"
      className="group relative flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] active:scale-95"
    >
      <FiSun
        className="absolute h-[0.875rem] w-[0.875rem] rotate-0 scale-100 opacity-100 transition-all duration-500 ease-silk group-hover:rotate-45 dark:-rotate-90 dark:scale-50 dark:opacity-0"
        aria-hidden="true"
      />
      <FiMoon
        className="absolute h-[0.8rem] w-[0.8rem] rotate-90 scale-50 opacity-0 transition-all duration-500 ease-silk dark:rotate-0 dark:scale-100 dark:opacity-100 dark:group-hover:-rotate-12"
        aria-hidden="true"
      />
    </button>
  );
}
