#!/usr/bin/env node
/**
 * 把 ZooV7 的 2048 源图收成 Creator 3.8 能导入的 plist。
 * 源图留在素材仓库。写进游戏工程的是一半尺寸的 png，外加同名 plist。
 * 九宫格不写进 plist（plist 只记矩形）。边长减半后打印出来，由导入后的子图 border 使用。
 * 用法：node tools/export-zoo-v7-plist.mjs
 *       node tools/export-zoo-v7-plist.mjs --borders   只把九宫格写进已经导入的 plist.meta
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameOut = path.join(root, '..', 'FFrame', 'assets', 'game', 'bundles', 'Skin', 'ZooV7');
const noteDir = path.join(root, '..', 'FFrame', 'del', 'ZooV7九宫格');

const jobs = [
    {
        name: 'ctrl',
        png: path.join(root, 'style', 'ZooV7', '控件', 'ctrl.png'),
        json: path.join(root, 'style', 'ZooV7', '控件', 'ctrl.json'),
    },
    {
        name: 'item',
        png: path.join(root, 'style', 'ZooV7', '物品', 'item.png'),
        json: path.join(root, 'style', 'ZooV7', '物品', 'item.json'),
    },
];

function half(n, label) {
    if (n % 2 !== 0) throw new Error(label + ' 不是偶数，不能对半：' + n);
    return n / 2;
}

function halveImage(src) {
    const w = half(src.width, '宽');
    const h = half(src.height, '高');
    const out = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const si = ((y * 2) * src.width + (x * 2)) << 2;
            const di = (y * w + x) << 2;
            out.data[di] = src.data[si];
            out.data[di + 1] = src.data[si + 1];
            out.data[di + 2] = src.data[si + 2];
            out.data[di + 3] = src.data[si + 3];
        }
    }
    return out;
}

function plistText(fileName, size, frames) {
    const body = frames.map((frame) => `		<key>${frame.name}.png</key>
		<dict>
			<key>aliases</key>
			<array/>
			<key>spriteOffset</key>
			<string>{0,0}</string>
			<key>spriteSize</key>
			<string>{${frame.w},${frame.h}}</string>
			<key>spriteSourceSize</key>
			<string>{${frame.w},${frame.h}}</string>
			<key>textureRect</key>
			<string>{{${frame.x},${frame.y}},{${frame.w},${frame.h}}}</string>
			<key>textureRotated</key>
			<false/>
		</dict>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>frames</key>
	<dict>
${body}
	</dict>
	<key>metadata</key>
	<dict>
		<key>format</key>
		<integer>3</integer>
		<key>pixelFormat</key>
		<string>RGBA8888</string>
		<key>premultiplyAlpha</key>
		<false/>
		<key>realTextureFileName</key>
		<string>${fileName}</string>
		<key>size</key>
		<string>{${size},${size}}</string>
		<key>textureFileName</key>
		<string>${fileName}</string>
	</dict>
</dict>
</plist>
`;
}

function exportOne(job) {
    const sheet = JSON.parse(readFileSync(job.json, 'utf8'));
    const src = PNG.sync.read(readFileSync(job.png));
    const image = halveImage(src);
    const frames = [];
    const borders = {};
    for (const name of Object.keys(sheet.slots ?? {})) {
        const slot = sheet.slots[name];
        if (!slot || slot.reserved) continue;
        const [x, y, w, h] = slot.rect;
        if (!(w > 0 && h > 0)) continue;
        const frame = {
            name,
            x: half(x, name + ' x'),
            y: half(y, name + ' y'),
            w: half(w, name + ' w'),
            h: half(h, name + ' h'),
        };
        frames.push(frame);
        const border = slot.sliced && slot.border
            ? slot.border.map((n, i) => half(n, name + ' border' + i))
            : [0, 0, 0, 0];
        borders[name] = { border, sliced: !!slot.sliced, size: [frame.w, frame.h] };
    }
    const pngName = job.name + '.png';
    writeFileSync(path.join(gameOut, pngName), PNG.sync.write(image));
    writeFileSync(path.join(gameOut, job.name + '.plist'), plistText(pngName, image.width, frames));
    for (const extra of [job.name + '.json', job.name + '.json.meta']) {
        const file = path.join(gameOut, extra);
        if (existsSync(file)) unlinkSync(file);
    }
    return { name: job.name, size: image.width, count: frames.length, borders };
}

function applyBorders(result) {
    let changed = 0;
    for (const item of result) {
        const metaPath = path.join(gameOut, item.name + '.plist.meta');
        if (!existsSync(metaPath)) {
            console.log(item.name + '.plist.meta 还没有，等编辑器导入后再跑 --borders');
            continue;
        }
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
        for (const sub of Object.values(meta.subMetas ?? {})) {
            const row = item.borders[sub.name];
            if (!row || !sub.userData) continue;
            const [l, r, t, b] = row.border;
            sub.userData.borderLeft = l;
            sub.userData.borderRight = r;
            sub.userData.borderTop = t;
            sub.userData.borderBottom = b;
            sub.userData.trimType = 'none'; // 自动裁透明边会把九宫格的角裁掉
            sub.userData.packable = false;
            changed++;
        }
        writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    }
    console.log('写入九宫格', changed, '帧');
}

if (!existsSync(gameOut)) throw new Error('游戏主题目录不存在：' + gameOut);
mkdirSync(noteDir, { recursive: true });
const bordersOnly = process.argv.includes('--borders');
const notePath = path.join(noteDir, 'borders.json');
const result = bordersOnly ? JSON.parse(readFileSync(notePath, 'utf8')) : jobs.map(exportOne);
if (!bordersOnly) writeFileSync(notePath, JSON.stringify(result, null, 4) + '\n');
applyBorders(result);
if (bordersOnly) process.exit(0);
for (const item of result) {
    console.log(item.name, item.size + 'x' + item.size, item.count + ' 帧');
    for (const name of Object.keys(item.borders)) {
        const row = item.borders[name];
        if (!row.sliced) continue;
        console.log(' ', name, row.size.join('x'), '边', row.border.join(','));
    }
}
