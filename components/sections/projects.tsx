"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { useSectionInView } from "@/lib/hooks";
import type { ProjectItem } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";
import Collapsible from "@/components/ui/collapsible";

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md text-ink-faint transition-colors duration-300 hover:bg-card hover:text-ink"
    >
      {children}
    </a>
  );
}

export default function Projects({ projects, githubUrl }: { projects: ProjectItem[]; githubUrl: string }) {
  const { ref } = useSectionInView("Projects", 0.3);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Panel id="projects" title="Projects" kanji="作品" meta={`${projects.length} shipped`} sectionRef={ref} className="!px-0 !py-0">
      <ul className="dots-t divide-y divide-dotted divide-line/25">
        {projects.map((project, index) => (
          <motion.li key={project.title} variants={panelItem}>
            <Collapsible
              id={`project-${index}`}
              open={open === index}
              onToggle={() => setOpen(open === index ? null : index)}
              header={
                <div className="flex items-center gap-3">
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-line/10 bg-card">
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover object-left-top transition-transform duration-500 ease-silk group-hover/row:scale-110"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.95rem] font-medium text-ink">{project.title}</p>
                    <p className="mt-0.5 truncate font-mono text-[0.74rem] text-ink-faint">
                      {project.year} · {project.tags.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </div>
              }
              trailing={
                <div className="flex items-center">
                  <IconLink href={project.url} label={`${project.title} — live site`}>
                    <FiArrowUpRight />
                  </IconLink>
                  <IconLink href={project.repo} label={`${project.title} — source on GitHub`}>
                    <FiGithub className="text-[0.85rem]" />
                  </IconLink>
                </div>
              }
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mb-4 block aspect-[16/9] overflow-hidden rounded-lg border border-line/10 bg-card"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={project.imageUrl}
                  alt={project.imageAlt ?? project.title}
                  fill
                  sizes="(min-width: 768px) 700px, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-silk group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-ink/85 px-2 py-1 font-mono text-[0.68rem] text-paper opacity-0 backdrop-blur transition-all duration-300 ease-silk group-hover:opacity-100">
                  Visit site <FiArrowUpRight />
                </span>
              </a>
              <p className="text-[0.9rem] leading-relaxed text-ink-soft">{project.description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li key={tag} className="rounded-md border border-line/10 bg-card px-2 py-0.5 font-mono text-[0.7rem] text-ink-soft">
                    {tag}
                  </li>
                ))}
              </ul>
            </Collapsible>
          </motion.li>
        ))}
      </ul>

      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group dots-t flex items-center justify-center gap-1.5 py-3 text-[0.84rem] text-ink-soft transition-colors hover:bg-card hover:text-ink"
      >
        <span className="link-line">More on GitHub</span>
        <FiArrowUpRight className="transition-transform duration-300 ease-silk group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </Panel>
  );
}
