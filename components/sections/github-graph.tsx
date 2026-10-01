"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { animate, m } from "framer-motion";
import { unpackDays, type ContributionDay, type PackedPeriod } from "@/lib/github";

const LEVEL_CLASS = [
  "bg-line/[0.07]",
  "bg-ink/20",
  "bg-ink/40",
  "bg-ink/65",
  "bg-ink/90",
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toWeeks(days: ContributionDay[]) {
  // Pad the first week so every column starts on Sunday.
  const firstWeekday = new Date(`${days[0].date}T00:00:00`).getDay();
  const padded: (ContributionDay | null)[] = [...Array(firstWeekday).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks: (ContributionDay | null)[][]) {
  const labels = weeks.map((week, i) => {
    const first = week.find((d) => d !== null);
    if (!first) return null;
    const month = new Date(`${first.date}T00:00:00`).getMonth();
    const prev = weeks[i - 1]?.find((d) => d !== null);
    const prevMonth = prev ? new Date(`${prev.date}T00:00:00`).getMonth() : -1;
    return month !== prevMonth && i < weeks.length - 2 ? MONTHS[month] : null;
  });
  // A month that only gets a week or two at either edge would collide with its neighbour.
  labels.forEach((label, i) => {
    if (!label) return;
    const next = labels.findIndex((l, j) => j > i && l !== null);
    if (next !== -1 && next - i < 3) labels[i] = null;
  });
  return labels;
}

function describe(day: ContributionDay) {
  const date = new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${day.count === 0 ? "No" : day.count} ${noun} on ${date}`;
}

/** A number that counts over to its new value whenever it changes. */
function RollingTotal({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(shown.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        shown.current = v;
        node.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span ref={ref} className="text-ink">
      {value.toLocaleString()}
    </span>
  );
}

export default function GithubGraph({
  periods,
  username,
}: {
  periods: PackedPeriod[];
  username: string;
}) {
  const [activeKey, setActiveKey] = useState(periods[0]?.key);
  const active = periods.find((p) => p.key === activeKey) ?? periods[0];
  const weeks = useMemo(() => toWeeks(unpackDays(active)), [active]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens start at the most recent weeks.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [activeKey]);

  const periodPhrase = active.key === "last" ? "recently" : `in ${active.label}`;

  return (
    <figure>
      {periods.length > 1 && (
        <div className="mb-4 flex justify-end">
          <div role="tablist" aria-label="Contribution period" className="flex rounded-lg border border-line/10 bg-card/70 p-0.5">
            {periods.map((period) => {
              const selected = period.key === active.key;
              return (
                <button
                  key={period.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveKey(period.key);
                    setHovered(null);
                  }}
                  className={clsx(
                    "relative rounded-md px-2.5 py-1 font-mono text-[0.7rem] transition-colors duration-300",
                    selected ? "text-paper" : "text-ink-faint hover:text-ink",
                  )}
                >
                  {selected && (
                    <m.span
                      layoutId="github-period"
                      className="absolute inset-0 rounded-md bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative">{period.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div ref={scrollerRef} className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-max">
          <div className="mb-1.5 flex gap-[3px]" aria-hidden="true">
            {labels.map((label, i) => (
              <span key={i} className="relative h-3 w-[10px] shrink-0">
                {label && (
                  <span className="absolute left-0 top-0 font-mono text-[0.6rem] text-ink-faint">{label}</span>
                )}
              </span>
            ))}
          </div>
          <div
            className="flex gap-[3px]"
            role="img"
            aria-label={`${active.total} GitHub contributions ${periodPhrase}`}
            onPointerLeave={() => setHovered(null)}
          >
            {weeks.map((week, i) => (
              // Keyed by period, so switching re-inks the grid week by week, left to right
              // (a CSS animation: 53 columns is too many to hand to JavaScript).
              <div
                key={`${active.key}-${i}`}
                className="ink-in flex flex-col gap-[3px]"
                style={{ animationDelay: `${i * 8}ms` }}
              >
                {week.map((day, j) =>
                  day ? (
                    <span
                      key={day.date}
                      onPointerEnter={() => setHovered(day)}
                      className={clsx(
                        "h-[10px] w-[10px] rounded-[2px] transition-transform duration-150 hover:scale-[1.35] hover:ring-1 hover:ring-shu",
                        LEVEL_CLASS[day.level],
                      )}
                    />
                  ) : (
                    <span key={`pad-${j}`} className="h-[10px] w-[10px]" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.7rem] text-ink-faint">
        <span className="min-h-[1rem] tabular-nums">
          {hovered ? (
            <span className="text-ink">{describe(hovered)}</span>
          ) : (
            <>
              <RollingTotal value={active.total} /> contributions {periodPhrase} ·{" "}
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line hover:text-ink"
              >
                @{username}
              </a>
            </>
          )}
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less
          {LEVEL_CLASS.map((c) => (
            <span key={c} className={clsx("h-[10px] w-[10px] rounded-[2px]", c)} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
