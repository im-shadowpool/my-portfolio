/*
  How a koi looks and moves, seen from above.

  The spine is a follow-the-leader path: the head swims straight along its
  heading and each point behind trails the one in front, so the body bends
  naturally through turns. On top of that, a wave travels from head to tail
  (small at the head, large at the tail), which is what makes a fish read as a
  fish rather than a snake: the head stays steady and the tail does the work.

  The look follows painted koi: a plump body with a blunt head, big
  translucent cream fins with visible rays, a long flowing tail, irregular
  colour patches, a hint of scales and a soft shadow on the pond floor.
*/

export type Point = { x: number; y: number };

export interface Pattern {
  base: string;
  /** Fins are thin and translucent, usually paler than the body. */
  fin: string;
  /** Colour of the fin rays. */
  ray: string;
  spots: { at: number; r: number; color: string }[];
  /** Metallic koi catch the light. */
  shine?: boolean;
}

const RED = "#D9432A";
const SUMI = "#1F1B18";

// Kohaku, ogon, showa and a white tancho sanke (red head spot, black shoulder).
export const PATTERNS: Pattern[] = [
  {
    base: "#F8F3EA",
    fin: "#FFFDF8",
    ray: "rgba(150, 120, 100, 0.28)",
    spots: [
      { at: 0.1, r: 0.7, color: RED },
      { at: 0.38, r: 0.8, color: RED },
      { at: 0.66, r: 0.6, color: RED },
    ],
  },
  {
    base: "#E9A43A",
    fin: "#F7DDA0",
    ray: "rgba(170, 110, 30, 0.35)",
    spots: [{ at: 0.3, r: 0.6, color: "#F3C668" }, { at: 0.6, r: 0.45, color: "#F3C668" }],
    shine: true,
  },
  {
    base: "#F6F1E9",
    fin: "#EEE7DC",
    ray: "rgba(31, 27, 24, 0.45)",
    spots: [
      { at: 0.08, r: 0.55, color: RED },
      { at: 0.2, r: 0.6, color: SUMI },
      { at: 0.44, r: 0.75, color: RED },
      { at: 0.56, r: 0.45, color: SUMI },
      { at: 0.75, r: 0.45, color: SUMI },
    ],
  },
  {
    base: "#F9F7F3",
    fin: "#FFFEFB",
    ray: "rgba(130, 130, 140, 0.26)",
    spots: [
      { at: 0.08, r: 0.78, color: "#E5321E" },
      { at: 0.3, r: 0.6, color: SUMI },
      { at: 0.46, r: 0.38, color: SUMI },
      { at: 0.03, r: 0.2, color: SUMI },
    ],
  },
];

/** The legendary golden koi (an easter egg). */
export const GOLDEN: Pattern = {
  base: "#F4C64E",
  fin: "#FCE7A6",
  ray: "rgba(170, 120, 20, 0.35)",
  spots: [],
  shine: true,
};

/** A koi that climbed the waterfall (an easter egg). */
export const DRAGON: Pattern = {
  base: "#EDB63F",
  fin: "#F9DC8A",
  ray: "rgba(200, 50, 31, 0.4)",
  spots: [
    { at: 0.12, r: 0.6, color: "#C8321F" },
    { at: 0.48, r: 0.7, color: "#C8321F" },
  ],
  shine: true,
};

export const NAMES = ["Koko", "Goldie", "Sho", "Tama"];

export const SEGMENTS = 14;
export const TAU = Math.PI * 2;
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** One colour patch is several overlapping blobs, so its edge looks organic. */
type Blob = { at: number; off: number; r: number; stretch: number; color: string };

