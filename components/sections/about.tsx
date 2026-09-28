"use client";

import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import type { AboutData } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";

export default function About({ about }: { about: AboutData }) {
  const { ref } = useSectionInView("About", 0.5);

  return (
    <Panel id="about" title="About" kanji="私" sectionRef={ref}>
      <motion.p variants={panelItem} className="mb-4 font-display text-[1.2rem] leading-snug text-ink">
        {about.headline}
      </motion.p>

      <ul className="space-y-3 text-[0.93rem] leading-relaxed text-ink-soft">
        {about.paragraphs.map((paragraph, i) => (
          <motion.li key={i} variants={panelItem} className="relative pl-5">
            <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-faint" aria-hidden="true" />
            {paragraph}
          </motion.li>
        ))}
        <motion.li variants={panelItem} className="relative pl-5">
          <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-faint" aria-hidden="true" />
          Proudest fix so far: taking a client site&apos;s load time from{" "}
          <span className="font-mono text-[0.85rem] text-ink line-through decoration-shu/60">
            {about.stat.from}
            {about.stat.unit}
          </span>{" "}
          to{" "}
          <span className="font-mono text-[0.85rem] text-ink">
            {about.stat.to}
            {about.stat.unit}
          </span>{" "}
          with caching and backend tuning.
        </motion.li>
      </ul>

      <motion.dl variants={panelItem} className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line/10 bg-line/10 text-[0.85rem] sm:grid-cols-2">
        <div className="bg-paper px-3.5 py-3">
          <dt className="label mb-1">Reading</dt>
          <dd className="text-ink">
            {about.offscreen.reading}
            <span className="text-ink-faint"> · fav: {about.offscreen.favourite}</span>
          </dd>
        </div>
        <div className="bg-paper px-3.5 py-3">
          <dt className="label mb-1">Off-screen</dt>
          <dd className="text-ink">{about.offscreen.hobbies.join(" · ")}</dd>
        </div>
      </motion.dl>
    </Panel>
  );
}
