#!/usr/bin/env node
/**
 * 其余界面图：画法和按钮一样（硬像素、纯色块），形状仍是各自的。
 * 标题是带铆钉的木牌，面板是厚框，进度条是胶囊，图标仍是原来的符号。
 * 用法：node tools/temp/draw-skin-plates.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DIRS = ['assets/game/bundles/Skin', 'assets/gmajor/ui/skin'];

const STROKE = [103, 63, 7];
const WOOD = [214, 164, 92];
const WOOD_DK = [176, 124, 58];
const LIP = [236, 206, 150];
const CREAM = [241, 230, 204];
const CREAM_DK = [214, 196, 164];
const INK = [92, 64, 32];
const GREEN = [93, 171, 42];
const GREEN_HI = [130, 200, 64];
const GREEN_DK = [24, 77, 17];
const GOLD = [240, 176, 42];
const GOLD_HI = [255, 214, 90];
const GOLD_DK = [150, 90, 16];
const BLUE = [72, 167, 226];
const BLUE_HI = [150, 214, 245];
const BLUE_DK = [16, 80, 140];
const SELECT = [180, 230, 50];

function sdRoundRect(px, py, x0, y0, x1, y1, r) {
    const hx = (x1 - x0) / 2 - r;
    const hy = (y1 - y0) / 2 - r;
    const dx = Math.abs(px - (x0 + x1) / 2) - hx;
    const dy = Math.abs(py - (y0 + y1) / 2) - hy;
    return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) - r;
}

function blank(w, h) {
    return new Uint8Array(w * h * 4);
}

function put(data, w, h, x, y, rgb) {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
}

function disc(data, w, h, cx, cy, r, rgb) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = x + 0.5 - cx;
            const dy = y + 0.5 - cy;
            if (dx * dx + dy * dy <= r * r) put(data, w, h, x, y, rgb);
        }
    }
}

function insidePoly(px, py, pts) {
    let hit = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i];
        const [xj, yj] = pts[j];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
}

/** 圆角矩形。底边可改成直角，给页签用 */
function paintPlate(w, h, radius, strokeW, stroke, face, squareBottom) {
    const data = blank(w, h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const px = x + 0.5;
            const py = y + 0.5;
            const bottom = squareBottom && py >= h - radius;
            const inside = bottom ? px > 0 && px < w && py > 0 && py < h : sdRoundRect(px, py, 0, 0, w, h, radius) < 0;
            if (!inside) continue;
            let edge = strokeW;
            if (bottom) edge = Math.min(px, w - px, h - py) < strokeW;
            else edge = -sdRoundRect(px, py, 0, 0, w, h, radius) < strokeW;
            put(data, w, h, x, y, edge ? stroke : face);
        }
    }
    return data;
}

function paintFrame(w, h, radius, layers) {
    const data = blank(w, h);
    const total = layers.reduce((sum, layer) => sum + layer[0], 0);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const sd = sdRoundRect(x + 0.5, y + 0.5, 0, 0, w, h, radius);
            if (sd >= 0) continue;
            let depth = -sd;
            let rgb = layers[layers.length - 1][1];
            for (const [band, color] of layers) {
                if (depth < band) { rgb = color; break; }
                depth -= band;
            }
            if (-sd >= total) rgb = layers[layers.length - 1][1];
            put(data, w, h, x, y, rgb);
        }
    }
    return data;
}

function titleBar() {
    const w = 160;
    const h = 85;
    const data = paintPlate(w, h, 18, 3, STROKE, WOOD, false);
    for (const cx of [36, w - 36]) {
        disc(data, w, h, cx, 42, 7, [90, 52, 16]);
        disc(data, w, h, cx - 1, 40, 2, LIP);
    }
    return plate('title_bar', w, h, [20, 20, 48, 48], data);
}

function panel() {
    const data = paintFrame(96, 96, 16, [[3, STROKE], [10, WOOD], [3, LIP], [99, CREAM]]);
    return plate('panel', 96, 96, [20, 20, 20, 20], data);
}

