"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { useSectionInView } from "@/lib/hooks";
import type { ProjectItem } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";
import Collapsible from "@/components/ui/collapsible";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
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

export default function Projects({
  projects,
  githubUrl,
}: {
  projects: ProjectItem[];
  githubUrl: string;
}) {
  const { ref } = useSectionInView("Projects", 0.3);
  const [open, setOpen] = useState<number | null>(null);
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Panel
      id="projects"
      title="Projects"
      glyph="P"
      meta={`${projects.length} shipped`}
      sectionRef={ref}
      className="!px-0 !py-0"
    >
      {featured.length > 0 && (
        <div className="dots-t p-4">
          <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-faint">
            Featured
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {featured.map((project) => (
              <m.li key={project.title} variants={panelItem} className="flex">
                <article className="group/card flex w-full flex-col rounded-lg border border-line/10 bg-card/40 p-2.5 transition-colors duration-300 hover:border-line/25">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[16/10] overflow-hidden rounded-md border border-line/10 bg-card"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={project.imageUrl}
                      alt={project.imageAlt ?? project.title}
                      fill
                      sizes="(min-width: 768px) 340px, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-silk group-hover/card:scale-[1.03]"
                    />
                  </a>
                  <div className="mt-2.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-[0.95rem] font-medium text-ink">
                        <span className="truncate">{project.title}</span>
                        {project.badge && (
                          <span className="inline-flex shrink-0 items-center rounded-full border border-line/10 bg-card px-2 py-0.5 text-[0.68rem] font-normal text-ink-soft">
                            {project.badge}
                          </span>
                        )}
                      </h3>
                      <p className="font-mono text-[0.72rem] text-ink-faint">
                        {project.year}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center">
                      <IconLink
                        href={project.url}
                        label={`${project.title} — live site`}
                      >
                        <FiArrowUpRight />
                      </IconLink>
                      {project.repo && (
                        <IconLink
                          href={project.repo}
                          label={`${project.title} — source on GitHub`}
                        >
                          <FiGithub className="text-[0.85rem]" />
                        </IconLink>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-3 text-[0.82rem] leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                  <ul
                    className="mt-2.5 flex flex-wrap gap-1.5 pt-0.5"
                    aria-label="Technologies"
                  >
                    {project.tags.slice(0, 4).map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-line/10 bg-card px-1.5 py-0.5 font-mono text-[0.66rem] text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </m.li>
            ))}
          </ul>
        </div>
      )}

      <ul className="dots-t divide-y divide-dotted divide-line/25">
        {rest.map((project, index) => (
          <m.li key={project.title} variants={panelItem}>
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
                    <p className="truncate text-[0.95rem] font-medium text-ink">
                      {project.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[0.74rem] text-ink-faint">
                      {project.year} · {project.tags.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </div>
              }
              trailing={
                <div className="flex items-center">
                  <IconLink
                    href={project.url}
                    label={`${project.title} — live site`}
                  >
                    <FiArrowUpRight />
                  </IconLink>
                  {project.repo && (
                    <IconLink
                      href={project.repo}
                      label={`${project.title} — source on GitHub`}
                    >
                      <FiGithub className="text-[0.85rem]" />
                    </IconLink>
                  )}
                </div>
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-line/10 bg-card sm:w-52"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt ?? project.title}
                    fill
                    sizes="(min-width: 640px) 208px, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-silk group-hover:scale-[1.02]"
                  />
                </a>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.88rem] leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                  <ul
                    className="mt-3 flex flex-wrap gap-1.5"
                    aria-label="Technologies"
                  >
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-line/10 bg-card px-2 py-0.5 font-mono text-[0.7rem] text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Collapsible>
          </m.li>
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
