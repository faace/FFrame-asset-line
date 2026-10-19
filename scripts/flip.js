import path from "node:path";
import { readPng, writePng, idx } from "./png.js";

const input = process.argv[2];
const outFlag = process.argv.indexOf("--out");
const output = outFlag >= 0 ? process.argv[outFlag + 1] : null;

if (!input || !output) {
  console.error("用法: node scripts/flip.js <输入.png> --out <输出.png>");
  process.exit(1);
}

const src = readPng(input);
const { width, height, data } = src;
const dst = new Uint8Array(data.length);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const s = idx(x, y, width);
    const d = idx(width - 1 - x, y, width);
    dst[d] = data[s];
    dst[d + 1] = data[s + 1];
    dst[d + 2] = data[s + 2];
    dst[d + 3] = data[s + 3];
  }
}
src.data = Buffer.from(dst);
const file = path.resolve(output);
writePng(file, src);
console.log(JSON.stringify({ flipped: "lr", out: file, wh: [width, height] }));