function slotItem() {
    const data = paintFrame(64, 64, 8, [[3, STROKE], [6, WOOD_DK], [99, CREAM_DK]]);
    for (let y = 12; y < 18; y++) {
        for (let x = 12; x < 52; x++) put(data, 64, 64, x, y, [186, 168, 140]);
    }
    return plate('slot_item', 64, 64, [16, 16, 16, 16], data);
}

function tab(name, face, stroke) {
    const data = paintPlate(56, 32, 8, 2, stroke, face, true);
    return plate(name, 56, 32, [10, 2, 10, 10], data);
}

function frameSelect() {
    const data = blank(64, 64);
    for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
            const depth = -sdRoundRect(x + 0.5, y + 0.5, 0, 0, 64, 64, 12);
            if (depth <= 0 || depth >= 6) continue;
            put(data, 64, 64, x, y, depth < 3 ? SELECT : GREEN_DK);
        }
    }
    return plate('frame_select', 64, 64, [16, 16, 16, 16], data);
}

function capsule(name, w, h, strokeW, stroke, face, hi) {
    const r = h / 2;
    const data = paintPlate(w, h, r, strokeW, stroke, face, false);
    if (hi) {
        for (let y = strokeW; y < strokeW + 4; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                if (data[i + 3] === 255 && data[i] === face[0]) put(data, w, h, x, y, hi);
            }
        }
    }
    const cap = Math.ceil(r);
    return plate(name, w, h, [strokeW + 2, strokeW + 2, cap, cap], data);
}

function sliderTrack() {
    const data = paintPlate(64, 28, 8, 2, STROKE, WOOD_DK, false);
    return plate('slider_track', 64, 28, [8, 8, 10, 10], data);
}

function sliderThumb() {
    const data = blank(44, 44);
    disc(data, 44, 44, 22, 22, 20, STROKE);
    disc(data, 44, 44, 22, 22, 16, CREAM);
    disc(data, 44, 44, 22, 16, 8, LIP);
    return plate('slider_thumb', 44, 44, [0, 0, 0, 0], data);
}

function stepperPlate() {
    const data = paintFrame(120, 72, 12, [[3, STROKE], [7, WOOD], [99, CREAM]]);
    for (let x = 14; x < 106; x++) put(data, 120, 72, x, 12, CREAM_DK);
    return plate('stepper_plate', 120, 72, [16, 16, 16, 16], data);
}

function plate(name, w, h, border, data) {
    return { name, w, h, border, data };
}

function stamp(w, h, rgb, test) {
    const data = blank(w, h);
    const cx = w / 2;
    const cy = h / 2;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (test(x + 0.5 - cx, y + 0.5 - cy)) put(data, w, h, x, y, rgb);
        }
    }
    return data;
}

function iconClose() {
    const data = stamp(48, 48, GREEN_DK, (px, py) => Math.abs(px) <= 16 && Math.abs(py) <= 16 && (Math.abs(px - py) <= 5 || Math.abs(px + py) <= 5));
    stampOnto(data, GREEN, (px, py) => Math.abs(px) <= 14 && Math.abs(py) <= 14 && (Math.abs(px - py) <= 3 || Math.abs(px + py) <= 3));
    return glyph('icon_close', data);
}

function stampOnto(data, rgb, test) {
    const cx = 24;
    const cy = 24;
    for (let y = 0; y < 48; y++) {
        for (let x = 0; x < 48; x++) {
            if (test(x + 0.5 - cx, y + 0.5 - cy)) put(data, 48, 48, x, y, rgb);
        }
    }
}

function iconPlus() {
    const arm = (px, py, t) => (Math.abs(px) <= t && Math.abs(py) <= 16) || (Math.abs(py) <= t && Math.abs(px) <= 16);
    const data = stamp(48, 48, GREEN_DK, (px, py) => arm(px, py, 6));
    stampOnto(data, CREAM, (px, py) => arm(px, py, 4));
    return glyph('icon_plus', data);
}

