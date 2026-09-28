import clsx from "clsx";
import { useId } from "react";

const RINGS = [20, 15, 10, 5];

// Rows are painted top to bottom inside every tile so lower waves overlap
// the ones above — that overlap is what makes seigaiha read as waves.
const CENTRES: [number, number][] = [
  [0, -10], [40, -10],
  [20, 0],
  [0, 10], [40, 10],
  [20, 20],
  [0, 30], [40, 30],
  [20, 40],
];

/** Seigaiha (blue ocean wave) pattern that fills its positioned parent. */
export default function Seigaiha({
  className,
  stroke = "rgb(var(--line) / 0.14)",
  fill = "rgb(var(--paper))",
  scale = 1,
}: {
  className?: string;
  stroke?: string;
  fill?: string;
  scale?: number;
}) {
  const id = `seigaiha-${useId().replace(/:/g, "")}`;

  return (
    <svg className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true">
      <defs>
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          {CENTRES.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r={20} fill={fill} />
              {RINGS.map((r) => (
                <circle key={r} cx={cx} cy={cy} r={r - 0.6} fill="none" stroke={stroke} strokeWidth="0.6" />
              ))}
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
