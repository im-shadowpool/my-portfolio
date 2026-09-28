"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sound } from "@/lib/sound";

/*
  Portrait that swaps between the photo and its illustrated twin. The change
  plays like an old CRT game: the picture crunches into pixels, the grid turns
  row by row like a Rubik's cube face to reveal the other picture, then it
  sharpens back to a clear image. Little 8-bit blips (in the Japanese "in"
  scale) play along.
*/

const GRID = 6; // tiles per side while the cube turns
const DETAIL = GRID * 2; // pixels per side at the most crunched
const COARSEST = 40; // pixels per side as the crunch begins

// Timeline, in ms
const CRUNCH_END = 360;
const TURN_START = 360;
const ROW_GAP = 60;
const TILE_GAP = 14;
const TILE_TURN = 300;
const TURN_END = TURN_START + (GRID - 1) * ROW_GAP + (GRID - 1) * TILE_GAP + TILE_TURN;
const DONE = TURN_END + 420;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (t: number) => Math.min(1, Math.max(0, t));

/** Downsample an image to `n`×`n` pixels on a scratch canvas. */
function crunch(img: HTMLImageElement, n: number, into?: HTMLCanvasElement) {
  const c = into ?? document.createElement("canvas");
  c.width = n;
  c.height = n;
  const x = c.getContext("2d")!;
  x.imageSmoothingEnabled = true;
  x.drawImage(img, 0, 0, n, n);
  return c;
}

export default function PixelAvatar({
  photo,
  twin,
  label,
}: {
  photo: string;
  twin: string;
  /** Names the portrait and says it can be switched, for screen readers. */
  label: string;
}) {
  const reduced = useReducedMotion();
  const [showTwin, setShowTwin] = useState(false);
  const [playing, setPlaying] = useState(false);
  const photoRef = useRef<HTMLImageElement>(null);
  const twinRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const swap = () => {
    if (playing) return;
    const from = showTwin ? twinRef.current : photoRef.current;
    const to = showTwin ? photoRef.current : twinRef.current;
    const canvas = canvasRef.current;
    sound.pixelSwap({ rows: GRID, turnStart: TURN_START, rowGap: ROW_GAP, turnEnd: TURN_END }, Boolean(reduced));

    if (reduced || !from?.complete || !to?.complete || !canvas) {
      setShowTwin((v) => !v);
      return;
    }

    const size = canvas.getBoundingClientRect().width;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(size * dpr);
    canvas.width = W;
    canvas.height = W;
    const ctx = canvas.getContext("2d")!;
    const scratch = document.createElement("canvas");
    const fromSmall = crunch(from, DETAIL);
    const toSmall = crunch(to, DETAIL);
    const tile = W / GRID;
    const cell = DETAIL / GRID;

    /**
     * The picture at a given amount of pixelation: the clear image with a
     * blocky copy faded over it. At 0 it is exactly the clear image, so the
     * canvas takes over from (and hands back to) the real <img> seamlessly.
     */
    const pixelated = (img: HTMLImageElement, amount: number) => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, W, W);
      if (amount <= 0) return;
      const blocks = Math.round(COARSEST + (DETAIL - COARSEST) * amount);
      ctx.globalAlpha = Math.min(1, amount * 2.5);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(crunch(img, blocks, scratch), 0, 0, W, W);
      ctx.globalAlpha = 1;
    };

    // Soft CRT scanlines that come and go with the effect (no random flicker).
    const scanlines = (strength: number) => {
      if (strength <= 0) return;
      ctx.fillStyle = `rgba(10, 10, 12, ${0.16 * strength})`;
      for (let y = 0; y < W; y += 3 * dpr) ctx.fillRect(0, y, W, dpr);
    };

    const cube = (t: number) => {
      // Gaps between the tiles ease open as the turning starts and close as it ends.
      const open = Math.min(clamp((t - TURN_START) / 90), clamp((TURN_END - t) / 90));
      const gap = dpr * 0.9 * open;
      ctx.fillStyle = "#181715";
      ctx.globalAlpha = open;
      ctx.fillRect(0, 0, W, W);
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          // Alternate rows turn from opposite sides, like a cube face
          const order = r % 2 === 0 ? c : GRID - 1 - c;
          const p = easeInOut(clamp((t - TURN_START - r * ROW_GAP - order * TILE_GAP) / TILE_TURN));
          const squash = Math.abs(Math.cos(p * Math.PI));
          const src = p < 0.5 ? fromSmall : toSmall;
          const w = tile * Math.max(0.06, squash);
          const x = c * tile + (tile - w) / 2;
          ctx.drawImage(src, c * cell, r * cell, cell, cell, x + gap / 2, r * tile + gap / 2, w - gap, tile - gap);
          // Tiles darken a little as they turn edge-on, so they read as turning in depth
          if (squash < 0.999) {
            ctx.fillStyle = `rgba(0, 0, 0, ${(1 - squash) * 0.3})`;
            ctx.fillRect(x, r * tile, w, tile);
          }
        }
      }
    };

    setPlaying(true);
    const start = performance.now();

    const draw = (now: number) => {
      const t = Math.max(0, now - start);
      ctx.clearRect(0, 0, W, W);

      if (t < CRUNCH_END) {
        // 1. The clear picture crunches down into big pixels
        const p = easeInOut(clamp(t / CRUNCH_END));
        pixelated(from, p);
        scanlines(p);
      } else if (t < TURN_END) {
        // 2. The grid turns row by row, each tile flipping to the other picture
        cube(t);
        scanlines(1);
      } else if (t < DONE) {
        // 3. The new picture sharpens back into focus
        const p = easeInOut(clamp((t - TURN_END) / (DONE - TURN_END)));
        pixelated(to, 1 - p);
        scanlines(1 - p);
      } else {
        // Leave the clear new picture on the canvas until React swaps the <img>s.
        pixelated(to, 0);
        setShowTwin((v) => !v);
        setPlaying(false);
        return;
      }
      frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
  };

  const img = "absolute inset-0 h-full w-full rounded-xl object-cover object-top";

  return (
    <button
      type="button"
      onClick={swap}
      aria-label={label}
      aria-pressed={showTwin}
      title="Click me"
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-xl"
    >
      <Image
        ref={photoRef}
        src={photo}
        alt=""
        width={192}
        height={192}
        priority
        className={img}
        style={{ opacity: showTwin ? 0 : 1 }}
      />
      <Image
        ref={twinRef}
        src={twin}
        alt=""
        width={192}
        height={192}
        loading="eager"
        className={img}
        style={{ opacity: showTwin ? 1 : 0 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full rounded-xl"
        style={{ imageRendering: "pixelated", visibility: playing ? "visible" : "hidden" }}
        aria-hidden="true"
      />
      {/* A small seal hints that the portrait changes: 変 ("change") */}
      <span
        className="pointer-events-none absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-[0.2rem] bg-shu font-display text-[0.55rem] leading-none text-paper opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        lang="ja"
        aria-hidden="true"
      >
        変
      </span>
    </button>
  );
}
