"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { useSeason } from "@/components/providers/season";
import { SEASON_META, type Season } from "@/lib/season";
import { AJISAI, MOMIJI, SAKURA, TSUBAKI, drawCamellia, drawFloret, maplePath, petalPath } from "@/lib/shapes";
import { sound } from "@/lib/sound";
import Seigaiha from "@/components/ui/seigaiha";
import Branch from "./branch";
import SeasonParticles from "./season-particles";
import { Water } from "./water";
import { DRAGON, GOLDEN, SEGMENTS, TAU, drawKoi, makeBlobs, makeKoi, rand, type Koi } from "./koi-draw";
import { LINES, PROTESTS, SCENES, line, reactTo, type LineKind } from "./koi-chatter";

interface Food {
  x: number;
  y: number;
  age: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  max: number;
  life: number;
}

type FloaterKind = "pad" | "lotus" | "petal" | "leaf" | "greenleaf" | "floret" | "camellia" | "snow" | "ice";

interface Floater {
  kind: FloaterKind;
  x: number;
  y: number;
  r: number;
  rot: number;
  vx: number;
  vy: number;
  vr: number;
  /** 0→1 while it drops onto the water; ripples when it lands. */
  land: number;
  /** Only snow melts; everything else stays at 1. */
  life: number;
  color: string;
  /** Lily pads are rooted: waves rock them, then they drift back. */
  anchor?: { x: number; y: number };
}

interface Bubble {
  koi: Koi;
  text: string;
  born: number;
  life: number;
  /** Where it's drawn now; it glides towards its spot rather than jumping. */
  x?: number;
  y?: number;
  /** Chosen once, when it first appears: above (-1) or below (1) its fish, and a sideways nudge. */
  side?: -1 | 1;
  shift?: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

type Toast = { title: string; body: string };

/** Pellets one fish must eat before it climbs the waterfall. */
const DRAGON_MEALS = 12;
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const angleDiff = (a: number, b: number) => {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
};
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

let greeted = false;

function seedFloaters(season: Season, width: number, height: number): Floater[] {
  const scale = Math.min(1, Math.max(0.7, width / 720));
  const base = { rot: 0, vx: 0, vy: 0, vr: 0, land: 1, life: 1 };
  const padSpots: [number, number][] = [[0.6, 0.3], [0.72, 0.74], [0.42, 0.72], [0.27, 0.42]];
  const pads = { spring: 3, summer: 4, autumn: 2, winter: 0 }[season];

  const list: Floater[] = padSpots.slice(0, pads).map(([fx, fy], i) => ({
    ...base,
    kind: season === "summer" && i === 0 ? "lotus" : "pad",
    x: fx * width,
    y: fy * height,
    r: rand(11, 16) * scale,
    rot: rand(0, TAU),
    color: "",
    anchor: { x: fx * width, y: fy * height },
  }));

  const drifting = (kind: FloaterKind, colors: string[], n: number) => {
    for (let i = 0; i < n; i++) {
      list.push({
        ...base,
        kind,
        x: rand(0, width),
        y: rand(0, height),
        r: (kind === "leaf" ? rand(5, 7) : kind === "camellia" ? rand(7.5, 9.5) : kind === "floret" ? rand(4, 5.2) : rand(2.6, 3.6)) * scale,
        rot: rand(0, TAU),
        vx: rand(-0.06, 0.06),
        vy: rand(-0.04, 0.04),
        vr: rand(-0.004, 0.004),
        color: colors[i % colors.length],
      });
    }
  };
  if (season === "spring") drifting("petal", SAKURA, 6);
  if (season === "autumn") drifting("leaf", MOMIJI, 6);
  // Early summer: hydrangea florets. Deep winter: whole camellia blossoms,
  // which fall intact and float, the classic winter picture.
  if (season === "summer") drifting("floret", AJISAI, 7);
  if (season === "winter") drifting("camellia", TSUBAKI, 3);
  if (season === "winter") {
    list.push({ ...base, kind: "ice", x: width * 0.66, y: height * 0.38, r: 60 * scale, color: "#FFFFFF" });
    list.push({ ...base, kind: "ice", x: width * 0.3, y: height * 0.7, r: 44 * scale, color: "#FFFFFF" });
  }
  return list;
}

const padColor = (season: Season | null, dark: boolean) =>
  season === "autumn" ? (dark ? "#6E6838" : "#A39A55") : dark ? "#3F6048" : "#6F9B63";

function drawFloater(ctx: CanvasRenderingContext2D, f: Floater, dark: boolean, season: Season | null) {
  const ease = 1 - Math.pow(1 - f.land, 3);
  const scale = 1 + (1 - ease) * 0.9;
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rot);
  ctx.scale(scale, scale);
  ctx.globalAlpha = Math.min(1, ease * 1.2) * f.life;