export interface Koi {
  name: string;
  /** Path points, head first. */
  spine: Point[];
  angle: number;
  speed: number;
  /** Cruising speed. */
  base: number;
  len: number;
  turn: number;
  turnTimer: number;
  /** Tail-beat phase. */
  beat: number;
  /** 0 while gliding, 1 while beating hard. */
  thrust: number;
  bursting: boolean;
  glideTimer: number;
  spook: number;
  pattern: Pattern;
  blobs: Blob[];
  /** The pellet it's heading for. */
  target: unknown;
  eaten: number;
  /** When it last ate, in ms, to spot a fish eating a lot quickly. */
  meals: number[];
  dragon: boolean;
  golden: boolean;
  boops: number;
  /** Earliest time (ms) it may speak again after reacting to something. */
  quietUntil: number;
}

export function makeBlobs(pattern: Pattern): Blob[] {
  return pattern.spots.flatMap((spot) => {
    const off = rand(-0.4, 0.4);
    return Array.from({ length: 3 }, () => ({
      at: Math.min(0.9, Math.max(0.02, spot.at + rand(-0.05, 0.05))),
      off: off + rand(-0.35, 0.35),
      r: spot.r * rand(0.55, 0.85),
      stretch: rand(1.1, 1.7),
      color: spot.color,
    }));
  });
}

export function makeKoi(width: number, height: number, index: number, pattern?: Pattern): Koi {
  const scale = Math.min(1, Math.max(0.68, width / 720));
  const len = rand(40, 50) * scale;
  const x = rand(width * 0.25, width * 0.75);
  const y = rand(height * 0.3, height * 0.7);
  const angle = rand(0, TAU);
  const seg = len / (SEGMENTS - 1);
  const p = pattern ?? PATTERNS[index % PATTERNS.length];
  return {
    name: NAMES[index % NAMES.length],
    spine: Array.from({ length: SEGMENTS }, (_, k) => ({ x: x - Math.cos(angle) * seg * k, y: y - Math.sin(angle) * seg * k })),
    angle,
    speed: 0.4,
    base: rand(0.4, 0.62),
    len,
    turn: 0,
    turnTimer: 0,
    beat: rand(0, TAU),
    thrust: 0.4,
    bursting: false,
    glideTimer: rand(20, 80),
    spook: 0,
    pattern: p,
    blobs: makeBlobs(p),
    target: null,
    eaten: 0,
    meals: [],
    dragon: false,
    golden: false,
    boops: 0,
    quietUntil: 0,
  };
}

// Half-width of the body along its length (0 = nose, 1 = tail stalk):
// a blunt, rounded head, full shoulders, then a long taper to a narrow stalk.
function profile(u: number) {
  if (u < 0.08) return 0.6 + (u / 0.08) * 0.3;
  if (u < 0.3) return 0.9 + ((u - 0.08) / 0.22) * 0.1;
  const t = (u - 0.3) / 0.7;
  return 1 - 0.83 * Math.pow(t, 1.3);
}

const norm = (x: number, y: number) => {
  const d = Math.hypot(x, y) || 1;
  return { x: x / d, y: y / d };
};

const WAVE = 4.4; // how much of a wavelength fits along the body

/** The spine with the swimming wave applied: where the body really is. */
export function bodyPoints(koi: Koi) {
  const { spine, len } = koi;
  const n = spine.length;
  const amp = len * (0.03 + 0.055 * koi.thrust);
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const a = spine[Math.max(0, i - 1)];
    const b = spine[Math.max(1, i)];
    const dir = norm(a.x - b.x, a.y - b.y);
    const u = i / (n - 1);
    const off = amp * (0.1 + 0.9 * u * u) * Math.sin(koi.beat - u * WAVE);
    pts.push({ x: spine[i].x - dir.y * off, y: spine[i].y + dir.x * off });
  }
  return pts;
}

/** A fan-shaped fin in local space (x = outwards along the fin). */
function finPath(length: number, width: number) {
  const p = new Path2D();
  p.moveTo(0, -width * 0.2);
  p.bezierCurveTo(length * 0.3, -width * 1.1, length * 0.95, -width * 1.05, length, -width * 0.1);
  p.bezierCurveTo(length * 0.92, width * 0.55, length * 0.35, width * 0.5, 0, width * 0.2);
  p.closePath();
  return p;
}

