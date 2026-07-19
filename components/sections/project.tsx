"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";

export interface ProjectProps {
  title: string;
  description: string;
  tags: string[] | readonly string[];
  imageUrl: string;
  url: string;
  repo: string;
  year: string;
}

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  url,
  repo,
  year,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-gray-100 max-w-[46rem] border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="pt-4 pb-8 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col sm:min-h-[22rem] sm:group-even:ml-[21rem]">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <span className="text-xs bg-black/[0.05] dark:bg-white/10 px-2.5 py-0.5 rounded-full text-gray-600 dark:text-gray-300 font-medium">
              {year}
            </span>
          </div>
          <p className="mt-2 leading-relaxed text-muted">
            {description}
          </p>
          <div className="flex gap-5 my-4 text-[0.85rem]">
            <a 
              href={url}
              target="_blank"
              className="text-gray-700 hover:text-gray-950 dark:text-white/70 dark:hover:text-white flex items-center gap-1 transition-all outline-none border-b border-transparent hover:border-gray-950 dark:hover:border-white font-medium"
            >
              <span>Live Demo</span>
              <FiExternalLink className="text-[0.75rem]" />
            </a>
            <a 
              href={repo}
              target="_blank"
              className="text-gray-700 hover:text-gray-950 dark:text-white/70 dark:hover:text-white flex items-center gap-1 transition-all outline-none border-b border-transparent hover:border-gray-950 dark:hover:border-white font-medium"
            >
              <span>GitHub</span>
              <FiGithub className="text-[0.75rem]" />
            </a>
          </div>

        
          <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <Image
          src={imageUrl}
          alt="Project I worked on"
          width={560}
          height={350}
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
        transition transform duration-300 ease-in-out
        group-hover:scale-[1.04]
        group-hover:-translate-x-3
        group-hover:translate-y-3
        group-hover:-rotate-2

        group-even:group-hover:translate-x-3
        group-even:group-hover:translate-y-3
        group-even:group-hover:rotate-2

        group-even:right-[initial] group-even:-left-40"
        />
      </section>
    </motion.div>
  );
}
