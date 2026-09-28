"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCode,
  FiFileText,
  FiGlobe,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { FaCodepen } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { useSectionInView } from "@/lib/hooks";
import type { AboutData, IntroData } from "@/lib/types";
import { externalProps, socialLinksFrom } from "@/lib/links";
import KoiPond from "@/components/seasons/koi-pond";
import FlipText from "@/components/ui/flip-text";
import CopyEmail from "@/components/ui/copy-email";
import PixelAvatar from "@/components/ui/pixel-avatar";
import Doodle from "@/components/ui/doodle";

const EASE = [0.16, 1, 0.3, 1] as const;
const MotionLink = motion.create(Link);
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const rise = (i: number) => ({
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: EASE, delay: 0.08 * i },
});

function OverviewItem({
  icon: Icon,
  children,
  truncate = true,
}: {
  icon: IconType;
  children: React.ReactNode;
  /** Off for rows with a popover (the copy stamp) that must not be clipped. */
  truncate?: boolean;
}) {
  return (
    <li className="flex min-w-0 items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line/10 bg-card text-ink-soft">
        <Icon className="text-[0.85rem]" aria-hidden="true" />
      </span>
      <span className={clsx("min-w-0 font-mono text-[0.82rem] text-ink", truncate && "truncate")}>{children}</span>
    </li>
  );
}

export default function Intro({
  intro,
  about,
  email,
}: {
  intro: IntroData;
  about: AboutData;
  email: string;
}) {
  const { ref } = useSectionInView("Home", 0.4);
  const socials = socialLinksFrom(intro.socialLinks);

  // Gossip the koi share about the site's owner.
  const first = intro.name.split(" ")[0];
  const pondFacts = [
    `fun fact: ${first} cut a site's load time from ${about.stat.from}${about.stat.unit} to ${about.stat.to}${about.stat.unit}`,
    `${first} is ${about.currently.role} at ${about.currently.company}`,
    `${first} is learning ${about.learning[0]} rn`,
    `psst… ${first} is open to work 👀`,
    `${first} once ran five blogs at the same time`,
    `${first} qualified GATE, btw`,
    `${first}'s reading ${about.offscreen.reading}. i'm reading the water.`,
    `${first} plays ${about.offscreen.hobbies[0].toLowerCase()}. i play hide and seek.`,
    `${first}'s email is right below us 👇`,
  ];

  return (
    <section id="home" ref={ref} aria-label="Profile">
      {/* Cover: a living koi pond under a seasonal branch, with notes in the margins */}
      <div className="relative">
        <KoiPond facts={pondFacts}>
          {/* The painter's vertical signature */}
          <div
            className="pointer-events-none absolute right-3 top-3 rounded-sm bg-paper/85 px-1 py-1.5 backdrop-blur-sm sm:right-4"
          >
            <span className="tategaki font-display text-[0.68rem] leading-none tracking-[0.12em] text-ink" lang="ja">
              ものづくり
            </span>
          </div>
        </KoiPond>
        <Doodle side="left" className="top-2">
          brush the branch
        </Doodle>
        <Doodle side="right" arrow="up" className="top-16">
          click the water to feed
          <br />
          drag to shoo the koi
        </Doodle>
      </div>

      {/* Name row: photo, name and role sit on one centred line */}
      <div className="dots-b flex items-center gap-4 px-4 py-5 sm:gap-5">
        <motion.div className="shrink-0" {...rise(0)}>
          <div className="h-20 w-20 overflow-hidden rounded-2xl border border-line/15 bg-paper p-1 sm:h-24 sm:w-24">
            <PixelAvatar
              photo={intro.avatar}
              twin={intro.avatarTwin}
              label={`Portrait of ${intro.name}. Click to switch between the photo and an illustrated version.`}
            />
          </div>
        </motion.div>

        <div className="min-w-0 flex-1">
          <motion.h1
            id="intro-name"
            className="font-display text-[1.6rem] font-medium leading-tight tracking-tight sm:text-[2.2rem]"
            {...rise(1)}
          >
            {intro.name}
          </motion.h1>
          <motion.p className="mt-1 font-mono text-[0.8rem] text-ink-soft" {...rise(2)}>
            <FlipText items={intro.roles} />
          </motion.p>
          <MotionLink
            href="/resume"
            className="group mt-2 inline-flex items-center gap-1.5 text-[0.8rem] text-ink-soft transition-colors hover:text-ink sm:hidden"
            {...rise(3)}
          >
            <FiFileText aria-hidden="true" />
            <span className="link-line">Résumé</span>
            <FiArrowUpRight aria-hidden="true" />
          </MotionLink>
        </div>

        <MotionLink
          href="/resume"
          className="group hidden shrink-0 items-center gap-2 rounded-md border border-line/15 bg-card px-3.5 py-2 text-[0.84rem] text-ink transition-colors hover:border-line/30 active:scale-[0.97] sm:inline-flex"
          {...rise(3)}
        >
          <FiFileText aria-hidden="true" />
          Résumé
          <FiArrowUpRight
            className="transition-transform duration-300 ease-silk group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </MotionLink>
      </div>

      {/* Tagline */}
      <motion.p className="dots-b px-4 py-4 text-[0.95rem] leading-relaxed text-ink-soft" {...rise(4)}>
        {intro.tagline}
      </motion.p>

      {/* Overview */}
      <motion.ul
        className="dots-b grid gap-3 px-4 py-5 sm:grid-cols-2 sm:gap-x-6"
        aria-label="Overview"
        {...rise(5)}
      >
        <OverviewItem icon={FiCode}>
          {about.currently.role} <span className="text-ink-faint">@</span>
          {about.currently.company}
        </OverviewItem>
        <OverviewItem icon={FiBookOpen}>Learning {about.learning[0]}</OverviewItem>
        <OverviewItem icon={FiMapPin}>{intro.location}</OverviewItem>
        <OverviewItem icon={FaCodepen}>
          <a
            href={intro.socialLinks.codepenUrl}
            {...externalProps(intro.socialLinks.codepenUrl)}
            className="link-line transition-colors hover:text-shu"
          >
            {bare(intro.socialLinks.codepenUrl)}
          </a>
        </OverviewItem>
        <OverviewItem icon={FiMail} truncate={false}>
          <CopyEmail email={email} />
        </OverviewItem>
        <OverviewItem icon={FiGlobe}>{intro.website}</OverviewItem>
      </motion.ul>

      {/* Social links */}
      <div className="relative">
        <Doodle side="left" arrow="down" className="-top-7">
          follow me
        </Doodle>
      </div>
      <motion.ul className="dots-b grid grid-cols-2 sm:grid-cols-4" aria-label="Links" {...rise(6)}>
        {socials.map(({ label, href, icon: Icon }, i) => (
          <li
            key={label}
            className={clsx(
              "border-dotted border-line/25",
              i % 2 === 0 && "border-r",
              i === 1 && "sm:border-r",
              i === 2 && "sm:border-r",
              i < 2 && "max-sm:border-b",
            )}
          >
            <a
              href={href}
              {...externalProps(href)}
              className="group flex items-center gap-2.5 px-4 py-3.5 text-[0.88rem] text-ink-soft transition-colors duration-300 hover:bg-card hover:text-ink"
            >
              <Icon className="text-[0.95rem]" aria-hidden="true" />
              {label}
              <FiArrowUpRight
                className="ml-auto text-ink-faint opacity-0 transition-all duration-300 ease-silk group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
