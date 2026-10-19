import fs from "node:fs";
import path from "node:path";
import { readPng, writePng, idx, contentBox } from "./png.js";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const manifestPath = arg("--manifest");
const zoneId = arg("--zone");
const previewPath = arg("--preview");
if (!manifestPath || !zoneId) {
  console.error("用法: node scripts/measure.js --manifest <清单.json> --zone <区id> [--preview <拼接.png>]");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const root = path.dirname(path.resolve(manifestPath));
const zone = (manifest.zones || []).find((z) => z.id === zoneId);
if (!zone) {
  console.error("清单里没有这个区: " + zoneId);
  process.exit(1);
}

const rows = [];
for (const piece of zone.pieces || []) {
  if (piece.kind === "场地" || piece.file === "habitat.png") {
    rows.push({ name: piece.name, file: piece.file, skipped: "场地不进 1.15" });
    continue;
  }
  if (!piece.ref_wh) {
    rows.push({ name: piece.name, file: piece.file, skipped: "没有效果图高度" });
    continue;
  }
  const file = path.join(root, zone.id, "assets_png", piece.file);
  if (!fs.existsSync(file)) {
    rows.push({ name: piece.name, file: piece.file, missing: true });
    continue;
  }
  const sprite = readPng(file);
  const box = contentBox(sprite);
  const opaqueH = box ? box.h : 0;
  const refH = piece.ref_wh[1];
  const scale = opaqueH ? Math.round((refH / opaqueH) * 1000) / 1000 : null;
  rows.push({
    name: piece.name,
    file: piece.file,
    ref_wh: piece.ref_wh,
    opaque_wh: box ? [box.w, box.h] : null,
    scale_to_master: scale,
  });
}

const scales = rows.map((r) => r.scale_to_master).filter((n) => typeof n === "number" && n > 0);
let spread = null;
let ok = false;
if (scales.length) {
  spread = Math.round((Math.max(...scales) / Math.min(...scales)) * 1000) / 1000;
  ok = spread <= 1.15;
}

const summary = { zone: zoneId, spread, limit: 1.15, ok_one_scale: ok, rows };
const reportFile = path.join(root, zone.id, "比例报告.json");
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, JSON.stringify(summary, null, 2));

if (previewPath && manifest.effect) {
  const master = readPng(path.join(root, manifest.effect));
  for (const piece of zone.pieces || []) {
    if (!piece.ref_box || piece.placed === false) continue;
    const file = path.join(root, zone.id, "assets_png", piece.file);
    if (!fs.existsSync(file)) continue;
    const sprite = readPng(file);
    const box = contentBox(sprite);
    if (!box) continue;
    const [x, y, w, h] = piece.ref_box;
    blit(master, sprite, box, x, y, w, h, piece.flip === "lr");
  }
  writePng(path.resolve(previewPath), master);
  summary.preview = path.resolve(previewPath);
}

console.log(JSON.stringify(summary, null, 2));
if (!ok) process.exit(3);

function blit(dst, src, box, x, y, w, h, flip) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const sx = box.x + Math.min(box.w - 1, Math.floor(((flip ? w - 1 - dx : dx) * box.w) / w));
      const sy = box.y + Math.min(box.h - 1, Math.floor((dy * box.h) / h));
      const s = idx(sx, sy, src.width);
      const a = src.data[s + 3] / 255;
      if (a <= 0) continue;
      const px = Math.round(x + dx);
      const py = Math.round(y + dy);
      if (px < 0 || py < 0 || px >= dst.width || py >= dst.height) continue;
      const d = idx(px, py, dst.width);
      for (let c = 0; c < 3; c++) {
        dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      }
      dst.data[d + 3] = 255;
    }
  }
}
