"use client";

import React from "react";
import { useTina } from "tinacms/dist/react";
import Intro from "./intro";
import SectionDivider from "@/components/ui/section-divider";
import About from "./about";
import Projects from "./projects";
import Skills from "./skills";
import Experience from "./experience";
import Contact from "./contact";

interface PortfolioPreviewProps {
  data: any;
  query: string;
  variables: any;
}

export default function PortfolioPreview(props: PortfolioPreviewProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const portfolio = data.portfolio;

  return (
    <main className="flex flex-col items-center px-4">
      <Intro socialLinks={portfolio.socialLinks} />
      <SectionDivider />
      <About />
      <Projects projects={portfolio.projects} />
      <Skills skills={portfolio.skills} />
      <Experience experiences={portfolio.experiences} />
      <Contact contactEmail={portfolio.contactEmail} />
    </main>
  );
}