  if (f.kind === "pad" || f.kind === "lotus") {
    ctx.fillStyle = padColor(season, dark);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, f.r, 0.28, TAU - 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(30,50,30,0.2)";
    ctx.lineWidth = 0.6;
    for (let a = 0.8; a < TAU - 0.5; a += 0.9) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * f.r * 0.85, Math.sin(a) * f.r * 0.85);
      ctx.stroke();
    }
    if (f.kind === "lotus") {
      ctx.fillStyle = "#F2A7BB";
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * f.r * 0.32, Math.sin(a) * f.r * 0.32, f.r * 0.36, f.r * 0.15, a, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = "#F2D06B";
      ctx.beginPath();
      ctx.arc(0, 0, f.r * 0.16, 0, TAU);
      ctx.fill();
    }
  } else if (f.kind === "petal") {
    ctx.scale(f.r, f.r);
    ctx.fillStyle = f.color;
    ctx.fill(petalPath());
  } else if (f.kind === "leaf") {
    ctx.scale(f.r, f.r);
    ctx.fillStyle = f.color;
    ctx.fill(maplePath());
  } else if (f.kind === "greenleaf") {
    ctx.scale(f.r, f.r);
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 1, 0.42, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.moveTo(-0.95, 0);
    ctx.lineTo(0.95, 0);
    ctx.stroke();
  } else if (f.kind === "floret") {
    ctx.scale(f.r, f.r);
    drawFloret(ctx, f.color);
  } else if (f.kind === "camellia") {
    ctx.scale(f.r, f.r);
    ctx.shadowColor = dark ? "rgba(0,0,0,0.5)" : "rgba(30,50,50,0.25)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    drawCamellia(ctx, f.color);
  } else if (f.kind === "snow") {
    ctx.fillStyle = "#FBFCFE";
    ctx.beginPath();
    ctx.arc(0, 0, f.r, 0, TAU);
    ctx.fill();
  } else if (f.kind === "ice") {
    ctx.globalAlpha = dark ? 0.07 : 0.35;
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.r, f.r * 0.45, 0, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > max && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * A koi pond painted onto the top of the page. The fish swim, feed, chat and
 * squabble; the water ripples under clicks, food and wakes; the season
 * decides what floats on top. A few secrets are hidden in it too.
 */
export default function KoiPond({ children, facts = [] }: { children?: React.ReactNode; facts?: string[] }) {
  const { season, actual, cycle } = useSeason();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fed, setFed] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const factsRef = useRef(facts);
  factsRef.current = facts;

  const sim = useRef({
    width: 0,
    height: 0,
    koi: [] as Koi[],
    food: [] as Food[],
    ripples: [] as Ripple[],
    floaters: [] as Floater[],
    sparkles: [] as Sparkle[],
    bubbles: [] as Bubble[],
    queue: [] as { at: number; koi: Koi; text: string; life?: number; tag?: string }[],
    water: null as Water | null,
    pointer: { x: 0, y: 0, speed: 0, down: false, dragged: false, startX: 0, startY: 0 },
    lastDrop: 0,
    nextSurface: 0,
    now: 0,
    startedAt: 0,
    lastFed: 0,
    nextIdle: 0,
    nudged: false,
    promisedSecret: false,
    protested: false,
    lastProtest: 0,
    lastSteal: 0,
    lastBump: 0,
    dragonDone: false,
    goldenDone: false,
    partyUntil: 0,
    season: null as Season | null,
    draw: null as null | (() => void),
    actions: null as null | { golden: () => void; hire: () => void },
  });

  // Reseed what floats on the water whenever the season changes.
  useEffect(() => {
    const s = sim.current;
    s.season = season;
    if (season && s.width) {
      s.floaters = seedFloaters(season, s.width, s.height);
      s.draw?.();
    }
  }, [season]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;
    const s = sim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;
    const water = new Water(5);
    s.water = water;
    let dpr = 1;

    if (!greeted) {
      greeted = true;
      console.log(
        "%c🐟 psst… the koi have secrets. Try ↑↑↓↓←→←→BA in the page, or type “hire”.",
        "font: 13px monospace; color: #C43E26",
      );
    }

    const say = (koi: Koi, text: string, delay = 0, life?: number, tag?: string) =>
      s.queue.push({ at: s.now + delay, koi, text, life, tag });
    const others = (koi: Koi) => s.koi.filter((k) => k !== koi);

    const burst = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = rand(0, TAU);
        const v = rand(0.3, 1.4);
        s.sparkles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const changed = Math.abs(rect.width - s.width) > 1 || Math.abs(rect.height - s.height) > 1;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.width = rect.width;
      s.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // This effect's water is new each time it runs, so size it on first use too.
      if (changed || !water.sized) water.resize(rect.width, rect.height);
      if (changed) {
        const count = rect.width < 480 ? 3 : 4;
        s.koi = Array.from({ length: count }, (_, i) => makeKoi(rect.width, rect.height, i));
        s.goldenDone = false;
        s.dragonDone = false;
        s.bubbles = [];
        s.queue = [];
        if (s.season) s.floaters = seedFloaters(s.season, rect.width, rect.height);
      }
    };

    const dragonize = (koi: Koi) => {
      s.dragonDone = true;
      koi.dragon = true;
      koi.pattern = DRAGON;
      koi.blobs = makeBlobs(DRAGON);
      koi.len *= 1.15;
      koi.base *= 1.25;
      koi.spook = 1;
      burst(koi.spine[0].x, koi.spine[0].y, 26);
      water.disturb(koi.spine[0].x, koi.spine[0].y, 22, 9);
      sound.sparkle();
      say(koi, LINES.dragon[0], 300);
      say(koi, LINES.dragon[1], 2800);
      setToast({ title: "登竜門 · Tōryūmon", body: "Legend says a koi that keeps climbing the waterfall becomes a dragon." });
    };

    s.actions = {
      golden() {
        if (s.goldenDone || !s.width) return;
        s.goldenDone = true;
        const kin = makeKoi(s.width, s.height, 0, GOLDEN);
        kin.name = "Kin";
        kin.golden = true;
        kin.angle = 0;
        const seg = kin.len / (SEGMENTS - 1);
        kin.spine = kin.spine.map((_, k) => ({ x: -10 - seg * k, y: s.height * 0.5 }));
        kin.spook = 0.8;
        s.koi.push(kin);
        sound.sparkle();
        say(kin, line("golden", kin.name), 900);
        setToast({ title: "金 · Kin", body: "A legendary golden koi joined the pond." });
      },
      hire() {
        s.partyUntil = s.now + 3500;
        const chants = [...LINES.hire].sort(() => Math.random() - 0.5);
        // Staggered, short-lived bubbles, so the chant reads as a chant, not a pile-up.
        s.koi.forEach((k, i) => say(k, chants[i % chants.length], i * 900, 1900));
        for (const k of s.koi) burst(k.spine[0].x, k.spine[0].y, 6);
        sound.sparkle();
      },
    };

    const eat = (koi: Koi, pellet: Food, now: number) => {
      const index = s.food.indexOf(pellet);
      if (index < 0) return; // another fish got it first this frame
      s.food.splice(index, 1);
      s.ripples.push({ x: pellet.x, y: pellet.y, r: 2, max: 12, life: 0.9 });
      water.disturb(pellet.x, pellet.y, 6, 2.2);
      sound.gulp();
      s.lastFed = now;
      koi.eaten++;
      koi.meals = [...koi.meals.filter((t) => now - t < 10000), now];

      const victim = others(koi).find(
        (o) => o.target === pellet && Math.hypot(o.spine[0].x - pellet.x, o.spine[0].y - pellet.y) < 90,
      );
      if (s.protested) {
        s.protested = false;
        // Fed at last: the strike is called off mid-chant.
        s.queue = s.queue.filter((q) => q.tag !== "protest");
        s.nextIdle = now + 9000;
        say(koi, line("relief", koi.name));
        koi.quietUntil = now + 6000;
      } else if (victim && now - s.lastSteal > 5000) {
        s.lastSteal = now;
        say(victim, line("stolenFrom", victim.name, koi.name));
        say(koi, line("thief", koi.name, victim.name), 1600);
        victim.quietUntil = koi.quietUntil = now + 5000;
      } else if (koi.eaten >= DRAGON_MEALS && !s.dragonDone && !koi.golden) {
        dragonize(koi);
      } else if (koi.meals.length >= 5 && koi.quietUntil < now) {
        say(koi, line("full", koi.name));
        koi.quietUntil = now + 9000;
      } else if (s.promisedSecret) {
        s.promisedSecret = false;
        say(koi, line("secret", koi.name), 500);
        koi.quietUntil = now + 6000;
      } else if (Math.random() < 0.25 && koi.quietUntil < now) {
        say(koi, line("eat", koi.name));
        koi.quietUntil = now + 6000;
      }
    };

    // Time to read a line before the next one is spoken.
    const beat = (text: string) => 1500 + text.length * 45;

    /** Play a little scene: each line goes to its fish, a beat after the last. Returns its length in ms. */
    const play = (scene: string[], facts: string[], tag?: string) => {
      const cast = [...s.koi].sort(() => Math.random() - 0.5);
      const roles: Record<string, Koi> = { a: cast[0], b: cast[1] ?? cast[0], c: cast[2] ?? cast[0] };
      const fill = (text: string) =>
        text
          .replace("{a}", roles.a.name)
          .replace("{b}", roles.b.name)
          .replace("{c}", roles.c.name)
          .replace("{fact}", facts.length ? pick(facts) : "");
      let delay = 0;
      for (const entry of scene) {
        const text = fill(entry.slice(3));
        say(roles[entry[0]], text, delay, undefined, tag);
        delay += beat(text);
      }
      return delay;
    };

    const fits = (scene: string[], facts: string[]) =>
      (s.koi.length >= 3 || !scene.some((l) => l.startsWith("c:") || l.includes("{c}"))) &&
      (facts.length > 0 || !scene.some((l) => l.includes("{fact}")));

    /** A fact about the owner, a sarcastic roast, sometimes a comeback and a last word. */
    const factChat = (facts: string[]) => {
      const [a, b, c] = [...s.koi].sort(() => Math.random() - 0.5);
      const fact = pick(facts);
      let delay = 0;
      say(a, fact, delay);
      delay += beat(fact);
      const roast = reactTo(fact, b.name, a.name);
      say(b, roast, delay);
      delay += beat(roast);
      if (c && Math.random() < 0.7) {
        const back = line("comeback", c.name, b.name);
        say(c, back, delay);
        delay += beat(back);
        if (Math.random() < 0.5) {
          const last = line("lastWord", b.name, c.name);
          say(b, last, delay);
          delay += beat(last);
        }
      }
      return delay;
    };

    const chatter = (now: number) => {
      if (now < s.nextIdle || s.queue.length || s.bubbles.length || !s.koi.length) return;
      const speaker = pick(s.koi);
      const sinceFed = now - (s.lastFed || s.startedAt);
      let length = 0;

      if (!s.lastFed && !s.nudged) {
        s.nudged = true;
        say(speaker, line("firstNudge", speaker.name));
      } else if (sinceFed > 60000 && now - s.lastProtest > 120000 && s.koi.length >= 2) {
        // A whole minute without food: the pond goes on strike.
        s.lastProtest = now;
        s.protested = true;
        length = play(pick(PROTESTS), [], "protest");
        sound.protest();
      } else if (sinceFed > 30000 && Math.random() < 0.55) {
        const text = line("hungry", speaker.name);
        if (text.includes("secret")) s.promisedSecret = true;
        say(speaker, text);
        sound.grumble();
      } else {
        const facts = factsRef.current;
        const r = Math.random();
        const scenes = SCENES.filter((scene) => fits(scene, facts));
        if (r < 0.42 && s.koi.length >= 2 && scenes.length) {
          length = play(pick(scenes), facts);
        } else if (r < 0.72 && facts.length && s.koi.length >= 2) {
          length = factChat(facts);
        } else if (r < 0.82) {
          say(speaker, line("idle", speaker.name));
        } else if (r < 0.92) {
          const mood: LineKind = document.documentElement.classList.contains("dark") ? "night" : (s.season ?? "spring");
          say(speaker, line(mood, speaker.name));
        } else {
          say(speaker, line("secret", speaker.name));
        }
      }
      s.nextIdle = now + length + rand(7000, 12000);
    };

    const update = (dt: number, now: number) => {
      s.now = now;
      const { width: W, height: H, pointer } = s;
      const winter = s.season === "winter";
      const party = now < s.partyUntil;

      water.step();
      if (dt > 1.6) water.step();
      // The odd drop keeps the surface faintly alive.
      if (Math.random() < (winter ? 0.02 : 0.05) * dt) water.disturb(rand(0, W), rand(0, H), 4, rand(-0.6, 0.6));

      for (const koi of s.koi) {
        const head = koi.spine[0];
        koi.turnTimer -= dt;
        if (koi.turnTimer <= 0) {
          koi.turn = rand(-0.022, 0.022);
          koi.turnTimer = rand(50, 160);
        }
        let steer = party ? 0.05 : koi.turn;
        let seeking = false;

        // Keep to the pond.
        const mx = 30;
        const my = Math.min(26, H * 0.18);
        if (head.x < mx || head.x > W - mx || head.y < my || head.y > H - my) {
          steer += angleDiff(Math.atan2(H / 2 - head.y, W / 2 - head.x), koi.angle) * 0.07;
        }

        // Give each other room (and grumble on a bump).
        for (const other of s.koi) {
          if (other === koi) continue;
          const dx = head.x - other.spine[0].x;
          const dy = head.y - other.spine[0].y;
          const d = Math.hypot(dx, dy);
          if (d < koi.len * 0.7 && d > 0) steer += angleDiff(Math.atan2(dy, dx), koi.angle) * 0.02;
          if (d < koi.len * 0.3 && now - s.lastBump > 12000 && koi.quietUntil < now) {
            s.lastBump = now;
            koi.quietUntil = now + 5000;
            say(koi, line("bump", koi.name, other.name));
          }
        }

        // Race to the nearest food.
        let nearest: Food | null = null;
        let nearestD = Infinity;
        for (const f of s.food) {
          const d = Math.hypot(f.x - head.x, f.y - head.y);
          if (d < nearestD) {
            nearest = f;
            nearestD = d;
          }
        }
        koi.target = null;
        if (nearest && nearestD < 320) {
          seeking = true;
          koi.target = nearest;
          steer += angleDiff(Math.atan2(nearest.y - head.y, nearest.x - head.x), koi.angle) * 0.09;
          if (nearestD < koi.len * 0.16 + 4) eat(koi, nearest, now);
        }

        // Hovering leaves them in peace; dragging a finger or the mouse
        // through the water sweeps them out of the way.
        if (pointer.down && pointer.speed > 1.5) {
          const d = Math.hypot(head.x - pointer.x, head.y - pointer.y);
          if (d < 90) {
            steer += angleDiff(Math.atan2(head.y - pointer.y, head.x - pointer.x), koi.angle) * 0.18;
            if (koi.spook < 0.5 && koi.quietUntil < now && Math.random() < 0.4) {
              koi.quietUntil = now + 7000;
              say(koi, line("spooked", koi.name));
            }
            koi.spook = 1;
          }
        }

        // Koi swim in bursts: a few strong tail beats, then a long glide.
        koi.glideTimer -= dt;
        if (koi.glideTimer <= 0) {
          koi.bursting = !koi.bursting;
          koi.glideTimer = koi.bursting ? rand(35, 80) : rand(60, 170);
        }
        const urgent = seeking || koi.spook > 0.3 || party;
        const thrustTarget = urgent ? 1 : koi.bursting ? 0.85 : 0.2;
        koi.thrust += (thrustTarget - koi.thrust) * 0.05 * dt;

        steer = Math.max(-0.09, Math.min(0.09, steer));
        koi.angle += steer * dt;
        koi.spook *= Math.pow(0.97, dt);
        const target =
          koi.base * (0.55 + 0.6 * koi.thrust) * (winter ? 0.55 : 1) * (1 + koi.spook * 2.2 + (seeking ? 0.8 : 0) + (party ? 1 : 0));
        koi.speed += (target - koi.speed) * 0.05 * dt;
        koi.beat += (0.07 + koi.speed * 0.17) * (0.35 + 0.65 * koi.thrust) * dt;

        // The head goes where the fish is heading; the body trails behind.
        head.x += Math.cos(koi.angle) * koi.speed * dt;
        head.y += Math.sin(koi.angle) * koi.speed * dt;
        const seg = koi.len / (SEGMENTS - 1);
        for (let i = 1; i < koi.spine.length; i++) {
          const a = koi.spine[i - 1];
          const b = koi.spine[i];
          const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
          b.x = a.x + ((b.x - a.x) / d) * seg;
          b.y = a.y + ((b.y - a.y) / d) * seg;
        }

        // Wake: the nose pushes water ahead and the tail sheds alternating
        // swirls. A fast fish churns the surface much harder.
        const tail = koi.spine[koi.spine.length - 1];
        const fast = koi.speed > 1.1;
        water.disturb(
          head.x + Math.cos(koi.angle) * koi.len * 0.1,
          head.y + Math.sin(koi.angle) * koi.len * 0.1,
          koi.len * 0.1,
          0.12 * koi.speed * koi.speed * dt,
        );
        water.disturb(tail.x, tail.y, koi.len * 0.12, Math.sin(koi.beat) * 0.3 * koi.speed * (0.3 + koi.thrust) * dt);

        // Passing fish shove the leaves and petals floating above them.
        for (const f of s.floaters) {
          if (f.kind === "ice") continue;
          const d = Math.hypot(f.x - head.x, f.y - head.y);
          const reach = f.r + (fast ? 16 : 8);
          if (d < reach && d > 0) {
            const push = (f.anchor ? 0.015 : 0.04) * (fast ? 2.5 : 1);
            f.vx += ((f.x - head.x) / d) * push;
            f.vy += ((f.y - head.y) / d) * push;
          }
        }

        if ((koi.dragon || koi.golden) && Math.random() < 0.25 * dt) {
          const p = koi.spine[Math.floor(rand(0, koi.spine.length))];
          s.sparkles.push({ x: p.x + rand(-4, 4), y: p.y + rand(-4, 4), vx: rand(-0.2, 0.2), vy: rand(-0.4, -0.1), life: 1 });
        }
      }

      // Now and then a fish kisses the surface.
      if (now > s.nextSurface && s.koi.length) {
        const koi = pick(s.koi);
        s.ripples.push({ x: koi.spine[0].x, y: koi.spine[0].y, r: 2, max: rand(14, 22), life: 1 });
        water.disturb(koi.spine[0].x, koi.spine[0].y, 5, 2);
        s.nextSurface = now + rand(3500, 7000);
      }

      // Food floats, drifting with the waves.
      const drift = (v: number) => Math.max(-0.25, Math.min(0.25, v * 0.06));
      for (const f of s.food) {
        f.age += dt;
        const slope = water.slope(f.x, f.y);
        f.x -= drift(slope.x) * dt;
        f.y -= drift(slope.y) * dt;
      }
      s.food = s.food.filter((f) => f.age < 600);

      for (const r of s.ripples) {
        r.r += (r.max - r.r) * 0.045 * dt + 0.08 * dt;
        r.life -= 0.016 * dt;
      }
      s.ripples = s.ripples.filter((r) => r.life > 0);

      for (const f of s.floaters) {
        if (f.land < 1) {
          f.land = Math.min(1, f.land + 0.045 * dt);
          if (f.land === 1) {
            s.ripples.push({ x: f.x, y: f.y, r: 2, max: 16, life: 0.9 });
            water.disturb(f.x, f.y, 5, 2);
          }
        }
        if (f.kind === "snow" && f.land === 1) f.life -= 0.006 * dt;
        if (f.kind !== "ice") {
          // Waves push floating things downhill.
          const slope = water.slope(f.x, f.y);
          const k = f.anchor ? 0.004 : 0.012;
          const cap = (v: number) => Math.max(-0.04, Math.min(0.04, v * k));
          f.vx -= cap(slope.x) * dt;
          f.vy -= cap(slope.y) * dt;
        }
        if (f.anchor) {
          // Lily pads are rooted: they rock, then settle back.
          f.vx += (f.anchor.x - f.x) * 0.002 * dt;
          f.vy += (f.anchor.y - f.y) * 0.002 * dt;
          f.vx *= Math.pow(0.95, dt);
          f.vy *= Math.pow(0.95, dt);
        } else {
          f.vx *= Math.pow(0.99, dt);
          f.vy *= Math.pow(0.99, dt);
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += (f.vr + f.vx * 0.01) * dt;
        if (f.x < -20) f.x = W + 20;
        if (f.x > W + 20) f.x = -20;
        if (f.y < -20) f.y = H + 20;
        if (f.y > H + 20) f.y = -20;
      }
      s.floaters = s.floaters.filter((f) => f.life > 0);

      for (const p of s.sparkles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= Math.pow(0.96, dt);
        p.vy *= Math.pow(0.96, dt);
        p.life -= 0.018 * dt;
      }
      s.sparkles = s.sparkles.filter((p) => p.life > 0);

      // Speech: start queued lines, retire old bubbles.
      const due = s.queue.filter((q) => q.at <= now);
      if (due.length) {
        s.queue = s.queue.filter((q) => q.at > now);
        for (const q of due) {
          if (!s.koi.includes(q.koi)) continue;
          const life = q.life ?? 2400 + q.text.length * 45;
          const own = s.bubbles.find((b) => b.koi === q.koi);
          if (own) {
            // Same fish talking again: reuse its bubble where it already is.
            Object.assign(own, { text: q.text, born: now, life });
          } else {
            s.bubbles.push({ koi: q.koi, text: q.text, born: now, life });
          }
          sound.blub();
        }
        // At most two bubbles at a time: the oldest bows out with a fade.
        const showing = s.bubbles.filter((b) => b.life - (now - b.born) > 260);
        for (const b of showing.slice(0, Math.max(0, showing.length - 2))) b.life = now - b.born + 260;
      }
      s.bubbles = s.bubbles.filter((b) => now - b.born < b.life);
      chatter(now);

      pointer.speed *= Math.pow(0.85, dt);
    };

    const drawBubbles = (dark: boolean) => {
      if (!s.bubbles.length) return;
      const css = getComputedStyle(document.documentElement);
      const paper = css.getPropertyValue("--paper").trim().split(/\s+/).join(",");
      const ink = css.getPropertyValue("--ink").trim().split(/\s+/).join(",");
      ctx.font = `500 11px ${font}`;
      ctx.textBaseline = "top";
      const overlaps = (a: DOMRect, b: DOMRect) =>
        a.x < b.x + b.width + 4 && a.x + a.width + 4 > b.x && a.y < b.y + b.height + 4 && a.y + a.height + 4 > b.y;
      const drawn: DOMRect[] = [];
      for (const b of s.bubbles) {
        const age = s.now - b.born;
        const left = b.life - age;
        if (left <= 0) continue;
        const lines = wrap(ctx, b.text, 150);
        const tw = Math.max(...lines.map((l) => ctx.measureText(l).width));
        const pad = 7;
        const bw = tw + pad * 2;
        const bh = lines.length * 14 + pad * 2 - 2;
        const head = b.koi.spine[0];
        const clampX = (x: number) => Math.max(4, Math.min(s.width - bw - 4, x));
        const spot = (side: -1 | 1, shift: number) => {
          const y = side < 0 ? head.y - 16 - bh : head.y + 16;
          return new DOMRect(clampX(head.x - bw / 2 + shift), Math.max(4, Math.min(s.height - bh - 4, y)), bw, bh);
        };

        // Pick a spot once, when the bubble first appears: above the fish if
        // there's room and it's clear of other bubbles, otherwise below, and
        // failing that nudged sideways. After that it keeps its spot.
        if (b.side === undefined) {
          const options: [-1 | 1, number][] = [[-1, 0], [1, 0], [-1, bw * 0.7], [-1, -bw * 0.7], [1, bw * 0.7], [1, -bw * 0.7]];
          const roomAbove = head.y - 16 - bh >= 4;
          const choice =
            options.find(([side, shift]) => (side > 0 || roomAbove) && !drawn.some((d) => overlaps(d, spot(side, shift)))) ??
            ([roomAbove ? -1 : 1, 0] as [-1 | 1, number]);
          [b.side, b.shift] = choice;
        }
        const target = spot(b.side, b.shift ?? 0);
        // Glide after the fish instead of snapping to it every frame.
        b.x = b.x === undefined ? target.x : b.x + (target.x - b.x) * 0.18;
        b.y = b.y === undefined ? target.y : b.y + (target.y - b.y) * 0.18;
        const bx = b.x;
        const by = b.y;
        drawn.push(new DOMRect(bx, by, bw, bh));

        // Pop in with a little overshoot; drift up and fade on the way out.
        const t = Math.min(1, age / 240);
        const pop = 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
        const fade = Math.min(1, left / 260);
        const alpha = Math.min(1, age / 120, fade);
        const lift = (1 - fade) * 5;
        const above = b.side < 0;
        const anchorY = above ? by + bh : by;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(bx + bw / 2, anchorY - lift);
        ctx.scale(0.8 + 0.2 * pop, 0.8 + 0.2 * pop);
        ctx.translate(-(bx + bw / 2), -anchorY);
        ctx.beginPath();
        roundedRect(ctx, bx, by, bw, bh, 7);
        // A little tail pointing at the speaker
        const tx = Math.max(bx + 8, Math.min(bx + bw - 8, head.x));
        ctx.moveTo(tx - 4, anchorY);
        ctx.lineTo(tx + Math.max(-6, Math.min(6, (head.x - tx) * 0.4)), anchorY + (above ? 6 : -6));
        ctx.lineTo(tx + 4, anchorY);
        ctx.fillStyle = `rgba(${paper}, 0.96)`;
        ctx.shadowColor = dark ? "rgba(0,0,0,0.4)" : "rgba(20,40,40,0.18)";
        ctx.shadowBlur = 6 * dpr;
        ctx.shadowOffsetY = 1.5 * dpr;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = `rgba(${ink}, 0.12)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fillStyle = `rgb(${ink})`;
        lines.forEach((l, i) => ctx.fillText(l, bx + pad, by + pad + i * 14));
        ctx.restore();
      }
    };

    const draw = () => {
      const dark = document.documentElement.classList.contains("dark");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, s.width, s.height);

      for (const koi of s.koi) drawKoi(ctx, koi, dpr, dark, s.now);

      // The water's surface over the fish: light and shade from the waves.
      water.render(ctx, dark);

      for (const r of s.ripples) {
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = dark ? `rgba(0, 0, 0, ${0.25 * r.life})` : `rgba(40, 72, 62, ${0.2 * r.life})`;
        ctx.beginPath();
        ctx.arc(r.x + 0.8, r.y + 0.8, r.r, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 255, 255, ${(dark ? 0.35 : 0.8) * r.life})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 0.55, 0, TAU);
        ctx.stroke();
      }

      ctx.fillStyle = "#B98A4E";
      for (const f of s.food) {
        ctx.globalAlpha = Math.min(1, (600 - f.age) / 120);
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.9, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const f of s.floaters) drawFloater(ctx, f, dark, s.season);

      // Sparkles: little four-point stars.
      ctx.strokeStyle = "#F7D46A";
      ctx.lineWidth = 1;
      for (const p of s.sparkles) {
        const r = 2.4 * p.life;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.moveTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y);
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x, p.y + r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      drawBubbles(dark);
    };
    s.draw = draw;

    resize();
    s.startedAt = performance.now();
    s.now = s.startedAt;
    s.nextIdle = s.startedAt + 6500;
    draw();

    const observer = new ResizeObserver(() => {
      resize();
      draw();
    });
    observer.observe(container);

    if (reduced) {
      return () => observer.disconnect();
    }

    // Only animate while the pond is on screen.
    let frame = 0;
    let running = false;
    let last = performance.now();
    let failed = false;
    const loop = (now: number) => {
      // Book the next frame first, so one bad frame can't stop the pond for good.
      frame = requestAnimationFrame(loop);
      // A frame's timestamp can predate `last` (set from performance.now() when the
      // pond scrolls back into view), and a negative step shrinks ripples below zero.
      const dt = Math.max(0, Math.min(3, (now - last) / 16.67));
      last = Math.max(last, now);
      try {
        update(dt, Math.max(now, s.now));
        draw();
      } catch (error) {
        if (!failed) console.error(error);
        failed = true;
      }
    };
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
    visibility.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      s.draw = null;
      s.actions = null;
    };
  }, []);

  // Secret codes, typed anywhere on the page.
  useEffect(() => {
    let keys: string[] = [];
    let typed = "";
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keys = [...keys, key].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) {
        keys = [];
        sim.current.actions?.golden();
      }
      if (key.length === 1) {
        typed = (typed + key).slice(-4);
        if (typed === "hire") {
          typed = "";
          sim.current.actions?.hire();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toLocal = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleDown = (event: React.PointerEvent) => {
    const { x, y } = toLocal(event.clientX, event.clientY);
    Object.assign(sim.current.pointer, { x, y, speed: 0, down: true, dragged: false, startX: x, startY: y });
  };

  const handleMove = (event: React.PointerEvent) => {
    const p = sim.current.pointer;
    if (!p.down) return;
    const { x, y } = toLocal(event.clientX, event.clientY);
    p.speed = Math.max(p.speed, Math.hypot(x - p.x, y - p.y));
    p.x = x;
    p.y = y;
    if (Math.hypot(x - p.startX, y - p.startY) > 6) p.dragged = true;
    // The drag stirs the water behind it too.
    if (p.speed > 1.5) sim.current.water?.disturb(x, y, 8, Math.min(3, p.speed * 0.25));
  };

  const handleUp = () => {
    sim.current.pointer.down = false;
  };

  /** Scatter a few pellets at a point on the water. */
  const feedAt = useCallback((x: number, y: number) => {
    const s = sim.current;
    for (let i = 0; i < 3; i++) {
      s.food.push({ x: x + rand(-8, 8), y: y + rand(-6, 6), age: 0 });
    }
    s.food = s.food.slice(-12);
    s.ripples.push({ x, y, r: 2, max: 24, life: 1 });
    s.water?.disturb(x, y, 10, 6);
    s.lastFed = s.now;
    sound.plop();
    setFed(true);
  }, []);

  // A click on a fish boops it; a click on the water drops food. The end of a
  // drag is not a click.
  const handleClick = (event: React.MouseEvent) => {
    const { x, y } = toLocal(event.clientX, event.clientY);
    const s = sim.current;
    s.pointer.speed = 0;
    if (s.pointer.dragged) {
      s.pointer.dragged = false;
      return;
    }

    const booped = s.koi.find((k) =>
      k.spine.slice(0, Math.round(SEGMENTS * 0.8)).some((p) => Math.hypot(p.x - x, p.y - y) < k.len * 0.13 + 6),
    );
    if (booped) {
      booped.boops++;
      booped.spook = 0.6;
      sound.boop();
      s.ripples.push({ x, y, r: 2, max: 10, life: 0.7 });
      s.water?.disturb(x, y, 5, 2);
      const text = booped.boops === 5 ? line("boopLove", booped.name) : line("boop", booped.name);
      s.queue.push({ at: s.now, koi: booped, text });
      booped.quietUntil = s.now + 4000;
      return;
    }

    feedAt(x, y);
  };

  // The "F" keyboard shortcut drops food somewhere in open water.
  useEffect(() => {
    const onFeed = () => {
      const s = sim.current;
      if (!s.width) return;
      feedAt(rand(s.width * 0.2, s.width * 0.8), rand(s.height * 0.3, s.height * 0.75));
    };
    window.addEventListener("koi:feed", onFeed);
    return () => window.removeEventListener("koi:feed", onFeed);
  }, [feedAt]);

  // Brushing the branch drops a petal, leaf or clump of snow onto the water.
  const handleShake = useCallback((clientX: number, clientY: number) => {
    const s = sim.current;
    const now = performance.now();
    if (!s.season || now - s.lastDrop < 350 || !containerRef.current) return;
    s.lastDrop = now;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(s.width - 8, clientX - rect.left + rand(-6, 6)));
    const y = Math.max(8, Math.min(s.height - 8, clientY - rect.top + rand(10, 26)));
    const scale = Math.min(1, Math.max(0.7, s.width / 720));
    // Summer's leafy twigs drop leaves; winter's snowy limb now and then lets
    // a camellia fall with the snow.
    const kind: FloaterKind =
      s.season === "spring" ? "petal"
      : s.season === "autumn" ? "leaf"
      : s.season === "summer" ? "greenleaf"
      : Math.random() < 0.2 ? "camellia"
      : "snow";
    const color =
      kind === "petal" ? pick(SAKURA)
      : kind === "leaf" ? pick(MOMIJI)
      : kind === "greenleaf" ? pick(["#6F9B63", "#5E8F5A", "#86AE72"])
      : kind === "camellia" ? pick(TSUBAKI)
      : "";
    s.floaters.push({
      kind,
      x,
      y,
      r:
        (kind === "leaf" ? rand(5, 7)
        : kind === "greenleaf" ? rand(4.5, 6)
        : kind === "camellia" ? rand(7.5, 9.5)
        : kind === "snow" ? rand(2, 3)
        : rand(2.8, 3.6)) * scale,
      rot: rand(0, TAU),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.05, 0.05),
      vr: rand(-0.006, 0.006),
      land: 0,
      life: 1,
      color,
    });
    // Keep the pond tidy: drop the oldest drifting pieces beyond a dozen.
    const drifting = s.floaters.filter((f) => !["pad", "lotus", "ice", "camellia"].includes(f.kind));
    if (drifting.length > 14) s.floaters.splice(s.floaters.indexOf(drifting[0]), 1);
  }, []);

  const meta = season ? SEASON_META[season] : null;

  return (
    <div
      ref={containerRef}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onPointerLeave={handleUp}
      onClick={handleClick}
      className="group/pond dots-b relative h-40 cursor-crosshair overflow-hidden sm:h-48"
      style={{ backgroundColor: "rgb(var(--water))", boxShadow: "inset 0 0 40px rgb(var(--line) / 0.06)" }}
    >
      <p className="sr-only">
        A koi pond in {meta?.label.toLowerCase() ?? "season"}. Click the water to feed the fish, or click a fish to say
        hello.
      </p>
      <Seigaiha scale={1.1} fill="rgb(var(--water))" stroke="rgb(var(--line) / 0.07)" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <Branch season={season} onShake={handleShake} />
      <SeasonParticles />

      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.title}
            role="status"
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-1/2 top-3 z-10 w-max max-w-[80%] -translate-x-1/2 rounded-lg border border-line/10 bg-paper/90 px-3 py-2 text-center shadow-sm backdrop-blur-sm"
          >
            <p className="font-display text-[0.85rem] text-shu">{toast.title}</p>
            <p className="text-[0.72rem] leading-snug text-ink-soft">{toast.body}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!fed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ delay: 1.5 }}
            className="label pointer-events-none absolute bottom-2.5 right-[8.75rem] !text-[0.6rem] !normal-case !tracking-[0.08em] min-[1100px]:hidden"
          >
            <span className="sm:hidden">tap to feed</span>
            <span className="hidden sm:inline">click the water to feed the koi</span>
          </motion.span>
        )}
      </AnimatePresence>

      {meta && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cycle();
          }}
          className="group/season absolute bottom-2 right-3 flex items-center gap-1.5 rounded-full border border-line/10 bg-paper/85 py-1 pl-2 pr-2.5 text-[0.7rem] text-ink-soft backdrop-blur-sm transition-colors hover:text-ink sm:right-4"
          title="The pond follows today's season. Click (or press S) to preview the others."
          aria-keyshortcuts="s"
          aria-label={`Season: ${meta.label}. Click to preview the next season.`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={meta.kanji}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              className="font-display text-[0.8rem] text-ink"
              lang="ja"
            >
              {meta.kanji}
            </motion.span>
          </AnimatePresence>
          {meta.label}
          {season === actual && <span className="h-1 w-1 rounded-full bg-matcha" title="Today's season" />}
          <FiRefreshCw className="text-[0.6rem] opacity-50 transition-transform duration-500 group-hover/season:rotate-180" />
        </button>
      )}

      {children}
    </div>
  );
}
