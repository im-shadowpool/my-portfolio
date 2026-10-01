import clsx from "clsx";

/** Vermillion name seal (hanko) used as the site mark. */
const GRID = 6;
// Fixed, scattered delays (ms) so the pixels flicker in no particular order.
const DELAYS = Array.from({ length: GRID * GRID }, (_, i) => ((i * 37) % 23) * 18);

export default function Hanko({
  className,
  text = "SV",
  pixels = false,
}: {
  className?: string;
  text?: string;
  /** Adds a pixel-dissolve overlay that plays when an ancestor with the "group" class is hovered. */
  pixels?: boolean;
}) {
  return (
    <span
      className={clsx(
        "relative inline-flex select-none items-center justify-center rounded-[0.4rem] bg-shu font-display font-semibold leading-none text-paper",
        className,
      )}
      style={{
        boxShadow: "inset 0 0 0 2px rgb(var(--paper) / 0.9), inset 0 0 0 3.5px rgb(var(--shu))",
      }}
      aria-hidden="true"
    >
      {text}
      {pixels && (
        <span className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-6 overflow-hidden rounded-[inherit]">
          {DELAYS.map((delay, i) => (
            <span key={i} className="px-cell" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </span>
      )}
    </span>
  );
}