function iconMinus() {
    const data = stamp(48, 48, INK, (px, py) => Math.abs(py) <= 5 && Math.abs(px) <= 16);
    stampOnto(data, WOOD, (px, py) => Math.abs(py) <= 3 && Math.abs(px) <= 14);
    return glyph('icon_minus', data);
}

function iconHelp() {
    const rows = [' ##### ', '##   ##', '#     #', '     ##', '    ## ', '   ##  ', '   #   ', '       ', '   #   '];
    const data = blank(48, 48);
    rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
            if (ch !== '#') return;
            for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) put(data, 48, 48, 16 + x * 2 + dx, 12 + y * 2 + dy, INK);
        });
    });
    return glyph('icon_help', data);
}

function iconSettings() {
    const data = blank(48, 48);
    for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const tx = 24 + Math.cos(a) * 15;
        const ty = 24 + Math.sin(a) * 15;
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) put(data, 48, 48, Math.round(tx + x), Math.round(ty + y), INK);
    }
    disc(data, 48, 48, 24, 24, 12, INK);
    disc(data, 48, 48, 24, 24, 10, CREAM);
    disc(data, 48, 48, 24, 24, 4, INK);
    return glyph('icon_settings', data);
}

function iconMusic() {
    const data = stamp(48, 48, INK, (px, py) => (px + 6) ** 2 / 40 + (py - 8) ** 2 / 32 <= 1);
    for (let y = 8; y < 34; y++) for (let x = 26; x < 30; x++) put(data, 48, 48, x, y, INK);
    return glyph('icon_music', data);
}

function iconSfx() {
    const data = blank(48, 48);
    const body = [[-16, -8], [-6, -8], [2, -14], [2, 14], [-6, 8], [-16, 8]];
    for (let y = 0; y < 48; y++) {
        for (let x = 0; x < 48; x++) {
            const px = x + 0.5 - 24;
            const py = y + 0.5 - 24;
            if (insidePoly(px, py, body)) put(data, 48, 48, x, y, INK);
            for (const r of [10, 16]) {
                const d = Math.hypot(px - 4, py);
                if (px > 4 && Math.abs(d - r) <= 1.2) put(data, 48, 48, x, y, BLUE);
            }
        }
    }
    return glyph('icon_sfx', data);
}

function iconGold() {
    const data = blank(48, 48);
    disc(data, 48, 48, 24, 24, 18, GOLD_DK);
    disc(data, 48, 48, 24, 24, 15, GOLD);
    disc(data, 48, 48, 24, 24, 9, GOLD_DK);
    disc(data, 48, 48, 24, 24, 7, GOLD_HI);
    return glyph('icon_gold', data);
}

function iconDiamond() {
    const gem = [[0, -16], [14, -6], [10, 4], [0, 18], [-10, 4], [-14, -6]];
    const left = [[0, -16], [-14, -6], [-10, 4], [0, 4]];
    const right = [[0, -16], [14, -6], [10, 4], [0, 4]];
    const data = blank(48, 48);
    for (let y = 0; y < 48; y++) {
        for (let x = 0; x < 48; x++) {
            const px = x + 0.5 - 24;
            const py = y + 0.5 - 24;
            if (!insidePoly(px, py, gem)) continue;
            let rgb = BLUE;
            if (insidePoly(px, py, left)) rgb = BLUE_HI;
            else if (insidePoly(px, py, right)) rgb = BLUE_DK;
            put(data, 48, 48, x, y, rgb);
        }
    }
    return glyph('icon_diamond', data);
}

function iconEnergy() {
    const bolt = [[8, -18], [-4, -2], [3, -2], [-8, 18], [4, 2], [-3, 2]];
    const data = stamp(48, 48, GOLD_DK, (px, py) => insidePoly(px, py, bolt.map(([x, y]) => [x * 1.15, y * 1.08])));
    stampOnto(data, GOLD, (px, py) => insidePoly(px, py, bolt));
    stampOnto(data, GOLD_HI, (px, py) => insidePoly(px, py, bolt) && px > 1);
    return glyph('icon_energy', data);
}

