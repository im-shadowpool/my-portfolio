import Intro from "@/components/sections/intro";
import About from "@/components/sections/about";
import Now from "@/components/sections/now";
import GithubGraph from "@/components/sections/github-graph-lazy";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Contact from "@/components/sections/contact";
import Panel, { WaveBreak } from "@/components/ui/panel";
import { getContributionHistory, packPeriod } from "@/lib/github";

import introData from "@/data/intro.json";
import aboutData from "@/data/about.json";
import nowData from "@/data/now.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import experienceData from "@/data/experience.json";
import contactData from "@/data/contact.json";

export default async function Home() {
  const contributions = await getContributionHistory(introData.githubUsername);

  return (
    <main id="main">
      <div className="mx-auto max-w-column pb-10">
        <Intro intro={introData} about={aboutData} email={contactData.contactEmail} />
        <About about={aboutData} />
        <WaveBreak />
        <Now now={nowData} />
        <WaveBreak />
        {contributions.length > 0 && (
          <>
            <Panel id="github" title="GitHub" kanji="記録">
              <GithubGraph periods={contributions.map(packPeriod)} username={introData.githubUsername} />
            </Panel>
            <WaveBreak />
          </>
        )}
        <Experience experiences={experienceData} />
        <WaveBreak />
        <Projects projects={projectsData} githubUrl={introData.socialLinks.githubUrl} />
        <WaveBreak />
        <Skills skills={skillsData} />
        <WaveBreak />
        <Contact email={contactData.contactEmail} />
      </div>
    </main>
  );
}
