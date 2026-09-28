import Seigaiha from "@/components/ui/seigaiha";

/*
  The koi pond's frame: water colour, wave pattern and whatever sits on top
  (the signature). It renders straight away with the page, while the living
  pond (fish, water physics, chatter) loads once the page is idle and takes
  its place, same size, so nothing moves.
*/

export const POND_CLASS = "group/pond dots-b relative h-40 cursor-crosshair overflow-hidden sm:h-48";
export const POND_STYLE = { backgroundColor: "rgb(var(--water))", boxShadow: "inset 0 0 40px rgb(var(--line) / 0.06)" };

export const PondWaves = () => <Seigaiha scale={1.1} fill="rgb(var(--water))" stroke="rgb(var(--line) / 0.07)" />;

export default function PondShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className={POND_CLASS} style={POND_STYLE}>
      <PondWaves />
      {children}
    </div>
  );
}
