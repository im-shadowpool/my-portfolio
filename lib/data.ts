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
    title: "Node.js Developer Intern",
    location: "Hyderabad",
    description:
      "Developed a RESTful API using Node.js and Express. Implemented features like authentication, authorization, and image upload. Learned about RESTful APIs, authentication, and authorization.",
    icon: React.createElement(CgWorkAlt),
    date: "March 2024 - Present",
    },

  {
    title: "Blogging",
    location: "Planspedia.com",
    description:
      "I write articles in my free time. I write about technology, programming. I also write about my experiences and the things I learn. I have written over 30 articles. I have a passion for writing and sharing my knowledge with others. I have a blog called planspedia.com.",
    icon: React.createElement(RiQuillPenFill),
    date: "November 2021 - January 2024",
  },
  {
    title: "Web development Intern",
    location: "Hyderabad",
    description:
    "Assisted organisations and clients in achieving first in Google rankings by applying SEO, Learned Various Cache Techniques and Back end Optimization to decrease website load time from 6.5 seconds to 0.98 seconds.",
    icon: React.createElement(CgWorkAlt),
    date: "March 2022 - May 2022",
  },
  {
    title: "B Tech in Computer Science Engineering",
    location: "Hyderabad",
    description:
      "I graduated from the Avanthi Institute of Engineering and Technology with a degree in computer science engineering. In my technical courses, I learned discrete mathematics, operating systems, database management systems, computer networks, and the analysis and design of algorithms.",
    icon: React.createElement(LuGraduationCap),
    date: "Augest 2019 - September 2023",
  },
] as const;

export const projectsData = [
  {
    title: "RiteBlog app",
    description:
      "A blog app where users can create, read, update and delete blog posts. It has features like authentication, authorization, and image upload.",
    tags: ["React", "MongoDB", "Tailwind", "Express", "Node.js", "Rest API"],
    imageUrl: riteblogImg,
    url: "https://riteblog.devshadow.live/",
    repo: "https://github.com/im-shadowpool/riteblogapp-project",
  },
  {
    title: "DealsTracker",
    description:
      "A web app to track deals and offers from amazon and flipkart. It has features like price tracking, price drop alerts, and price history. With Implementation of Web Scraping and Cron Jobs.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Web Scraping", "Cron Jobs", "MongoDB"],
    imageUrl: dealsTrackerImg,
    url: "http://dealstracker.devshadow.live/",
    repo: "https://github.com/im-shadowpool/dealstracker",
  },
  {
    title: "Memory Game",
    description: 'A Memory Game built with React. It has features like timer, score, and switching themes.',
    tags: ["React"],
    imageUrl: memorygameImg,
    url: "https://memory-game.devshadow.live/",
    repo: "https://github.com/im-shadowpool/memory-game",
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
  "MySQL",
  "SEO",
  "Wordpress",
  "C/C++",
  "Data Structures",

] as const;
