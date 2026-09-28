"use client";

import { AnimatePresence, m } from "framer-motion";
import type { Season } from "@/lib/season";
import { MOMIJI, SAKURA, TSUBAKI } from "@/lib/shapes";

// Where blossoms / leaves sit, in the SVG's 320×170 space (twig tips and along the limb).
const SPOTS: [number, number][] = [
  [108, 2], [146, 78], [214, 24], [216, 94], [44, 58], [266, 72],
  [88, 16], [178, 46], [238, 62], [128, 28], [62, 22], [198, 40],
];

const MAPLE_D =
  "M-0.15 0.26 L-0.89 0.33 L-0.41 0.06 L-0.82 -0.57 L-0.19 -0.41 L0 -1.15 L0.19 -0.41 L0.82 -0.57 L0.41 0.06 L0.89 0.33 L0.15 0.26 L0.06 0.95 L-0.06 0.95 Z";

function Blossom({ i }: { i: number }) {
  const fill = SAKURA[i % SAKURA.length];
  return (
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-3.2" rx="2.6" ry="3.4" fill={fill} stroke="#E08DA3" strokeWidth="0.35" transform={`rotate(${deg + i * 11})`} />
      ))}
      <circle r="1.3" fill="#C4506F" />
    </g>
  );
}

function Leaves({ i }: { i: number }) {
  return (
    <g>
      {[-35, 25, 80].map((deg, j) => (
        <ellipse
          key={deg}
          cx="5"
          cy="0"
          rx="6.5"
          ry="2.6"
          fill={j === 1 ? "#7FAE6E" : "#5E8F5A"}
          transform={`rotate(${deg + i * 17})`}
        />
      ))}
    </g>
  );
}

/** Winter camellia (tsubaki): a red bloom with gold stamens and two glossy leaves. */
function Camellia({ i }: { i: number }) {
  const red = TSUBAKI[i % TSUBAKI.length];
  return (
    <g transform={`rotate(${i * 37})`}>
      <ellipse cx="7" cy="1" rx="6" ry="2.4" fill="#2F5A3C" transform="rotate(-25)" />
      <ellipse cx="-6" cy="2" rx="5.5" ry="2.2" fill="#3A6B47" transform="rotate(20)" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx="0" cy="-2.6" r="2.9" fill={red} transform={`rotate(${deg})`} />
      ))}
      <circle r="1.6" fill="#F4C542" />
      {/* A cap of snow on top */}
      <ellipse cx="-0.5" cy="-4.6" rx="3.6" ry="1.3" fill="#FBFCFE" />
    </g>
  );
}

function Momiji({ i }: { i: number }) {
  return (
    <g>
      <path d={MAPLE_D} fill={MOMIJI[i % MOMIJI.length]} transform={`rotate(${i * 29}) scale(6)`} />
      <path d={MAPLE_D} fill={MOMIJI[(i + 1) % MOMIJI.length]} transform={`translate(6 4) rotate(${i * 29 + 70}) scale(4.5)`} />
    </g>
  );
}

/**
 * An ink-brush branch reaching over the pond from the top-left corner. Its
 * foliage follows the season; brushing past it shakes something loose.
 */
export default function Branch({
  season,
  onShake,
}: {
  season: Season | null;
  onShake: (clientX: number, clientY: number) => void;
}) {
  const shake = (event: React.PointerEvent<SVGGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onShake(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <svg
      viewBox="-12 -12 332 150"
      className="pointer-events-none absolute left-0 top-0 w-[48%] max-w-[330px] overflow-visible"
      aria-hidden="true"
    >
      <g className="branch-sway">
        {/* Limb and twigs, brushed in ink */}
        <g fill="rgb(var(--ink) / 0.82)" stroke="rgb(var(--ink) / 0.82)" strokeLinecap="round">
          <path
            d="M-12 8 C60 6 130 20 200 42 C230 52 252 60 268 71 C250 65 226 58 198 50 C128 30 60 20 -12 24 Z"
            stroke="none"
          />
          <path d="M70 17 C84 7 96 3 108 2" fill="none" strokeWidth="2" />
          <path d="M120 28 C132 44 140 60 146 78" fill="none" strokeWidth="1.8" />
          <path d="M170 41 C184 30 200 26 214 24" fill="none" strokeWidth="1.7" />
          <path d="M205 51 C214 66 218 80 216 94" fill="none" strokeWidth="1.4" />
          <path d="M40 20 C46 34 48 46 44 58" fill="none" strokeWidth="1.6" />
        </g>

        {season === "winter" && (
          <g fill="none" stroke="#FBFCFE" strokeLinecap="round">
            <path d="M-12 7 C60 5 130 19 200 41 C230 51 252 59 266 69" strokeWidth="2.6" style={{ filter: "drop-shadow(0 1px 0 rgb(120 140 160 / 0.45))" }} />
            {SPOTS.slice(0, 6).map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y - 1} r="2.2" fill="#FBFCFE" stroke="none" />
            ))}
          </g>
        )}
        {season === "winter" &&
          [SPOTS[0], SPOTS[2], SPOTS[4], SPOTS[7]].map(([x, y], i) => (
            <g key={`camellia-${i}`} transform={`translate(${x} ${y})`}>
              <Camellia i={i} />
            </g>
          ))}

        <AnimatePresence>
          {season &&
            season !== "winter" &&
            SPOTS.map(([x, y], i) => (
              <m.g
                key={`${season}-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.03 * i, type: "spring", stiffness: 260, damping: 18 }}
                style={{ x, y, pointerEvents: "visiblePainted", cursor: "grab" }}
                whileHover={{ rotate: [0, -14, 10, -5, 0], transition: { duration: 0.6 } }}
                onPointerEnter={shake}
              >
                {season === "spring" && <Blossom i={i} />}
                {season === "summer" && <Leaves i={i} />}
                {season === "autumn" && <Momiji i={i} />}
              </m.g>
            ))}
        </AnimatePresence>

        {/* In winter the limb itself sheds snow when brushed. */}
        {season === "winter" && (
          <path
            d="M-12 8 C60 6 130 20 200 42 C230 52 252 60 268 71 C250 65 226 58 198 50 C128 30 60 20 -12 24 Z"
            fill="transparent"
            style={{ pointerEvents: "visiblePainted" }}
            onPointerMove={(e) => onShake(e.clientX, e.clientY)}
          />
        )}
      </g>
    </svg>
  );
}
