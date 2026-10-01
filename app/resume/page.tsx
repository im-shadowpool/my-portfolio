import Link from "next/link";
import type { Metadata } from "next";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";

import introData from "@/data/intro.json";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Saipavan Veeravalli: full-stack engineer with 3+ years of experience. Work experience, skills, projects and education.",
  alternates: { canonical: "https://devshadow.space/resume" },
};

/* The page mirrors resume.tex line for line: same sections, same wording. */

const SERIF = '"Latin Modern Roman", "CMU Serif", "Computer Modern", Georgia, "Times New Roman", serif';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-1.5 border-b border-ink pb-0.5 text-[1.2rem] font-bold leading-tight">{title}</h2>
      {children}
    </section>
  );
}

function Heading({ title, right, sub, subRight }: { title: string; right: string; sub: string; subRight: string }) {
  return (
    <div className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-bold">{title}</span>
        <span>{right}</span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 italic">
        <span>{sub}</span>
        <span>{subRight}</span>
      </div>
    </div>
  );
}

function Items({ children }: { children: React.ReactNode }) {
  return <ul className="mb-2 mt-1 list-disc space-y-1 pl-5 marker:text-ink">{children}</ul>;
}

function Tech({ children }: { children: React.ReactNode }) {
  return <p className="italic">{children}</p>;
}

const link = "underline decoration-1 underline-offset-2";

