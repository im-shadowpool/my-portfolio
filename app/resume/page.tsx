import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import Hanko from "@/components/ui/hanko";
import type { ExperienceItem } from "@/lib/types";

import introData from "@/data/intro.json";
import aboutData from "@/data/about.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import experienceData from "@/data/experience.json";
import contactData from "@/data/contact.json";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Résumé of Saipavan Veeravalli — full-stack developer and SEO specialist. Experience, projects, skills and education.",
  alternates: { canonical: "https://devshadow.space/resume" },
};

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({ title, kanji, children }: { title: string; kanji: string; children: React.ReactNode }) {
  return (
    <section className="dots-t px-6 py-5 sm:px-8.5">
      <h2 className="mb-3 flex items-baseline gap-2.5 break-after-avoid">
        <span className="font-display text-[1.15rem] font-semibold tracking-tight text-shu">{title}</span>
        <span className="font-display text-[0.8rem] text-ink-faint" lang="ja" aria-hidden="true">
          {kanji}
        </span>
      </h2>
      {children}
    </section>
  );
}

function Entry({ item }: { item: ExperienceItem }) {
  return (
    <li className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[0.95rem] font-medium text-ink">
          {item.title} <span className="font-normal text-ink-faint">·</span>{" "}
          <span className="font-normal text-ink-soft">{item.location}</span>
        </h3>
        <span className="font-mono text-[0.72rem] text-ink-faint">{item.date}</span>
      </div>
      <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-soft">{item.description}</p>
    </li>
  );
}

export default function Resume() {
  const { socialLinks } = introData;
  const work = experienceData.filter((item) => item.icon !== "education");
  const education = experienceData.filter((item) => item.icon === "education");

  const contacts = [
    { label: contactData.contactEmail, href: `mailto:${contactData.contactEmail}` },
    { label: introData.website, href: `https://${introData.website}` },
    { label: bare(socialLinks.linkedinUrl), href: socialLinks.linkedinUrl },
    { label: bare(socialLinks.githubUrl), href: socialLinks.githubUrl },
  ];

  return (
    <main id="main">
      <div className="mx-auto max-w-column px-4 pb-10">
        {/* Toolbar: screen only */}
        <div className="flex flex-wrap items-center gap-2 py-5">
          <Link
            href="/"
            className="group mr-auto inline-flex items-center gap-1.5 text-[0.84rem] text-ink-soft transition-colors hover:text-ink"
          >
            <FiArrowLeft
              className="transition-transform duration-300 ease-silk group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span className="link-line">Back home</span>
          </Link>
          <a
            href={socialLinks.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-line/15 bg-card px-3.5 py-2 text-[0.85rem] text-ink transition-colors hover:border-line/30 active:scale-[0.97]"
          >
            <FiExternalLink aria-hidden="true" />
            Original PDF
          </a>
        </div>

        {/* The sheet itself */}
        <article className="overflow-hidden rounded-xl border border-dotted border-line/30 bg-paper">
          <div className="flex items-start gap-5 px-6 pb-6 pt-7 sm:px-8">
            <Hanko className="h-14 w-14 shrink-0 -rotate-3 text-lg sm:h-16 sm:w-16 sm:text-xl" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[1.8rem] font-medium leading-tight tracking-tight sm:text-[2.2rem]">
                {introData.name}
              </h1>
              <p className="mt-1 font-mono text-[0.78rem] text-ink-soft">{introData.roles.join(" · ")}</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.74rem] text-ink-soft">
                <li>{introData.location}</li>
                {contacts.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} className="link-line hover:text-ink">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <span
              className="tategaki hidden shrink-0 font-display text-[0.95rem] tracking-[0.35em] text-ink-faint sm:block"
              lang="ja"
              aria-hidden="true"
            >
              履歴書
            </span>
          </div>

          <Section title="Summary" kanji="要約">
            <p className="text-[0.9rem] leading-relaxed text-ink-soft">
              {introData.tagline} Currently {aboutData.currently.role} at {aboutData.currently.company}, going
              deep on {aboutData.learning[0]} and {aboutData.learning[1].toLowerCase()}; GATE qualified. Proudest
              fix so far: cutting a client site&apos;s load time from {aboutData.stat.from}
              {aboutData.stat.unit} to {aboutData.stat.to}
              {aboutData.stat.unit}.
            </p>
          </Section>

          <Section title="Experience" kanji="経歴">
            <ul className="space-y-4">
              {work.map((item) => (
                <Entry key={item.title} item={item} />
              ))}
            </ul>
          </Section>

          <Section title="Projects" kanji="作品">
            <ul className="space-y-3">
              {projectsData.map((project) => (
                <li key={project.title} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[0.92rem] font-medium text-ink">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="link-line">
                        {project.title}
                      </a>{" "}
                      <span className="font-mono text-[0.72rem] font-normal text-ink-faint">{project.year}</span>
                    </h3>
                    <span className="font-mono text-[0.7rem] text-ink-faint">{project.tags.join(" · ")}</span>
                  </div>
                  <p className="mt-0.5 text-[0.84rem] leading-relaxed text-ink-soft">{project.description}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Skills" kanji="技能">
            <dl className="grid gap-y-1.5 text-[0.86rem] sm:grid-cols-[6rem_1fr]">
              {skillsData.map((group) => (
                <div key={group.group} className="contents">
                  <dt className="label pt-[0.2rem]">{group.group}</dt>
                  <dd className="text-ink max-sm:mb-1.5">{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Education" kanji="学歴">
            <ul className="space-y-3">
              {education.map((item) => (
                <Entry key={item.title} item={item} />
              ))}
            </ul>
          </Section>
        </article>
      </div>
    </main>
  );
}
