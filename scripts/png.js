import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

export function readPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

export function writePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png));
}

export function idx(x, y, width) {
  return (y * width + x) << 2;
}

export function contentBox(png) {
  const { width, height, data } = png;
  let minx = width;
  let miny = height;
  let maxx = -1;
  let maxy = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[idx(x, y, width) + 3] < 16) continue;
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      if (x > maxx) maxx = x;
      if (y > maxy) maxy = y;
    }
  }
  if (maxx < 0) return null;
  return { x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1 };
}

export function alphaStats(png) {
  const { data } = png;
  let zero = 0;
  let partial = 0;
  let opaque = 0;
  const n = data.length / 4;
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    if (a === 0) zero++;
    else if (a < 255) partial++;
    else opaque++;
  }
  return { zero, partial, opaque, total: n, zeroRatio: zero / n };
}