export default function Resume() {
  const { socialLinks } = introData;

  return (
    <main id="main">
      <div className="mx-auto max-w-[56rem] px-4 pb-10">
        {/* Toolbar: screen only */}
        <div className="flex flex-wrap items-center gap-2 py-5 print:hidden">
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

        {/* The sheet: serif résumé layout that follows the light/dark theme */}
        <article
          className="rounded-sm border border-dotted border-line/30 bg-paper px-6 py-8 text-[0.92rem] leading-[1.45] text-ink sm:px-12 sm:py-10"
          style={{ fontFamily: SERIF }}
        >
          <header className="text-center">
            <h1 className="text-[1.9rem] font-bold leading-tight sm:text-[2.2rem]">Saipavan Veeravalli</h1>
            <p className="mt-1 text-[0.82rem]">
              <a href="tel:+918317687898" className={link}>+91 83176 87898</a>
              {" | "}
              <a href="mailto:v.saipavan2001@gmail.com" className={link}>v.saipavan2001@gmail.com</a>
              {" | "}
              <a href="https://devshadow.vercel.app/" className={link}>Portfolio</a>
              {" | "}
              <a href="https://www.linkedin.com/in/saipavan-veeravalli/" className={link}>LinkedIn</a>
              {" | "}
              <a href="https://github.com/im-shadowpool" className={link}>GitHub</a>
            </p>
            <p className="mt-3 text-[0.82rem]">
              Full-stack engineer with 3+ years of experience, and 2+ years of freelancing. Passionate on building AI
              agents/workflows and MCPs.
            </p>
          </header>

          <Section title="Work Experience">
            <Heading title="Full Stack Developer" right="Dec 2024 – Present" sub="Elephant in the Boardroom" subRight="Chennai" />
            <Items>
              <li>
                Built <b>WordPress and backend services</b> using <b>PHP and Java</b> across multiple environments.
                Handled plugin and theme development, API optimizations, and implemented{" "}
                <b>CI/CD pipelines with Docker</b> containerization.
              </li>
              <li>
                Developed <b>full-stack e-commerce platforms</b> with Next.js and Node.js (Fastify). Implemented{" "}
                <b>GraphQL APIs and vector DBs</b>, integrated CMS platforms (Strapi, Payload), and developed{" "}
                <b>AI-powered product features</b>.
              </li>
            </Items>

            <Heading title="Web Developer" right="Mar 2024 – Dec 2024" sub="Juzgrow.com" subRight="Remote" />
            <Items>
              <li>
                Developed and maintained custom web applications and <b>admin dashboards</b> for GCC region clients,
                managing requirements and project delivery. Implemented <b>database design</b> and{" "}
                <b>performance optimization</b>.
              </li>
              <li>
                Integrated third-party tools via webhooks to automate client workflows. Built{" "}
                <b>automated testing pipelines</b>, deployed on <b>cloud infrastructure</b> and maintained{" "}
                <b>monitoring and logging</b>.
              </li>
            </Items>

            <Heading title="Node.js Developer Intern" right="Dec 2023 – Mar 2024" sub="Mindwave Solutions" subRight="Hyderabad" />
            <Items>
              <li>
                Developed Node.js payment authentication APIs with asynchronous request handling and middleware
                patterns. Implemented error handling, request validation, and non-blocking database operations for
                secure transactions.
              </li>
            </Items>
          </Section>

          <Section title="Technical Skills">
            <p>
              <b>Languages:</b> JavaScript, TypeScript, Python, Java, C/C++
            </p>
            <p className="mt-0.5">
              <b>Frontend &amp; Full-Stack:</b> React.js, Next.js, Tailwind CSS, Node.js, NestJS, Fastify, Express.js
            </p>
            <p className="mt-0.5">
              <b>Tools:</b> PostgreSQL, MySQL, MongoDB, Docker, AWS, GitHub Actions, Jest, GraphQL, WordPress, Strapi
            </p>
          </Section>

          <Section title="Projects">
            <div className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-bold">BugRadar – AI-Assisted Bug Tracking &amp; Client Feedback SaaS</span>
                <a href="http://bugrader.site/" className={link}>Live</a>
              </div>
              <Tech>Next.js, TypeScript, NestJS, Fastify, PostgreSQL, Prisma, Socket.IO</Tech>
            </div>
            <Items>
              <li>
                Built a full-stack SaaS MVP with a <b>website widget and extension</b> for QA teams and clients to
                capture feedback and log issues directly to BugRadar. Supports <b>different staging environments</b>{" "}
                with email notifications, team management, and project management all in one place.
              </li>
              <li>
                Trained an <b>AI model</b> to analyze bug reports and screenshots, generating clearer titles, priority
                levels, and debugging hints for developers, reducing setup time by <b>up to 40%</b>. Implemented
                confidence scoring and intelligent fallback to maintain high report quality across all submissions.
              </li>
              <li>
                Built <b>real-time collaboration</b> features with <b>role-based access control</b> for QA,
                developers, managers, and client-specific roles. Integrated <b>Cloudflare R2</b> for attachment
                storage and <b>multi-organization</b> support.
              </li>
            </Items>

            <div className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-bold">CompressByURL – Image Optimization Platform</span>
                <span>
                  <a href="https://github.com/im-shadowpool/compressbyurl" className={link}>GitHub</a>
                  {" | "}
                  <a href="https://compressbyurl.com/" className={link}>Live</a>
                </span>
              </div>
              <Tech>Next.js, React, TypeScript, Web Workers, WebAssembly, Node.js, MCP, Sharp</Tech>
            </div>
            <Items>
              <li>
                Built a <b>browser-first image compression</b> tool that helps developers speed up webpages by
                scanning and compressing all images in one operation with <b>real-time page speed metrics</b> and
                compression results.
              </li>
              <li>
                Implemented <b>Web Workers and WebAssembly</b> to handle compression locally in the browser without
                sending files to the server. Built <b>target-size optimization</b>, webpage scanning, and{" "}
                <b>batch processing</b> with presets.
              </li>
              <li>
                Published an <b>MCP server</b> (compressbyurl-mcp on npm) enabling AI agents and developers to
                automate image optimization in workflows. Supports auditing up to <b>1,000 images per run</b> with
                optimization plans, <b>image-size budgets in CI/CD pipelines</b>, and processes everything locally.
              </li>
            </Items>
          </Section>

          <Section title="Education">
            <Heading
              title="Jawaharlal Nehru Technological University Hyderabad"
              right="Aug 2019 – Sep 2023"
              sub="Bachelor of Technology in Computer Science | GPA: 7.0/10.0"
              subRight="Hyderabad, Telangana"
            />
          </Section>
        </article>
      </div>
    </main>
  );
}
