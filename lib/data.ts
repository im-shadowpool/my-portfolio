import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { LuGraduationCap } from "react-icons/lu";
import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";
import memorygameImg from "@/public/memorygame-project-snap.png";
import riteblogImg from "@/public/riteblog-project-snap.png";
import dealsTrackerImg from "@/public/dealstracker-project-snap.png";
import { RiQuillPenFill } from "react-icons/ri";


export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Blogging",
    location: "Planspedia.com",
    description:
      "I write articles in my free time. I write about technology, programming. I also write about my experiences and the things I learn. I have written over 30 articles. I have a passion for writing and sharing my knowledge with others. I have a blog called planspedia.com.",
    icon: React.createElement(RiQuillPenFill),
    date: "2021 - present",
  },
  {
    title: "Digital Marketing & Web development Intern",
    location: "Hyderabad",
    description:
    "Assisted organisations and clients in achieving first in Google rankings by applying SEO, Learned Various Cache Techniques and Back end Optimization to decrease website load time from 6.5 seconds to 0.98 seconds.",
    icon: React.createElement(CgWorkAlt),
    date: "2022 March - 2022 June",
  },
  {
    title: "B Tech in Computer Science Engineering",
    location: "Hyderabad",
    description:
      "I graduated from the Avanthi Institute of Engineering and Technology with a degree in computer science engineering. In my technical courses, I learned discrete mathematics, operating systems, database management systems, computer networks, and the analysis and design of algorithms.",
    icon: React.createElement(LuGraduationCap),
    date: "2019 - 2023",
  },
] as const;

export const projectsData = [
  {
    title: "RiteBlog app",
    description:
      "A blog app where users can create, read, update and delete blog posts. It has features like authentication, authorization, and image upload.",
    tags: ["React", "MongoDB", "Tailwind", "Express", "Node.js", "Rest API"],
    imageUrl: riteblogImg,
  },
  {
    title: "DealsTracker",
    description:
      "A web app to track deals and offers from amazon and flipkart. It has features like price tracking, price drop alerts, and price history. With Implementation of Web Scraping and Cron Jobs.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Web Scraping", "Cron Jobs", "MongoDB"],
    imageUrl: dealsTrackerImg,
  },
  {
    title: "Memory Game",
    description: 'A Memory Game built with React. It has features like timer, score, and switching themes.',
    tags: ["React"],
    imageUrl: memorygameImg,
  },
] as const;

export const skillsData = [

  'HTML',
  'CSS',
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "MongoDB",
  "Redux",
  "TypeScript",
  "Express",
  "Python",
  "SEO",
  "Wordpress",
  "C/C++",
  "Data Structures",

] as const;
