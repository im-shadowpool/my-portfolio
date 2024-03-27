"use client";

import { useRef } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TbLivePhoto } from "react-icons/tb";



type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  url,
  repo,
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
      <section className="bg-gray-100 max-w-[46rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative sm:h-[21rem] hover:bg-gray-200 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 sm:group-even:pr-2">
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[20rem] sm:group-even:pl-2 sm:group-even:max-w-[70%]">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <div className="my-4">
            <a 
            href={url}
            target="_blank"
            className="px-5 py-1.5 bg-slate-300 text-gray-700 rounded-s-full hover:text-gray-950 hover:bg-slate-300/90 hover:px-9 font-medium outline-none transition-all dark:bg-slate-800 dark:text-white/70 dark:hover:bg-slate-800/60">
            <TbLivePhoto className="inline-block mr-3 mb-0.5 items-center  animate-pulse  text-slate-600 text-sm dark:text-white/70"  />Live</a>
            <a 
            href={repo}
            target="_blank"
            className="px-5 py-1.5 border-l border-black/10 bg-slate-300 text-gray-700 rounded-e-full hover:text-gray-950 hover:bg-slate-300/90 hover:px-9 font-medium outline-none transition-all dark:bg-slate-800 dark:text-white/70 dark:hover:bg-slate-800/60 dark:border-white/10">Repo</a>
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
          quality={95}
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
