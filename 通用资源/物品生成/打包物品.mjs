import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PNG } from 'file:///D:/creator/FFrame-asset-line/node_modules/pngjs/lib/png.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, '已处理');
const game = 'D:/creator/FFrame/assets/game/bundles/Skin/ZooV7';
const original = JSON.parse(readFileSync('D:/creator/FFrame-asset-line/style/ZooV7/物品/item.json', 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(root, '物品采用清单.json'), 'utf8'));
const decode = file => PNG.sync.read(readFileSync(file));
const save = (file, png) => writeFileSync(file, PNG.sync.write(png));
const sheets = Object.fromEntries(Object.entries(manifest.sheets).map(([key, file]) => [key, decode(path.join(root, file))]));
const slots = original.slots;
assert.deepEqual(manifest.slots.map(s => s.name).sort(), Object.keys(slots).sort());
for (const png of Object.values(sheets)) assert.deepEqual([png.width, png.height], [1024, 1024]);

function cutout(png) {
  // These generated sheets have neutral near-white backgrounds, including enclosed holes.
  // ponytail: threshold is specific to these two sheets; inspect masks before reusing on white objects.
  for (let i = 0; i < png.data.length; i += 4) {
    const rgb = [...png.data.subarray(i, i + 3)];
    if (Math.min(...rgb) >= 242 && Math.max(...rgb) - Math.min(...rgb) <= 8) png.data.fill(0, i, i + 4);
  }
  return png;
}
const fixture = new PNG({ width: 2, height: 1 });
fixture.data.set([253, 253, 253, 255, 255, 240, 180, 255]);
cutout(fixture);
assert.equal(fixture.data[3], 0);
assert.equal(fixture.data[7], 255); // cream object pixels remain opaque

function bounds(png) {
  let x0 = png.width, y0 = png.height, x1 = -1, y1 = -1;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) {
    if (!png.data[(y * png.width + x) * 4 + 3]) continue;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  assert(x1 >= x0, 'Empty icon');
  assert(x0 > 0 && y0 > 0 && x1 < png.width - 1 && y1 < png.height - 1, 'Icon touches crop boundary');
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function fit(src, box, size, pad) {
  const dst = new PNG({ width: size, height: size });
  const scale = Math.min((size - 2 * pad) / box.w, (size - 2 * pad) / box.h);
  const w = Math.max(1, Math.round(box.w * scale)), h = Math.max(1, Math.round(box.h * scale));
  const ox = Math.floor((size - w) / 2), oy = Math.floor((size - h) / 2);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = box.x + Math.min(box.w - 1, Math.floor(x * box.w / w));
    const sy = box.y + Math.min(box.h - 1, Math.floor(y * box.h / h));
    const si = (sy * src.width + sx) * 4, di = ((y + oy) * size + x + ox) * 4;
    src.data.copy(dst.data, di, si, si + 4);
  }
  return dst;
}

mkdirSync(path.join(output, 'icons'), { recursive: true });
const source = new PNG({ width: 2048, height: 2048 });
const runtime = new PNG({ width: 1024, height: 1024 });
const preview = new PNG({ width: 640, height: 560 });
const meta = JSON.parse(readFileSync(path.join(game, 'item.plist.meta'), 'utf8'));
const plist = readFileSync(path.join(game, 'item.plist'), 'utf8');
const stats = [];
let index = 0;
for (const [name, slot] of Object.entries(slots)) {
  const selected = manifest.slots.find(s => s.name === name);
  const cell = new PNG({ width: 256, height: 256 });
  PNG.bitblt(sheets[selected.sheet], cell, (selected.col - 1) * 256, (selected.row - 1) * 256, 256, 256, 0, 0);
  cutout(cell);
  const box = bounds(cell);
  const icon = fit(cell, box, 128, 8);
  save(path.join(output, 'icons', `${name}.png`), icon);
  const [x, y, w, h] = slot.rect;
  assert.equal(w, 128); assert.equal(h, 128);
  assert(x >= 0 && y >= 0 && x + w <= 2048 && y + h <= 2048);
  PNG.bitblt(icon, source, 0, 0, 128, 128, x, y);
  const small = new PNG({ width: 64, height: 64 });
  for (let sy = 0; sy < 64; sy++) for (let sx = 0; sx < 64; sx++) {
    const si = ((sy * 2) * 128 + sx * 2) * 4;
    icon.data.copy(small.data, (sy * 64 + sx) * 4, si, si + 4);
  }
  PNG.bitblt(small, runtime, 0, 0, 64, 64, x / 2, y / 2);
  const entry = Object.values(meta.subMetas).find(s => s.name === name);
  assert(entry, `Missing meta: ${name}`);
  assert.deepEqual([entry.userData.trimX, entry.userData.trimY, entry.userData.width, entry.userData.height], [x / 2, y / 2, 64, 64]);
  const start = plist.indexOf(`<key>${name}.png</key>`);
  assert(start >= 0 && plist.slice(start, plist.indexOf('</dict>', start)).includes(`{{${x / 2},${y / 2}},{64,64}}`), `plist rect mismatch: ${name}`);
  delete slot.standIn;
  const px = (index % 8) * 80 + 8, py = Math.floor(index / 8) * 140 + 4;
  for (let background = 0; background < 2; background++) {
    for (let sy = 0; sy < 64; sy++) for (let sx = 0; sx < 64; sx++) {
      const si = (sy * 64 + sx) * 4, di = ((py + background * 68 + sy) * preview.width + px + sx) * 4;
      const bg = background ? [40, 50, 65] : [225, 225, 225];
      const alpha = small.data[si + 3] / 255;
      for (let c = 0; c < 3; c++) preview.data[di + c] = Math.round(small.data[si + c] * alpha + bg[c] * (1 - alpha));
      preview.data[di + 3] = 255;
    }
  }
  stats.push({ name, sourceBounds: box, sheet: selected.sheet, row: selected.row, col: selected.col, rect: slot.rect });
  index++;
}
save(path.join(output, 'item-source-2048.png'), source);
save(path.join(output, 'item.png'), runtime);
save(path.join(output, '物品64像素-浅深底预览.png'), preview);
writeFileSync(path.join(output, 'item.plist'), plist);
writeFileSync(path.join(output, 'item.json'), JSON.stringify(original, null, 4) + '\n');
writeFileSync(path.join(output, '检查报告.json'), JSON.stringify({ count: index, sourceSize: [2048, 2048], runtimeSize: [1024, 1024], metaPreserved: true, items: stats }, null, 2) + '\n');
console.log(`Processed ${index} unique icons; source 2048; runtime 1024; existing plist coordinates and UUID metadata verified. ${output}`);
if (process.argv.includes('--verify-synced')) {
  assert.deepEqual(readFileSync(path.join(game, 'item.png')), PNG.sync.write(runtime));
  assert.equal(readFileSync(path.join(game, 'item.plist'), 'utf8'), plist);
  assert.deepEqual(readFileSync('D:/creator/FFrame-asset-line/style/ZooV7/物品/item.png'), PNG.sync.write(source));
  for (const file of ['item.png.meta', 'item.plist.meta']) {
    assert.deepEqual(readFileSync(path.join(game, file)), readFileSync(path.join(output, '替换前备份', file)));
  }
  assert.equal(new Set(Object.keys(slots).map(name => readFileSync(path.join(output, 'icons', `${name}.png`)).toString('base64'))).size, 28);
  console.log('PASS: source/runtime pixels synchronized; 28 distinct icons; original plist and texture UUID metadata unchanged.');
}
