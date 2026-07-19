"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/section-heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";
import { CgWorkAlt } from "react-icons/cg";
import { RiQuillPenFill } from "react-icons/ri";
import { LuGraduationCap } from "react-icons/lu";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "work":
      return React.createElement(CgWorkAlt);
    case "blog":
      return React.createElement(RiQuillPenFill);
    case "education":
      return React.createElement(LuGraduationCap);
    default:
      return React.createElement(CgWorkAlt);
  }
};

interface ExperienceItem {
  title: string;
  location: string;
  description: string;
  icon: string;
  date: string;
}

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      delay: 0.05 * index,
    },
  }),
};

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const { ref } = useSectionInView("Experience", .45);
  const { theme } = useTheme();

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>My experience</SectionHeading>
      <VerticalTimeline lineColor={theme === "light" ? "#e5e7eb" : "rgba(255, 255, 255, 0.2)"} animate={true}>
        {experiences.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              visible={true}
              contentStyle={{
                background:
                  theme === "light" ? "#f3f4f6" : "rgba(255, 255, 255, 0.05)",
                boxShadow: "none",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                textAlign: "left",
                padding: "1.3rem 2rem",
              }}
              contentArrowStyle={{
                borderRight:
                  theme === "light"
                    ? "0.4rem solid #9ca3af"
                    : "0.4rem solid rgba(255, 255, 255, 0.3)",
              }}
              date={item.date}
              icon={getIcon(item.icon)}
              iconStyle={{
                background:
                  theme === "light" ? "white" : "#343a47",
                fontSize: "1.5rem",
              }}
            >
              <motion.h3
                className="font-semibold capitalize"
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
                custom={index}
              >
                {item.title}
              </motion.h3>
              <motion.p
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
                custom={index}
                className="!font-medium !text-[15px] !mt-0"
              >
                {item.location}
              </motion.p>
              <motion.p
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{
                  once: true,
                }}
                custom={index}
                className="!mt-1 !font-normal text-muted"
              >
                {item.description}
              </motion.p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}
