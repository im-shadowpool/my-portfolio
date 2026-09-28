"use client";

import { LazyMotion } from "framer-motion";

// Animation components on the site are the lightweight `m.*` ones; the engine
// that actually animates them (including shared-layout animations, used by the
// nav underline) arrives in its own chunk after the first paint, so it never
// holds up the page appearing. `strict` flags any full `motion.*` component,
// which would pull the whole engine back into the first load.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
