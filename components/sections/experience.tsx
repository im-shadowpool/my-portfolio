"use client";

import { m } from "framer-motion";
import { useState } from "react";
import { useSectionInView } from "@/lib/hooks";
import type { ExperienceItem } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";
import Collapsible from "@/components/ui/collapsible";

function Timeline({ items, prefix }: { items: ExperienceItem[]; prefix: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="dots-t divide-y divide-dotted divide-line/25">
      {items.map((item, index) => {
        const current = item.date.includes("Present");
        return (
          <m.li key={`${item.title}-${item.date}`} variants={panelItem}>
            <Collapsible
              id={`${prefix}-${index}`}
              open={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
              header={
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line/10 bg-card font-display text-[0.95rem] text-ink transition-colors duration-300 group-hover/row:border-line/25"
                    aria-hidden="true"
                  >
                    {item.location.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-[0.95rem] font-medium text-ink">
                      {item.title}
                      {current && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0" title="Current role">
                          <span className="absolute inset-0 animate-ping rounded-full bg-matcha opacity-60" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-matcha" />
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 flex flex-wrap gap-x-2 text-[0.8rem] text-ink-faint">
                      <span className="text-ink-soft">{item.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[0.74rem]">{item.date}</span>
                    </p>
                  </div>
                </div>
              }
            >
              <p className="border-l border-line/15 pl-4 text-[0.9rem] leading-relaxed text-ink-soft sm:ml-[1.125rem] sm:pl-[1.9rem]">
                {item.description}
              </p>
            </Collapsible>
          </m.li>
        );
      })}
    </ul>
  );
}

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const { ref } = useSectionInView("Experience", 0.4);
  const work = experiences.filter((item) => item.icon !== "education");
  const education = experiences.filter((item) => item.icon === "education");

  return (
    <>
      <Panel id="experience" title="Experience" kanji="経歴" meta={`${work.length} roles`} sectionRef={ref} className="!px-0 !py-0">
        <Timeline items={work} prefix="work" />
      </Panel>
      {education.length > 0 && (
        <Panel id="education" title="Education" kanji="学歴" className="!px-0 !py-0">
          <Timeline items={education} prefix="edu" />
        </Panel>
      )}
    </>
  );
}
