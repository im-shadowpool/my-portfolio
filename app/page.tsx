import Intro from "@/components/sections/intro";
import SectionDivider from "@/components/ui/section-divider";
import About from "@/components/sections/about";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Experience from "@/components/sections/experience";
import Contact from "@/components/sections/contact";

import introData from "@/data/intro.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import experienceData from "@/data/experience.json";
import contactData from "@/data/contact.json";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Intro socialLinks={introData.socialLinks} />
      <SectionDivider />
      <About />
      <Projects projects={projectsData} />
      <Skills skills={skillsData} />
      <Experience experiences={experienceData} />
      <Contact contactEmail={contactData.contactEmail} />
    </main>
  );
}