function tailPath(L: number, S: number, bend: number) {
  const p = new Path2D();
  p.moveTo(0, -S * 0.22);
  p.bezierCurveTo(L * 0.35, -S * 0.6, L * 0.72, -S * 1.0 + bend * 0.4, L, -S * 1.1 + bend);
  p.bezierCurveTo(L * 0.86, -S * 0.55 + bend * 0.7, L * 0.7, -S * 0.2 + bend * 0.6, L * 0.62, bend * 0.5);
  p.bezierCurveTo(L * 0.7, S * 0.2 + bend * 0.6, L * 0.86, S * 0.55 + bend * 0.7, L, S * 1.1 + bend);
  p.bezierCurveTo(L * 0.72, S * 1.0 + bend * 0.4, L * 0.35, S * 0.6, 0, S * 0.22);
  p.closePath();
  return p;
}

type Fin = { path: Path2D; matrix: DOMMatrix; length: number; width: number; rays: number; tail?: { L: number; S: number; bend: number } };

/** `lowPower` trades the soft blurred shadow for a cheaper, lightly blurred one on slow devices. */
export function drawKoi(ctx: CanvasRenderingContext2D, koi: Koi, dpr: number, dark: boolean, time: number, lowPower = false) {
  const { len, pattern } = koi;
  const pts = bodyPoints(koi);
  const n = pts.length;

  const dirs: Point[] = [];
  const widths: number[] = [];
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.max(1, i)];
    const dir = norm(a.x - b.x, a.y - b.y);
    const w = len * 0.125 * profile(i / (n - 1));
    dirs.push(dir);
    widths.push(w);
    left.push({ x: pts[i].x - dir.y * w, y: pts[i].y + dir.x * w });
    right.push({ x: pts[i].x + dir.y * w, y: pts[i].y - dir.x * w });
  }
  const at = (u: number) => Math.min(n - 1, Math.round(u * (n - 1)));
  const deg = (r: number) => (r * 180) / Math.PI;

  // Body outline: down one side, round the tail stalk, up the other, round the nose.
  const w0 = widths[0];
  const nose = { x: pts[0].x + dirs[0].x * w0 * 1.3, y: pts[0].y + dirs[0].y * w0 * 1.3 };
  const body = new Path2D();
  body.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < n; i++) {
    body.quadraticCurveTo(left[i - 1].x, left[i - 1].y, (left[i - 1].x + left[i].x) / 2, (left[i - 1].y + left[i].y) / 2);
  }
  body.lineTo(left[n - 1].x, left[n - 1].y);
  body.lineTo(right[n - 1].x, right[n - 1].y);
  for (let i = n - 1; i > 0; i--) {
    body.quadraticCurveTo(right[i].x, right[i].y, (right[i].x + right[i - 1].x) / 2, (right[i].y + right[i - 1].y) / 2);
  }
  body.lineTo(right[0].x, right[0].y);
  body.bezierCurveTo(
    right[0].x + dirs[0].x * w0 * 0.9,
    right[0].y + dirs[0].y * w0 * 0.9,
    nose.x + dirs[0].y * w0 * 0.75,
    nose.y - dirs[0].x * w0 * 0.75,
    nose.x,
    nose.y,
  );
  body.bezierCurveTo(
    nose.x - dirs[0].y * w0 * 0.75,
    nose.y + dirs[0].x * w0 * 0.75,
    left[0].x + dirs[0].x * w0 * 0.9,
    left[0].y + dirs[0].y * w0 * 0.9,
    left[0].x,
    left[0].y,
  );
  body.closePath();

  // Fins, each built in its own local space and placed with a matrix.
  const fins: Fin[] = [];

  // Tail: two long soft lobes that trail and flex behind each tail beat.
  const tail = pts[n - 1];
  const back = norm(pts[n - 1].x - pts[n - 2].x, pts[n - 1].y - pts[n - 2].y);
  const swing = Math.cos(koi.beat - WAVE) * (0.25 + 0.3 * koi.thrust);
  const L = len * 0.42;
  const S = len * 0.2 * (0.92 + 0.08 * Math.sin(koi.beat * 2));
  const bend = swing * L * 0.45;
  fins.push({
    path: tailPath(L, S, bend),
    matrix: new DOMMatrix().translate(tail.x, tail.y).rotate(deg(Math.atan2(back.y, back.x) + swing * 0.5)),
    length: L,
    width: S,
    rays: 7,
    tail: { L, S, bend },
  });

  // Pectoral fins behind the head spread wide when slow or turning and fold
  // back against the body when sprinting; the pelvic fins are smaller.
  for (const [u, fl, fw, spread] of [
    [0.2, len * 0.22, len * 0.1, 1.05 - 0.6 * koi.thrust],
    [0.5, len * 0.11, len * 0.05, 0.85 - 0.3 * koi.thrust],
  ]) {
    const i = at(u);
    for (const s of [-1, 1]) {
      const paddle = Math.sin(koi.beat * 0.5 + (s > 0 ? 0 : 1.3)) * 0.14;
      const bx = pts[i].x - dirs[i].y * widths[i] * 0.8 * s;
      const by = pts[i].y + dirs[i].x * widths[i] * 0.8 * s;
      fins.push({
        path: finPath(fl, fw),
        matrix: new DOMMatrix()
          .translate(bx, by)
          .rotate(deg(Math.atan2(dirs[i].y, dirs[i].x) + Math.PI - s * (spread + paddle)))
          .scale(1, s),
        length: fl,
        width: fw,
        rays: 5,
      });
    }
  }

  // Shadow on the pond floor: the whole silhouette, fins and all, drawn
  // far off-canvas so only its blurred shadow lands (offset) in view.
  const silhouette = new Path2D(body);
  for (const f of fins) silhouette.addPath(f.path, f.matrix);
  const FAR = 10000;
  ctx.save();
  ctx.translate(-FAR, 0);
  ctx.shadowColor = dark ? "rgba(0, 0, 0, 0.5)" : "rgba(20, 60, 60, 0.26)";
  ctx.shadowBlur = lowPower ? 2 : 6 * dpr;
  ctx.shadowOffsetX = (FAR + len * 0.14) * dpr;
  ctx.shadowOffsetY = len * 0.22 * dpr;
  ctx.fillStyle = "#000";
  ctx.fill(silhouette);
  ctx.restore();

  // Fins sit under the body: translucent, with fine rays.
  // At night the water is dark, so fins need more body to still read as pale.
  const finAlpha = dark ? 0.86 : 0.78;
  for (const f of fins) {
    ctx.save();
    ctx.setTransform(ctx.getTransform().multiply(f.matrix));
    ctx.globalAlpha = finAlpha;
    ctx.fillStyle = pattern.fin;
    ctx.fill(f.path);
    ctx.clip(f.path);
    ctx.strokeStyle = pattern.ray;
    ctx.lineWidth = 0.55;
    ctx.globalAlpha = 1;
    for (let r = 0; r < f.rays; r++) {
      const t = (r + 0.5) / f.rays - 0.5;
      ctx.beginPath();
      if (f.tail) {
        const { L: tl, S: ts, bend: tb } = f.tail;
        ctx.moveTo(0, t * ts * 0.3);
        ctx.quadraticCurveTo(tl * 0.5, t * ts * 1.1 + tb * 0.3, tl * 1.05, t * ts * 2.4 + tb);
      } else {
        ctx.moveTo(0, t * f.width * 0.3);
        ctx.lineTo(f.length * 1.05, -f.width * 0.45 + (t + 0.5) * f.width * 1.2 - f.width * 0.5);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Body
  ctx.fillStyle = pattern.base;
  ctx.fill(body);

  const maxW = len * 0.125;
  ctx.save();
  ctx.clip(body);

  // Colour patches
  for (const b of koi.blobs) {
    const i0 = Math.floor(b.at * (n - 1));
    const p = pts[i0];
    const off = b.off * widths[i0];
    const r = b.r * maxW * 1.4;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(p.x - dirs[i0].y * off, p.y + dirs[i0].x * off, r * b.stretch, r, Math.atan2(dirs[i0].y, dirs[i0].x), 0, TAU);
    ctx.fill();
  }

  // A hint of scales: rows of small arcs opening towards the head.
  ctx.strokeStyle = "rgba(60, 30, 20, 0.09)";
  ctx.lineWidth = 0.5;
  const scale = maxW * 0.38;
  for (let i = at(0.16); i <= at(0.86); i++) {
    const heading = Math.atan2(dirs[i].y, dirs[i].x);
    const rows = Math.max(1, Math.round(widths[i] / scale));
    for (let r = -rows; r <= rows; r++) {
      const lat = (r + (i % 2) * 0.5) * scale;
      if (Math.abs(lat) > widths[i] * 0.95) continue;
      ctx.beginPath();
      ctx.arc(pts[i].x - dirs[i].y * lat, pts[i].y + dirs[i].x * lat, scale * 0.6, heading + Math.PI / 2, heading + (Math.PI * 3) / 2, true);
      ctx.stroke();
    }
  }

  // Rounded shading: darker at the flanks, a highlight along the back.
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(40, 20, 10, 0.14)";
  ctx.lineWidth = maxW * 0.75;
  ctx.stroke(body);
  const ridge = (from: number, to: number) => {
    ctx.beginPath();
    ctx.moveTo(pts[at(from)].x, pts[at(from)].y);
    for (let i = at(from) + 1; i <= at(to); i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  };
  const glint = pattern.shine ? 0.3 + 0.15 * Math.sin(time / 380 + koi.beat * 0.3) : 0.22;
  ctx.strokeStyle = `rgba(255, 255, 255, ${glint})`;
  ctx.lineWidth = maxW * 0.5;
  ridge(0.04, 0.8);
  ctx.restore();

  // Dorsal fin: a thin translucent fin standing along the middle of the back.
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = pattern.fin;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = maxW * 0.3;
  ridge(0.3, 0.66);
  ctx.strokeStyle = pattern.ray;
  ctx.globalAlpha = 1;
  ctx.lineWidth = 0.6;
  ridge(0.3, 0.66);
  ctx.restore();

  // Barbels: two little whiskers at the mouth (long and flowing on a dragon).
  const heading = Math.atan2(dirs[0].y, dirs[0].x);
  const barbel = koi.dragon ? len * 0.26 : len * 0.07;
  ctx.save();
  ctx.strokeStyle = koi.dragon ? "#C8321F" : "rgba(90, 60, 45, 0.6)";
  ctx.lineWidth = koi.dragon ? 1.2 : 0.8;
  ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    const root = { x: nose.x - dirs[0].y * w0 * 0.35 * s, y: nose.y + dirs[0].x * w0 * 0.35 * s };
    const out = heading + s * 0.55;
    const wave = Math.sin(time / 260 + s) * (koi.dragon ? 0.6 : 0.2);
    ctx.beginPath();
    ctx.moveTo(root.x, root.y);
    ctx.quadraticCurveTo(
      root.x + Math.cos(out) * barbel * 0.5,
      root.y + Math.sin(out) * barbel * 0.5,
      root.x + Math.cos(out + wave + s * 0.6) * barbel,
      root.y + Math.sin(out + wave + s * 0.6) * barbel,
    );
    ctx.stroke();
  }
  ctx.restore();

  // Eyes sit at the sides of the head.
  const e = at(0.07);
  for (const s of [-1, 1]) {
    const ex = pts[e].x - dirs[e].y * widths[e] * 0.84 * s;
    const ey = pts[e].y + dirs[e].x * widths[e] * 0.84 * s;
    const er = Math.max(0.9, len * 0.026);
    ctx.fillStyle = "rgba(20, 16, 14, 0.88)";
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(ex + dirs[e].x * er * 0.3, ey + dirs[e].y * er * 0.3, er * 0.35, 0, TAU);
    ctx.fill();
  }
}
