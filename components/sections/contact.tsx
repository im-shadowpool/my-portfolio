"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { FiArrowUpRight, FiFileText, FiMail } from "react-icons/fi";
import { useSectionInView } from "@/lib/hooks";
import Panel, { panelItem } from "@/components/ui/panel";
import CopyEmail from "@/components/ui/copy-email";

export default function Contact({ email }: { email: string }) {
  const { ref } = useSectionInView("Contact", 0.6);

  return (
    <Panel id="contact" title="Contact" glyph="C" sectionRef={ref}>
      <m.p variants={panelItem} className="max-w-lg text-[0.93rem] leading-relaxed text-ink-soft">
        Open to full-time roles and freelance builds. Email is the fastest way to reach me. I
        usually reply within a day.
      </m.p>
      <m.div variants={panelItem} className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={`mailto:${email}`}
          className="group inline-flex items-center gap-2 rounded-md bg-ink px-3.5 py-2 text-[0.85rem] font-medium text-paper transition-transform duration-200 active:scale-[0.97]"
        >
          <FiMail />
          Say hello
          <FiArrowUpRight className="transition-transform duration-300 ease-silk group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <Link
          href="/resume"
          className="group inline-flex items-center gap-2 rounded-md border border-line/15 bg-card px-3.5 py-2 text-[0.85rem] text-ink transition-colors hover:border-line/30 active:scale-[0.97]"
        >
          <FiFileText />
          Resume
        </Link>
        <span className="ml-1 font-mono text-[0.8rem] text-ink-soft">
          or copy <CopyEmail email={email} />
        </span>
      </m.div>
    </Panel>
  );
}
