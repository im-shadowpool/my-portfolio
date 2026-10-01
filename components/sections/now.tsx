"use client";

import { m } from "framer-motion";
import type { NowData } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";

/** Formatted in UTC so the server and browser agree on the day. */
function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** What I'm focused on at the moment, in the spirit of a /now page. */
/** Renders [label](url) as an inline link. */
function WithLinks({ text }: { text: string }) {
  return (
    <>
      {text.split(/\[([^\]]+)\]\(([^)]+)\)/g).map((part, i, all) => {
        if (i % 3 === 1) {
          return (
            <a
              key={i}
              href={all[i + 1]}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-ink underline-offset-2"
            >
              {part}
            </a>
          );
        }
        return i % 3 === 2 ? null : part;
      })}
    </>
  );
}

export default function Now({ now }: { now: NowData }) {
  return (
    <Panel
      id="now"
      title="Now"
      glyph="N"
      meta={
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-matcha opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-matcha" />
          </span>
          <time dateTime={now.updated}>{formatDate(now.updated)}</time>
        </span>
      }
    >
      <ul className="divide-y divide-dotted divide-line/25 overflow-hidden rounded-lg border border-line/10">
        {now.items.map((item) => (
          <m.li
            key={item.label}
            variants={panelItem}
            className="group now-item grid gap-2 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4"
          >
            <div className="flex h-6 items-center gap-2.5">
              <span
                className={`now-tile now-${item.glyph.toLowerCase()} flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[0.3rem] border border-shu/30 font-display text-[0.78rem] leading-none text-shu transition-colors duration-500 ease-silk group-hover:border-shu group-hover:bg-shu group-hover:text-paper`}
                aria-hidden="true"
              >
                <span className="now-letter">{item.glyph}</span>
              </span>
              <span className="label">{item.label}</span>
            </div>
            <p className="text-[0.93rem] leading-6 text-ink"><WithLinks text={item.text} /></p>
          </m.li>
        ))}
      </ul>
    </Panel>
  );
}
