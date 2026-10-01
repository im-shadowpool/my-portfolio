"use client";

import { m } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiCss,
  SiDocker,
  SiFastify,
  SiGithubactions,
  SiGraphql,
  SiJest,
  SiNestjs,
  SiOpenjdk,
  SiPostgresql,
  SiStrapi,
  SiExpress,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiWordpress,
} from "react-icons/si";
import { FiSearch } from "react-icons/fi";
import { TbBinaryTree } from "react-icons/tb";
import { useSectionInView } from "@/lib/hooks";
import type { SkillGroup } from "@/lib/types";
import Panel, { panelItem } from "@/components/ui/panel";

// Brand colours appear only on hover, so the resting grid stays monochrome.
const ICONS: Record<string, { icon: IconType; color: string }> = {
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss, color: "#663399" },
  JavaScript: { icon: SiJavascript, color: "#E0B400" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  React: { icon: SiReact, color: "#149ECA" },
  "Next.js": { icon: SiNextdotjs, color: "currentColor" },
  Redux: { icon: SiRedux, color: "#764ABC" },
  Tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  Express: { icon: SiExpress, color: "currentColor" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  Python: { icon: SiPython, color: "#3776AB" },
  Java: { icon: SiOpenjdk, color: "#ED8B00" },
  NestJS: { icon: SiNestjs, color: "#E0234E" },
  Fastify: { icon: SiFastify, color: "currentColor" },
  GraphQL: { icon: SiGraphql, color: "#E10098" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088FF" },
  Jest: { icon: SiJest, color: "#C21325" },
  Strapi: { icon: SiStrapi, color: "#4945FF" },
  "C/C++": { icon: SiCplusplus, color: "#00599C" },
  Git: { icon: SiGit, color: "#F05032" },
  SEO: { icon: FiSearch, color: "rgb(var(--shu))" },
  WordPress: { icon: SiWordpress, color: "#21759B" },
  "Data Structures": { icon: TbBinaryTree, color: "rgb(var(--shu))" },
};

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  const { ref } = useSectionInView("Skills", 0.5);

  return (
    <Panel id="skills" title="Stack" glyph="S" sectionRef={ref} className="space-y-5">
      {skills.map((group) => (
        <m.div key={group.group} variants={panelItem} className="grid gap-2.5 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
          <h3 className="label pt-2">{group.group}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((skill) => {
              const entry = ICONS[skill];
              const Icon = entry?.icon;
              return (
                <li
                  key={skill}
                  style={{ "--brand": entry?.color ?? "currentColor" } as React.CSSProperties}
                  className="group flex cursor-default items-center gap-1.5 rounded-md border border-line/10 bg-card px-2.5 py-1.5 text-[0.82rem] text-ink-soft transition-all duration-300 ease-silk hover:-translate-y-0.5 hover:border-line/25 hover:text-ink"
                >
                  {Icon && (
                    <Icon
                      className="text-[0.9rem] transition-colors duration-300 group-hover:text-[var(--brand)]"
                      aria-hidden="true"
                    />
                  )}
                  {skill}
                </li>
              );
            })}
          </ul>
        </m.div>
      ))}
    </Panel>
  );
}
