import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { readPng, writePng, idx, alphaStats, contentBox } from "./png.js";

const PAD = 16;
const BG_CUTOFF = 72;
const BG_SOLID = 140;
const MIN_AREA = 800;
const MAX_ASPECT_IF_SMALL = 18;
const SMALL_FOR_ASPECT = 4000;
const ALPHA_EMPTY = 16;

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  if (i < 0) return fallback;
  return process.argv[i + 1];
}

const srcPath = process.argv[2];
const outDir = arg("--out");
const names = (arg("--names", "") || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const whole = process.argv.includes("--whole");

if (!srcPath || !outDir) {
  console.error("用法: node scripts/cut.js <sheet.png> --out <目录> --names a,b [--whole]");
  process.exit(1);
}

function dist(c, bg) {
  return Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]);
}

function backgroundColor(png) {
  const { width, height, data } = png;
  const samples = [];
  const stepX = Math.max(1, Math.floor(width / 48));
  const stepY = Math.max(1, Math.floor(height / 48));
  const take = (x, y) => {
    const i = idx(x, y, width);
    samples.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < width; x += stepX) {
    take(x, 2);
    take(x, height - 3);
  }
  for (let y = 0; y < height; y += stepY) {
    take(2, y);
    take(width - 3, y);
  }
  samples.sort((a, b) => a[0] + a[2] - a[1] - (b[0] + b[2] - b[1]));
  const mid = samples[Math.floor(samples.length / 2)];
  const near = samples.filter((c) => dist(c, mid) < 80);
  const use = near.length ? near : samples;
  return [0, 1, 2].map((ch) => Math.round(use.reduce((s, c) => s + c[ch], 0) / use.length));
}

function isPinkEmpty(r, g, b) {
  return r > g + 40 && b > g + 40 && Math.abs(r - b) < 50;
}

function components(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const out = [];
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    const q = [start];
    seen[start] = 1;
    let area = 0;
    let minx = start % w;
    let maxx = minx;
    let miny = Math.floor(start / w);
    let maxy = miny;
    for (let qi = 0; qi < q.length; qi++) {
      const i = q[qi];
      area++;
      const x = i % w;
      const y = Math.floor(i / w);
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      for (const j of [i - 1, i + 1, i - w, i + w]) {
        if (j < 0 || j >= w * h || seen[j] || !mask[j]) continue;
        if (Math.abs((j % w) - x) + Math.abs(Math.floor(j / w) - y) !== 1) continue;
        seen[j] = 1;
        q.push(j);
      }
    }
    const bw = maxx - minx + 1;
    const bh = maxy - miny + 1;
    const aspect = Math.max(bw, bh) / Math.max(1, Math.min(bw, bh));
    out.push({
      area,
      box: [minx, miny, maxx + 1, maxy + 1],
      aspect: Math.round(aspect * 100) / 100,
    });
  }
  return out;
}

function keep(comp) {
  if (comp.area < MIN_AREA) return false;
  if (comp.aspect > MAX_ASPECT_IF_SMALL && comp.area < SMALL_FOR_ASPECT) return false;
  return true;
}

function blank(w, h) {
  return new PNG({ width: w, height: h });
}

function cropAlpha(png, box) {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0;
  const h = y1 - y0;
  const out = blank(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = idx(x0 + x, y0 + y, png.width);
      const d = idx(x, y, w);
      const a = png.data[s + 3];
      if (a < ALPHA_EMPTY) continue;
      out.data[d] = png.data[s];
      out.data[d + 1] = png.data[s + 1];
      out.data[d + 2] = png.data[s + 2];
      out.data[d + 3] = a;
    }
  }
  return out;
}

function unmix(rgb, bg, alpha) {
  if (alpha >= 250 || alpha <= 0) return rgb;
  const af = alpha / 255;
  return rgb.map((v, i) => {
    const n = (v - bg[i] * (1 - af)) / af;
    return Math.max(0, Math.min(255, Math.round(n)));
  });
}

