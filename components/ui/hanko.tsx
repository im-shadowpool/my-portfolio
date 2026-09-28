import clsx from "clsx";

/** Vermillion name seal (hanko) used as the site mark. */
export default function Hanko({
  className,
  text = "SV",
}: {
  className?: string;
  text?: string;
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
    </span>
  );
}
