/*
  The site's small sound layer. Everything is synthesised with the Web Audio
  API, so there are no files to load, and sounds only ever play in response to
  something the visitor did. Visitors can mute it; the choice is remembered.
*/

const STORAGE_KEY = "sound";
const VOLUME = 0.5;

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
const listeners = new Set<(on: boolean) => void>();

export function soundOn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((fn) => fn(on));
}

export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

/** The audio graph, or null when muted or unsupported. */
function audio() {
  if (typeof window === "undefined" || !soundOn()) return null;
  try {
    if (!ctx) {
      ctx = new AudioContext();
      out = ctx.createGain();
      out.gain.value = VOLUME;
      out.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return { ctx, out: out!, now: ctx.currentTime + 0.01 };
  } catch {
    return null;
  }
}

type Audio = NonNullable<ReturnType<typeof audio>>;

function tone(
  a: Audio,
  {
    at,
    length,
    from,
    to = from,
    type = "sine",
    level = 0.1,
    attack = 0.005,
  }: { at: number; length: number; from: number; to?: number; type?: OscillatorType; level?: number; attack?: number },
) {
  const osc = a.ctx.createOscillator();
  const gain = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + length);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(level, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(a.out);
  osc.start(at);
  osc.stop(at + length + 0.05);
}

let noiseBuffer: AudioBuffer | null = null;

/** Filtered white noise: paper, air and wood textures. */
function noise(
  a: Audio,
  {
    at,
    length,
    from,
    to = from,
    q = 1,
    level = 0.1,
    attack = 0.01,
    filter = "bandpass",
  }: {
    at: number;
    length: number;
    from: number;
    to?: number;
    q?: number;
    level?: number;
    attack?: number;
    filter?: BiquadFilterType;
  },
) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== a.ctx.sampleRate) {
    noiseBuffer = a.ctx.createBuffer(1, a.ctx.sampleRate, a.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = a.ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const bq = a.ctx.createBiquadFilter();
  bq.type = filter;
  bq.Q.value = q;
  bq.frequency.setValueAtTime(from, at);
  if (to !== from) bq.frequency.exponentialRampToValueAtTime(to, at + length);
  const gain = a.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(level, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(bq).connect(gain).connect(a.out);
  src.start(at);
  src.stop(at + length + 0.05);
}

/** The mechanical click of a light switch. */
function click(a: Audio, at: number) {
  noise(a, { at, length: 0.03, from: 3200, q: 2, level: 0.18, attack: 0.001, filter: "highpass" });
  tone(a, { at, length: 0.04, from: 1800, to: 900, type: "square", level: 0.02, attack: 0.001 });
}

// D "in" scale: D Eb G A Bb, then the octave
const IN_SCALE = [293.66, 311.13, 392.0, 440.0, 466.16, 587.33];

export const sound = {
  /** A small tick, e.g. when sound is switched back on. */
  tick() {
    const a = audio();
    if (!a) return;
    click(a, a.now);
    tone(a, { at: a.now + 0.02, length: 0.12, from: IN_SCALE[5] * 2, level: 0.03, attack: 0.003 });
  },

  /** Changing the theme, either way: a switch click, then a soft low tone. */
  themeSwitch() {
    const a = audio();
    if (!a) return;
    click(a, a.now);
    const t = a.now + 0.04;
    tone(a, { at: t, length: 0.7, from: 392, to: 196, level: 0.06, attack: 0.01 });
    tone(a, { at: t, length: 0.6, from: 196, to: 130.8, type: "triangle", level: 0.04, attack: 0.01 });
  },

  /** An ink seal pressed onto paper: a soft thunk with a little paper. */
  stamp() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.16, from: 180, to: 60, level: 0.22, attack: 0.002 });
    noise(a, { at: a.now, length: 0.07, from: 1200, q: 0.8, level: 0.08, attack: 0.002 });
    tone(a, { at: a.now + 0.07, length: 0.22, from: IN_SCALE[5] * 2, level: 0.025, attack: 0.004 });
  },

  /** Shoji doors sliding shut (`seconds` long), meeting with a wooden clack. */
  shojiClose(seconds: number) {
    const a = audio();
    if (!a) return;
    noise(a, { at: a.now, length: seconds, from: 500, to: 1400, q: 1.2, level: 0.07, attack: seconds * 0.6 });
    // Hyoshigi: two blocks of wood struck together
    const t = a.now + seconds - 0.02;
    tone(a, { at: t, length: 0.09, from: 1050, to: 900, type: "triangle", level: 0.2, attack: 0.001 });
    tone(a, { at: t, length: 0.06, from: 2350, type: "sine", level: 0.06, attack: 0.001 });
    noise(a, { at: t, length: 0.04, from: 2500, q: 3, level: 0.12, attack: 0.001 });
  },

  /** Shoji doors sliding open after `delay` seconds. */
  shojiOpen(delay: number, seconds: number) {
    const a = audio();
    if (!a) return;
    noise(a, { at: a.now + delay, length: seconds, from: 1400, to: 450, q: 1.2, level: 0.05, attack: 0.12 });
  },

  /** Food hitting the water: a drop's rising "plip" and a little splash. */
  plop() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.09, from: 380, to: 1300, level: 0.16, attack: 0.002 });
    tone(a, { at: a.now + 0.05, length: 0.08, from: 700, to: 1500, level: 0.06, attack: 0.002 });
    noise(a, { at: a.now, length: 0.12, from: 2200, to: 900, q: 0.9, level: 0.05, attack: 0.003 });
  },

  /** A koi snapping up a pellet. */
  gulp() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.07, from: 520, to: 190, level: 0.07, attack: 0.003 });
  },

  /** Tapping a fish on the nose. */
  boop() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.12, from: 660, to: 990, type: "triangle", level: 0.1, attack: 0.004 });
  },

  /** A quiet bubble as a fish starts talking. */
  blub() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.06, from: 420, to: 760, level: 0.035, attack: 0.003 });
    tone(a, { at: a.now + 0.07, length: 0.05, from: 520, to: 900, level: 0.025, attack: 0.003 });
  },

  /** A hungry fish's tummy: a low, wobbly rumble. */
  grumble() {
    const a = audio();
    if (!a) return;
    tone(a, { at: a.now, length: 0.35, from: 110, to: 85, type: "triangle", level: 0.09, attack: 0.03 });
    tone(a, { at: a.now + 0.22, length: 0.3, from: 95, to: 70, type: "triangle", level: 0.07, attack: 0.03 });
  },

  /** The fish go on strike: a chanting "oi! oi! oi!" of bubbly shouts. */
  protest() {
    const a = audio();
    if (!a) return;
    for (let i = 0; i < 3; i++) {
      const at = a.now + i * 0.26;
      tone(a, { at, length: 0.14, from: 520, to: 380, type: "square", level: 0.05, attack: 0.004 });
      tone(a, { at, length: 0.12, from: 780, to: 560, type: "triangle", level: 0.04, attack: 0.004 });
      noise(a, { at, length: 0.08, from: 1500, q: 1.5, level: 0.03, attack: 0.003 });
    }
  },

  /** Something magical happened in the pond (an easter egg). */
  sparkle() {
    const a = audio();
    if (!a) return;
    [IN_SCALE[0] * 2, IN_SCALE[2] * 2, IN_SCALE[3] * 2, IN_SCALE[5] * 2, IN_SCALE[2] * 4].forEach((f, i) => {
      tone(a, { at: a.now + i * 0.08, length: 0.5, from: f, level: 0.05, attack: 0.003 });
      tone(a, { at: a.now + i * 0.08, length: 0.25, from: f * 2.76, level: 0.012, attack: 0.003 });
    });
  },

  /**
   * The portrait's CRT swap: a power-down sweep, a blip per row as the cube
   * turns, and a chime once it resolves. Times are in milliseconds.
   */
  pixelSwap({ rows, turnStart, rowGap, turnEnd }: { rows: number; turnStart: number; rowGap: number; turnEnd: number }, quick = false) {
    const a = audio();
    if (!a) return;
    const s = (ms: number) => a.now + ms / 1000;
    if (!quick) {
      tone(a, { at: s(0), length: 0.22, from: 880, to: 180, type: "square", level: 0.09 });
      for (let r = 0; r < rows; r++) {
        const f = IN_SCALE[r % IN_SCALE.length] * 2;
        tone(a, { at: s(turnStart + r * rowGap), length: 0.05, from: f, type: "square", level: 0.065 });
      }
    }
    const end = s(quick ? 0 : turnEnd);
    [IN_SCALE[5], IN_SCALE[2] * 2, IN_SCALE[3] * 2].forEach((f, i) =>
      tone(a, { at: end + i * 0.07, length: 0.16, from: f, type: "triangle", level: 0.1 }),
    );
  },
};
