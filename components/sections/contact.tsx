"use client";

import React from "react";
import SectionHeading from "@/components/ui/section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "@/components/ui/submit-btn";
import toast from "react-hot-toast";

export default function Contact({ contactEmail }: { contactEmail: string }) {
  const { ref } = useSectionInView("Contact");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>Contact me</SectionHeading>

      <p className="text-muted -mt-6">
        Please contact me directly at{" "}
        <a className="underline" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>{" "}
        or through this form.
      </p>

      <form
        className="mt-10 flex flex-col"
        action={async (formData) => {
          const { data, error } = await sendEmail(formData);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success("Email sent successfully!");
        }}
      >
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label htmlFor="senderEmail" className="sr-only">
          Your email
        </label>
        <input
          className="h-14 px-4 rounded-lg borderBlack dark:bg-white/10 dark:text-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          id="senderEmail"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
          autoComplete="email"
        />
        <label htmlFor="message" className="sr-only">
          Your message
        </label>
        <textarea
          className="h-52 my-3 rounded-lg resize-none borderBlack p-4 dark:bg-white/10 dark:text-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
          id="message"
          name="message"
          placeholder="Your message"
          rows={8}
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
}
