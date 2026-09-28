/*
  The pond's surface: a small height-field wave simulation. Anything that
  touches the water (a click, food, a landing petal, a passing fish) pushes
  the surface, waves spread and fade, and the slope of the surface is drawn
  as light and shade over the fish below. The slope also pushes floating
  things around, so a fast fish's wake shoves the leaves out of its way.
*/

const DAMPING = 0.975;

export class Water {
  /** Size of one simulation cell in CSS pixels. */
  readonly cell: number;
  private w = 0;
  private h = 0;
  private cur = new Float32Array(0);
  private prev = new Float32Array(0);
  private image: ImageData | null = null;
  private surface: HTMLCanvasElement | null = null;

  constructor(cell = 5) {
    this.cell = cell;
  }

  get sized() {
    return this.w > 0;
  }

  resize(width: number, height: number) {
    this.w = Math.ceil(width / this.cell) + 2;
    this.h = Math.ceil(height / this.cell) + 2;
    this.cur = new Float32Array(this.w * this.h);
    this.prev = new Float32Array(this.w * this.h);
    this.surface = document.createElement("canvas");
    this.surface.width = this.w;
    this.surface.height = this.h;
    this.image = this.surface.getContext("2d")!.createImageData(this.w, this.h);
  }

  /** Push the surface down (positive) or up around a point, in CSS pixels. */
  disturb(x: number, y: number, radius: number, strength: number) {
    const { w, h, cell, cur } = this;
    if (!w) return;
    const cx = x / cell + 1;
    const cy = y / cell + 1;
    const r = Math.max(1, radius / cell);
    const x0 = Math.max(1, Math.floor(cx - r));
    const x1 = Math.min(w - 2, Math.ceil(cx + r));
    const y0 = Math.max(1, Math.floor(cy - r));
    const y1 = Math.min(h - 2, Math.ceil(cy + r));
    for (let yy = y0; yy <= y1; yy++) {
      for (let xx = x0; xx <= x1; xx++) {
        const d = Math.hypot(xx - cx, yy - cy) / r;
        if (d < 1) cur[yy * w + xx] += strength * (0.5 + 0.5 * Math.cos(d * Math.PI));
      }
    }
  }

  step() {
    const { w, h } = this;
    const cur = this.cur;
    const next = this.prev;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        next[i] = ((cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - next[i]) * DAMPING;
      }
    }
    this.prev = cur;
    this.cur = next;
  }

  /** Surface slope at a point: which way (and how hard) the water pushes. */
  slope(x: number, y: number) {
    const { w, h, cell, cur } = this;
    if (w < 3 || h < 3) return { x: 0, y: 0 };
    const gx = Math.min(w - 2, Math.max(1, Math.round(x / cell + 1)));
    const gy = Math.min(h - 2, Math.max(1, Math.round(y / cell + 1)));
    const i = gy * w + gx;
    return { x: cur[i + 1] - cur[i - 1], y: cur[i + w] - cur[i - w] };
  }

  /** Paint the waves as light (slopes facing the light) and shade. */
  render(ctx: CanvasRenderingContext2D, dark: boolean) {
    const { w, h, cell, cur, image, surface } = this;
    if (!image || !surface) return;
    const data = image.data;
    // Pale day water barely shows white highlights, so it leans on shade.
    const gain = dark ? 24 : 48;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        // Light from the top left
        const light = -(cur[i + 1] - cur[i - 1]) * 0.7 - (cur[i + w] - cur[i - w]) * 0.7;
        const o = i * 4;
        if (light > 0) {
          data[o] = 255;
          data[o + 1] = 255;
          data[o + 2] = 255;
          data[o + 3] = Math.min(150, light * gain);
        } else {
          data[o] = dark ? 0 : 20;
          data[o + 1] = dark ? 8 : 48;
          data[o + 2] = dark ? 10 : 44;
          data[o + 3] = Math.min(dark ? 120 : 110, -light * gain * 0.8);
        }
      }
    }
    surface.getContext("2d")!.putImageData(image, 0, 0);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(surface, -cell * 1.5, -cell * 1.5, w * cell, h * cell);
    ctx.restore();
  }
}
