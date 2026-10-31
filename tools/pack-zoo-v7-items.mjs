#!/usr/bin/env node
/**
 * 把 history/v1/raw 里的物品图标收成 2048 图集。
 * 缺的名字用现成图复制一份，允许和别的槽相同。
 * 用法：node tools/pack-zoo-v7-items.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = path.join(root, 'style', 'ZooV7', '物品', 'history', 'v1', 'raw');
const outDir = path.join(root, 'style', 'ZooV7', '物品');
const SHEET = 2048;
const CELL = 128;
const PAD = 8;
const GAP = 32;
const STRIDE = CELL + GAP;

const names = [
    'icon_gold', 'icon_diamond', 'icon_energy', 'icon_ad', 'icon_music', 'icon_sfx', 'icon_settings', 'icon_play',
    'icon_heart', 'icon_star', 'icon_chest', 'icon_gift', 'icon_key', 'icon_ticket', 'icon_clock', 'icon_trophy',
    'icon_crown', 'icon_lock', 'icon_shop', 'icon_mail', 'icon_check', 'icon_home', 'icon_pause', 'icon_bag',
    'icon_map', 'icon_wood', 'icon_leaf', 'icon_meat',
];

const standIn = {
    icon_check: 'icon_star',
    icon_home: 'icon_shop',
    icon_pause: 'icon_play',
    icon_bag: 'icon_gift',
    icon_map: 'icon_mail',
    icon_wood: 'icon_key',
    icon_leaf: 'icon_heart',
    icon_meat: 'icon_trophy',
};

function ensureRaw(name) {
    const dest = path.join(rawDir, name + '.png');
    if (existsSync(dest)) return;
    const from = standIn[name];
    if (!from) throw new Error('缺 ' + name);
    copyFileSync(path.join(rawDir, from + '.png'), dest);
}

function knockout(png) {
    const { width, height, data } = png;
    const seen = new Uint8Array(width * height);
    const queue = [];
    function push(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const i = y * width + x;
        if (seen[i]) return;
        const p = i * 4;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (min < 220 || max - min > 30) return; // 连着边缘的浅灰、奶油底去掉，物体内部的色块留下
        seen[i] = 1;
        data[p + 3] = 0;
        queue.push(x, y);
    }
    for (let x = 0; x < width; x++) {
        push(x, 0);
        push(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
        push(0, y);
        push(width - 1, y);
    }
    for (let k = 0; k < queue.length; k += 2) {
        const x = queue[k];
        const y = queue[k + 1];
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
    }
}

function bbox(png) {
    const { width, height, data } = png;
    let x0 = width;
    let y0 = height;
    let x1 = 0;
    let y1 = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] === 0) continue;
            if (x < x0) x0 = x;
            if (y < y0) y0 = y;
            if (x > x1) x1 = x;
            if (y > y1) y1 = y;
        }
    }
    if (x1 < x0) return null;
    return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function blit(src, box, dst, cellX, cellY) {
    const inner = CELL - PAD * 2;
    const scale = Math.min(inner / box.w, inner / box.h);
    const dw = Math.max(1, Math.round(box.w * scale));
    const dh = Math.max(1, Math.round(box.h * scale));
    const ox = cellX + Math.floor((CELL - dw) / 2);
    const oy = cellY + Math.floor((CELL - dh) / 2);
    for (let y = 0; y < dh; y++) {
        const sy = box.y + Math.min(box.h - 1, Math.floor(y * box.h / dh));
        for (let x = 0; x < dw; x++) {
            const sx = box.x + Math.min(box.w - 1, Math.floor(x * box.w / dw));
            const sp = (sy * src.width + sx) * 4;
            if (src.data[sp + 3] === 0) continue;
            const dp = ((oy + y) * SHEET + (ox + x)) * 4;
            dst[dp] = src.data[sp];
            dst[dp + 1] = src.data[sp + 1];
            dst[dp + 2] = src.data[sp + 2];
            dst[dp + 3] = 255;
        }
    }
}

const cols = Math.floor((SHEET - GAP) / STRIDE);
const slots = {};
const sheet = new PNG({ width: SHEET, height: SHEET });
names.forEach((name, index) => {
    ensureRaw(name);
    const png = PNG.sync.read(readFileSync(path.join(rawDir, name + '.png')));
    knockout(png);
    const box = bbox(png);
    if (!box) throw new Error(name + ' 抠完是空的');
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = GAP + col * STRIDE;
    const y = GAP + row * STRIDE;
    blit(png, box, sheet.data, x, y);
    slots[name] = {
        rect: [x, y, CELL, CELL],
        border: [0, 0, 0, 0],
        sliced: false,
        display: [64, 64],
        standIn: standIn[name] || undefined,
    };
});

const json = {
    sheet: 'item.png',
    size: [SHEET, SHEET],
    theme: 'ZooV7',
    slots,
};
writeFileSync(path.join(outDir, 'item.png'), PNG.sync.write(sheet));
writeFileSync(path.join(outDir, 'item.json'), JSON.stringify(json, null, 4) + '\n');
console.log('slots', names.length, 'copied', Object.keys(standIn).join(','));
