// Canvas shapes drawn at unit size (radius ≈ 1). Built lazily: Path2D is
// browser-only and these modules are also evaluated during prerendering.

let maple: Path2D | null = null;
let petal: Path2D | null = null;

/** Five-lobed maple leaf (momiji) with a short stem, pointing up. */
export function maplePath() {
  if (maple) return maple;
  // [angle in degrees, radius]: lobes alternate with the notches between them.
  const outline: [number, number][] = [
    [120, 0.3], [160, 0.95], [188, 0.42], [215, 1], [245, 0.45], [270, 1.15],
    [295, 0.45], [325, 1], [352, 0.42], [20, 0.95], [60, 0.3],
  ];
  const path = new Path2D();
  outline.forEach(([deg, r], i) => {
    const a = (deg * Math.PI) / 180;
    if (i === 0) path.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else path.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  });
  path.lineTo(0.06, 0.95);
  path.lineTo(-0.06, 0.95);
  path.closePath();
  maple = path;
  return path;
}

/** Sakura petal with the small notch at its tip. */
export function petalPath() {
  if (petal) return petal;
  const path = new Path2D();
  path.moveTo(0, 1);
  path.bezierCurveTo(-0.75, 0.55, -0.7, -0.6, -0.18, -1);
  path.lineTo(0, -0.72);
  path.lineTo(0.18, -1);
  path.bezierCurveTo(0.7, -0.6, 0.75, 0.55, 0, 1);
  path.closePath();
  petal = path;
  return path;
}

export const SAKURA = ["#F4BCCB", "#F7CCD8", "#EDA6BA"];
export const MOMIJI = ["#C8452C", "#D9662F", "#E39A3B", "#B23A2A"];

export const AJISAI = ["#8FA8DC", "#A99AD8", "#B7C9EE", "#C3A6DA"];
export const TSUBAKI = ["#C6283A", "#B81F32", "#D23B4B"];

/** Hydrangea (ajisai) floret: four rounded petals and a pale eye, radius ≈ 1. */
export function drawFloret(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.55, 0.42, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.beginPath();
  ctx.arc(0, 0, 0.18, 0, Math.PI * 2);
  ctx.fill();
}

/** Camellia (tsubaki) blossom seen from above, radius ≈ 1: layered round petals, gold stamens. */
export function drawCamellia(ctx: CanvasRenderingContext2D, color: string) {
  for (const [layer, r, shade] of [
    [0, 1, 0.82],
    [0.6, 0.72, 1],
  ] as const) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + layer;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r * 0.45, Math.sin(a) * r * 0.45, r * 0.52, r * 0.44, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(0, 0, 0, ${(1 - shade) * 0.6})`;
      ctx.fill();
    }
  }
  ctx.fillStyle = "#F4C542";
  ctx.beginPath();
  ctx.arc(0, 0, 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FBE9A6";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 0.16, Math.sin(a) * 0.16, 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
}
