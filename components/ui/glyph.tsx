import clsx from "clsx";

/*
  A section mark: one Latin letter set inside a small abstract vector shape.
  The shape is picked from the section id, so each section keeps its own mark.
*/

const SHAPES: React.ReactNode[] = [
  // Ring with a corner dot
  <g key="ring">
    <circle cx="12" cy="12" r="9.5" />
    <circle className="g-orbit" cx="19.5" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
  </g>,
  // Rotated square
  <g key="diamond">
    <g className="g-spin">
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
    </g>
  </g>,
  // Half-circle arch
  <g key="arch">
    <path className="g-draw" pathLength="1" d="M2.5 21.5 V12 A9.5 9.5 0 0 1 21.5 12 V21.5 Z" />
  </g>,
  // Square with a cut corner
  <g key="notch">
    <path className="g-pulse" d="M2.5 2.5 H15 L21.5 9 V21.5 H2.5 Z" />
  </g>,
  // Twin quarter arcs
  <g key="arcs">
    <g className="g-sweep">
      <path d="M2.5 21.5 A19 19 0 0 1 21.5 2.5" />
      <path d="M2.5 21.5 A10 10 0 0 1 12.5 11.5" />
    </g>
  </g>,
  // Triangle
  <g key="tri">
    <path className="g-hop-shape" d="M12 2.5 L21.5 21 H2.5 Z" />
  </g>,
];

const pick = (id: string) => [...id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % SHAPES.length;

export default function Glyph({
  id,
  letter,
  className,
}: {
  id: string;
  letter: string;
  className?: string;
}) {
  const triangle = pick(id) === SHAPES.length - 1;
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx("h-[1.7rem] w-[1.7rem] shrink-0 overflow-visible", className)}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity="0.7">
        {SHAPES[pick(id)]}
      </g>
      <text
        className={triangle ? "g-hop" : undefined}
        x="12"
        y={triangle ? 18 : 12.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={triangle ? 9.5 : 12}
        fontWeight="600"
        style={{ fontFamily: "var(--font-display), sans-serif" }}
      >
        {letter}
      </text>
    </svg>
  );
}
