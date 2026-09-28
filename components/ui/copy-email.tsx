"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiCopy } from "react-icons/fi";
import clsx from "clsx";
import { sound } from "@/lib/sound";

/** Email address that copies itself on click and confirms with a small tooltip. */
export default function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      sound.stamp();
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={clsx("group relative inline-flex items-center gap-1.5 text-left", className)}
      aria-label={`Copy email address ${email}`}
    >
      <span className="link-line">{email}</span>
      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center text-ink-faint transition-colors group-hover:text-ink">
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <FiCheck className="text-matcha" />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
              <FiCopy />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <AnimatePresence>
        {copied && (
          // A vermillion "済" (done) seal, pressed on like the hanko.
          <motion.span
            key="stamp"
            className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.span
              role="status"
              initial={{ opacity: 0, scale: 1.7, rotate: -16 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-[0.3rem] bg-shu px-2 py-1 font-display text-[0.72rem] font-semibold leading-none text-paper"
              style={{ boxShadow: "inset 0 0 0 1.5px rgb(var(--paper) / 0.9), inset 0 0 0 2.5px rgb(var(--shu))" }}
            >
              <span lang="ja" aria-hidden="true">
                済
              </span>
              Copied
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
