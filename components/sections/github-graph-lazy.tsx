"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PackedPeriod } from "@/lib/github";

// The graph is ~400 small cells far below the fold. Loading it only when the
// visitor scrolls near keeps it out of the first load (less HTML, fewer
// elements to hydrate), which is what the page speed scores measure.
const GithubGraph = dynamic(() => import("./github-graph"), { ssr: false, loading: () => <Placeholder /> });

/** Holds the graph's space so nothing jumps when it arrives. */
function Placeholder() {
  return <div className="h-[210px] min-[480px]:h-[185px]" aria-hidden="true" />;
}

export default function GithubGraphLazy(props: { periods: PackedPeriod[]; username: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{near ? <GithubGraph {...props} /> : <Placeholder />}</div>;
}
