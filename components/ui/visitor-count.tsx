"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { animate, motion } from "framer-motion";
import { FiEye } from "react-icons/fi";

type Counts = { visitor?: number; visitors: number; views: number; sample?: boolean };
type Reply = Counts | { configured: false };

const VISITOR_KEY = "visitor-number";
const SESSION_KEY = "visit-counted";

// Shown only on localhost while the counter database isn't connected, so the
// footer can be previewed. Production always shows real numbers (or nothing).
const SAMPLE: Counts = { visitor: 20, visitors: 20, views: 1204, sample: true };
const isLocalhost = () =>
  ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) ||
  window.location.hostname.endsWith(".localhost");

function ordinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n.toLocaleString()}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
  return `${n.toLocaleString()}${suffix}`;
}

/** Counts up to a number the first time it's shown. */
function Tally({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(Math.max(0, value - 40), value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, format]);

  return (
    <span ref={ref} className="tabular-nums text-ink">
      {format(value)}
    </span>
  );
}

const plain = (n: number) => n.toLocaleString();

/**
 * "1,204 views", with "You're the 20th visitor" on hover. A browser keeps its visitor
 * number; a view is counted once per session. If the counter backend isn't
 * configured it renders nothing, except on localhost, where it shows sample numbers.
 */
export default function VisitorCount({ className }: { className?: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let stored: number | null = null;
    let counted = false;
    try {
      stored = Number(localStorage.getItem(VISITOR_KEY)) || null;
      counted = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}

    const request = counted
      ? fetch("/api/visit")
      : fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor: stored }),
        });

    request
      .then((res) => (res.ok ? (res.json() as Promise<Reply>) : null))
      .then((reply) => {
        const data = reply && "views" in reply ? reply : null;
        if (!data) {
          if (isLocalhost()) setCounts(SAMPLE);
          return;
        }
        try {
          if (data.visitor) localStorage.setItem(VISITOR_KEY, String(data.visitor));
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        setCounts({ ...data, visitor: data.visitor ?? stored ?? undefined });
      })
      .catch(() => {
        if (isLocalhost()) setCounts(SAMPLE);
      });
  }, []);

  if (!counts) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("inline-flex items-center gap-1.5", className ?? "font-mono text-[0.78rem] text-ink-faint")}
      title={counts.visitor ? `You're the ${ordinal(counts.visitor)} visitor` : undefined}
    >
      <FiEye aria-hidden="true" />
      <span>
        <Tally value={counts.views} format={plain} /> views
      </span>
      {counts.sample && (
        <span
          className="ml-1 rounded border border-dashed border-line/25 px-1 py-px text-[0.6rem] uppercase tracking-wider"
          title="Sample numbers. Real counts appear once the Upstash database is connected."
        >
          sample
        </span>
      )}
    </motion.p>
  );
}
