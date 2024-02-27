"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>

      <p className="mb-3">
        If you are reading this, I must value your time. In short, I have
        started developing{" "}
        <span className="font-medium">websites through WordPress</span>, and
        when I was taught about blogging, I started my{" "}
        <span className="font-medium">blogging journey</span>. I used to run
        more than <span className="italic">five websites</span> and write
        content every day, but in the end, it was a{" "}
        <span className="">failure</span>. The reason is multitasking. With my
        learnings, I have{" "}
        <span className="font-medium">mastered on-page SEO</span> and did my
        <span className="font-medium"> first internship at a startup</span> with
        my expertise in{" "}
        <span className="underline">SEO and digital marketing skills</span>.
        Along with this, I have started learning web development and started my
        first project with the <span className="italic">MERN stack</span>. After
        my graduation, I started preparing for the gate exam for Masters in
        India, and I qualified for the exam. In contrast, I started my
        development journey back,and learning in-depth of the backend with Java.
        and am <span className="font-medium text-green-600">open to work.</span>
      </p>

      <p>
        <span className="italic">When I'm not working</span>, I enjoy playing
        chess, watching movies. I also enjoy{" "}
        <span className="font-medium">reading books</span>. I am currently
        reading about{" "}
        <span className="font-medium">The Compound Effect by </span>
        <span className="italic">Darren Hardy</span> and my favourite book is{" "}
        <span className="font-medium">Eat that frog by</span>
        <span className="italic"> brian tracy.</span>
      </p>
    </motion.section>
  );
}
