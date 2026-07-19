"use client";

import React from "react";
import SectionHeading from "@/components/ui/section-heading";
import { ProjectProps } from "./project";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";

export default function Projects({ projects }: { projects: ProjectProps[] }) {
  const { ref } = useSectionInView("Projects", 0.2);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