function cropMagenta(png, bg, box) {
  const [bx0, by0, bx1, by1] = box;
  const x0 = Math.max(0, bx0 - PAD);
  const y0 = Math.max(0, by0 - PAD);
  const x1 = Math.min(png.width, bx1 + PAD);
  const y1 = Math.min(png.height, by1 + PAD);
  const w = x1 - x0;
  const h = y1 - y0;
  const out = blank(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = idx(x0 + x, y0 + y, png.width);
      const r = png.data[s];
      const g = png.data[s + 1];
      const b = png.data[s + 2];
      if (isPinkEmpty(r, g, b)) continue;
      const d = dist([r, g, b], bg);
      if (d <= BG_CUTOFF) continue;
      let alpha = 255;
      let rgb = [r, g, b];
      if (d < BG_SOLID) {
        alpha = Math.round((255 * (d - BG_CUTOFF)) / (BG_SOLID - BG_CUTOFF));
        rgb = unmix(rgb, bg, alpha);
      }
      const o = idx(x, y, w);
      out.data[o] = rgb[0];
      out.data[o + 1] = rgb[1];
      out.data[o + 2] = rgb[2];
      out.data[o + 3] = alpha;
    }
  }
  return out;
}

function padCanvas(png) {
  const box = contentBox(png);
  if (!box) return png;
  const out = blank(box.w + PAD * 2, box.h + PAD * 2);
  for (let y = 0; y < box.h; y++) {
    for (let x = 0; x < box.w; x++) {
      const s = idx(box.x + x, box.y + y, png.width);
      const d = idx(x + PAD, y + PAD, out.width);
      out.data[d] = png.data[s];
      out.data[d + 1] = png.data[s + 1];
      out.data[d + 2] = png.data[s + 2];
      out.data[d + 3] = png.data[s + 3];
    }
  }
  return out;
}

const png = readPng(srcPath);
const stats = alphaStats(png);
const useAlpha = stats.zeroRatio >= 0.01;
const bg = backgroundColor(png);
const pinkBg = isPinkEmpty(bg[0], bg[1], bg[2]);

if (!useAlpha && !pinkBg) {
  const report = {
    ok: false,
    reason: "没有可用的透明通道，边缘也不是品红。这一张改用品红底重画，再切。",
    alpha: stats,
    background: bg,
  };
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}

const mask = new Uint8Array(png.width * png.height);
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const i = idx(x, y, png.width);
    const on = useAlpha
      ? png.data[i + 3] >= ALPHA_EMPTY
      : dist([png.data[i], png.data[i + 1], png.data[i + 2]], bg) > BG_CUTOFF &&
        !isPinkEmpty(png.data[i], png.data[i + 1], png.data[i + 2]);
    if (on) mask[y * png.width + x] = 1;
  }
}

fs.mkdirSync(outDir, { recursive: true });
const saved = [];

if (whole) {
  const box = [0, 0, png.width, png.height];
  const sprite = padCanvas(useAlpha ? cropAlpha(png, box) : cropMagenta(png, bg, [PAD, PAD, png.width - PAD, png.height - PAD]));
  const name = names[0] || "habitat";
  const file = path.join(outDir, `${name}.png`);
  writePng(file, sprite);
  const content = contentBox(sprite);
  saved.push({ file: path.basename(file), png_wh: [sprite.width, sprite.height], opaque_wh: content ? [content.w, content.h] : null });
} else {
  const found = components(mask, png.width, png.height)
    .filter(keep)
    .sort((a, b) => (a.box[0] + a.box[2]) / 2 - (b.box[0] + b.box[2]) / 2);
  found.forEach((comp, i) => {
    const name = names[i] || `extra_${String(i + 1).padStart(2, "0")}`;
    const sprite = padCanvas(useAlpha ? cropAlpha(png, comp.box) : cropMagenta(png, bg, comp.box));
    const file = path.join(outDir, `${name}.png`);
    writePng(file, sprite);
    const content = contentBox(sprite);
    saved.push({
      file: path.basename(file),
      box: comp.box,
      area: comp.area,
      png_wh: [sprite.width, sprite.height],
      opaque_wh: content ? [content.w, content.h] : null,
    });
  });
}

const report = {
  ok: true,
  mode: useAlpha ? "alpha" : "magenta",
  alpha: { zeroRatio: Math.round(stats.zeroRatio * 1000) / 1000 },
  background: bg,
  count: saved.length,
  saved,
};
const reportPath = path.join(outDir, "切图报告.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