function iconAd() {
    const tri = [[-8, -13], [-8, 13], [14, 0]];
    const data = stamp(48, 48, GOLD_DK, (px, py) => insidePoly(px * 0.85, py * 0.85, tri));
    stampOnto(data, CREAM, (px, py) => insidePoly(px, py, tri));
    return glyph('icon_ad', data);
}

function glyph(name, data) {
    return plate(name, 48, 48, [0, 0, 0, 0], data);
}

const PLATES = [
    titleBar(),
    panel(),
    slotItem(),
    tab('tab_normal', CREAM, STROKE),
    tab('tab_selected', GREEN, GREEN_DK),
    frameSelect(),
    capsule('bar_bg', 128, 64, 4, STROKE, CREAM, null),
    capsule('bar_fill', 96, 40, 3, GREEN_DK, GREEN, GREEN_HI),
    capsule('progress_fill', 80, 32, 3, GREEN_DK, GREEN, GREEN_HI),
    sliderTrack(),
    sliderThumb(),
    stepperPlate(),
    iconClose(),
    iconPlus(),
    iconMinus(),
    iconHelp(),
    iconSettings(),
    iconMusic(),
    iconSfx(),
    iconGold(),
    iconDiamond(),
    iconEnergy(),
    iconAd(),
];

function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
        c ^= buf[i];
        for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, sum]);
}

function encodePng(w, h, rgba) {
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    const raw = Buffer.alloc((w * 4 + 1) * h);
    for (let y = 0; y < h; y++) {
        const row = y * (w * 4 + 1);
        raw[row] = 0;
        Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, row + 1);
    }
    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

function patchMeta(metaPath, w, h, border) {
    const raw = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(raw);
    const frames = Object.values(meta.subMetas).filter((s) => s.importer === 'sprite-frame');
    if (frames.length !== 1) throw new Error(`${metaPath} sprite-frame 数量不是 1`);
    const ud = frames[0].userData;
    if (!ud.vertices || ud.vertices.rawPosition.length !== 12) throw new Error(`${metaPath} 顶点网格不是四边形`);
    const [top, bottom, left, right] = border;
    ud.width = ud.rawWidth = w;
    ud.height = ud.rawHeight = h;
    ud.borderTop = top;
    ud.borderBottom = bottom;
    ud.borderLeft = left;
    ud.borderRight = right;
    ud.trimX = ud.trimY = 0;
    ud.offsetX = ud.offsetY = 0;
    const hx = w / 2;
    const hy = h / 2;
    ud.vertices.rawPosition = [-hx, -hy, 0, hx, -hy, 0, -hx, hy, 0, hx, hy, 0];
    ud.vertices.uv = [0, h, w, h, 0, 0, w, 0];
    ud.vertices.minPos = [-hx, -hy, 0];
    ud.vertices.maxPos = [hx, hy, 0];
    const nl = raw.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2).replace(/\n/g, nl) + nl);
}

function assertHard(name, data) {
    if (data.length % 4 !== 0) throw new Error(`${name} 像素长度不对`);
    for (let i = 3; i < data.length; i += 4) {
        const a = data[i];
        if (a !== 0 && a !== 255) throw new Error(`${name} 出现半透明 a=${a}`);
    }
}

function main() {
    for (const item of PLATES) {
        if (item.data.length !== item.w * item.h * 4) throw new Error(`${item.name} 尺寸和像素不符`);
        assertHard(item.name, item.data);
        const png = encodePng(item.w, item.h, item.data);
        for (const dir of DIRS) {
            const base = path.join(ROOT, dir, item.name);
            if (!fs.existsSync(`${base}.png.meta`)) throw new Error(`缺少 ${base}.png.meta`);
            fs.writeFileSync(`${base}.png`, png);
            patchMeta(`${base}.png.meta`, item.w, item.h, item.border);
        }
    }
    console.log(`已写入 ${DIRS.length} 套，各 ${PLATES.length} 张`);
}

main();
