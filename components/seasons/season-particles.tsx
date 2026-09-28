"use client";

import { useEffect, useRef } from "react";
import { useSeason } from "@/components/providers/season";
import { MOMIJI, SAKURA, maplePath, petalPath } from "@/lib/shapes";
import type { Season } from "@/lib/season";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  push: number;
  rot: number;
  vr: number;
  size: number;
  phase: number;
  color: string;
}

const COUNT: Record<Season, number> = { spring: 7, summer: 6, autumn: 6, winter: 16 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Seasonal weather over the koi pond: sakura petals, summer sun glints (or
 * fireflies at night), maple leaves or snow, kept inside the pond it sits in. A quick flick of the cursor across
 * the pond stirs the air.
 */
export default function SeasonParticles() {
  const { season } = useSeason();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!season || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      const rect = (canvas.parentElement ?? canvas).getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const falling = season !== "summer";
    const spawn = (anywhere: boolean): Particle => ({
      x: rand(0, width),
      y: anywhere ? rand(0, height) : rand(-40, -10),
      vx: season === "summer" ? rand(-0.3, 0.3) : rand(-0.25, 0.35),
      vy: season === "winter" ? rand(0.2, 0.45) : season === "summer" ? rand(-0.3, 0.3) : rand(0.25, 0.5),
      push: 0,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      size: season === "winter" ? rand(1, 2.6) : season === "summer" ? rand(1.6, 2.6) : rand(4, 7),
      phase: rand(0, Math.PI * 2),
      color: season === "spring" ? pick(SAKURA) : season === "autumn" ? pick(MOMIJI) : "",
    });

    const count = Math.round(COUNT[season] * (width < 480 ? 0.6 : 1));
    const particles = Array.from({ length: count }, () => spawn(true));

    // Cursor "wind": remember where the pointer is and how fast it moves.
    const wind = { x: -999, y: -999, vx: 0, vy: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const first = wind.x === -999;
      wind.vx = first ? 0 : Math.max(-40, Math.min(40, x - wind.x));
      wind.vy = first ? 0 : Math.max(-40, Math.min(40, y - wind.y));
      wind.x = x;
      wind.y = y;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const sizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) sizeObserver.observe(canvas.parentElement);

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      const dark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.phase += 0.02 * dt;

        const dx = p.x - wind.x;
        const dy = p.y - wind.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (1 - dist / 110) * 0.05;
          p.push += wind.vx * force;
          p.vy += wind.vy * force * 0.3;
        }
        p.push *= Math.pow(0.95, dt);

        if (falling) {
          p.x += (p.vx + Math.sin(p.phase) * 0.3 + p.push) * dt;
          p.y += p.vy * dt;
          p.vy += ((season === "winter" ? 0.32 : 0.38) - p.vy) * 0.02 * dt;
          p.rot += p.vr * dt;
          if (p.y > height + 30 || p.x < -40 || p.x > width + 40) Object.assign(p, spawn(false));
        } else if (dark) {
          p.vx += rand(-0.03, 0.03) * dt;
          p.vy += rand(-0.03, 0.03) * dt;
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > 0.45) {
            p.vx *= 0.45 / speed;
            p.vy *= 0.45 / speed;
          }
          p.x = (p.x + (p.vx + p.push) * dt + width) % width;
          p.y = (p.y + p.vy * dt + height) % height;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        if (season === "spring") {
          ctx.rotate(p.rot);
          ctx.scale(p.size, p.size * (0.35 + Math.abs(Math.cos(p.phase * 1.4)) * 0.65));
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = p.color;
          ctx.fill(petalPath());
        } else if (season === "autumn") {
          ctx.rotate(p.rot);
          ctx.scale(p.size * (0.4 + Math.abs(Math.cos(p.phase)) * 0.6), p.size);
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = p.color;
          ctx.fill(maplePath());
        } else if (season === "winter") {
          ctx.globalAlpha = dark ? 0.8 : 0.6;
          ctx.fillStyle = dark ? "#F2F5FA" : "#8C9BB0";
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (dark) {
          // Summer nights: fireflies (hotaru) blink slowly, out of phase, in warm amber.
          const glow = Math.pow((Math.sin(now * 0.0016 + p.phase * 3) + 1) / 2, 2.5);
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 5);
          gradient.addColorStop(0, `rgba(255, 214, 120, ${0.95 * glow})`);
          gradient.addColorStop(0.35, `rgba(255, 170, 70, ${0.35 * glow})`);
          gradient.addColorStop(1, "rgba(255, 170, 70, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Summer days: sunlight glinting off the ripples, twinkling in place.
          const glint = Math.pow(Math.max(0, Math.sin(now * 0.0022 + p.phase * 3)), 6);
          const r = p.size * (1.4 + glint * 2.2);
          ctx.globalAlpha = glint;
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 0.9;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-r * 1.6, 0);
          ctx.lineTo(r * 1.6, 0);
          ctx.moveTo(0, -r);
          ctx.lineTo(0, r);
          ctx.stroke();
          // Once a glint fades out, it reappears somewhere else.
          if (glint === 0 && Math.random() < 0.02) {
            p.x = rand(0, width);
            p.y = rand(0, height);
          }
        }
        ctx.restore();
      }

      wind.vx *= 0.8;
      wind.vy *= 0.8;
      frame = requestAnimationFrame(loop);
    };

    // Only animate while the pond is on screen.
    let running = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      ctx.clearRect(0, 0, width, height);
    };
  }, [season]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
