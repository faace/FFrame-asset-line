#!/usr/bin/env node
/**
 * ZooV7 控件图：按显示尺寸的 2 倍画到 2048 图集。
 * 先在显示尺寸上画硬边，再最近邻放大 2 倍，所以运行时缩回 1/2 仍是整像素。
 * 用法：node tools/draw-zoo-v7-ctrl.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const SHEET = 2048;
const GAP = 32;
const OLIVE = [54, 78, 36];
const OLIVE_DK = [36, 54, 24];
const OAK = [206, 164, 96];
const OAK_HI = [232, 198, 138];
const OAK_DK = [156, 114, 58];
const CREAM = [248, 238, 214];
const CREAM_HI = [255, 248, 232];
const CREAM_DK = [226, 208, 176];
const GREEN = [102, 176, 58];
const GREEN_HI = [154, 210, 86];
const GREEN_DK = [54, 124, 36];
const YELLOW = [246, 196, 48];
const YELLOW_HI = [255, 224, 96];
const YELLOW_DK = [206, 148, 28];
const SAND = [224, 176, 112];
const SAND_HI = [240, 206, 150];
const SAND_DK = [176, 126, 68];
const BLUE = [72, 176, 222];
const BLUE_HI = [142, 214, 242];
const BLUE_DK = [36, 124, 176];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'style', 'ZooV7', '控件');

function blank(w, h) {
    return new Uint8Array(w * h * 4);
}

function put(data, w, x, y, rgb) {
    if (x < 0 || y < 0) return;
    const i = (y * w + x) * 4;
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
}

function sdRoundRect(px, py, x0, y0, x1, y1, r) {
    const hx = (x1 - x0) / 2 - r;
    const hy = (y1 - y0) / 2 - r;
    const dx = Math.abs(px - (x0 + x1) / 2) - hx;
    const dy = Math.abs(py - (y0 + y1) / 2) - hy;
    return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) - r;
}

function dark(rgb) {
    return rgb.map((c) => Math.round(c * 0.72));
}

/** 圆角板。squareBottom 给页签：下边是直的。边内才放高光和暗边，拉开时中心是纯色。 */
function plate(w, h, radius, strokeW, stroke, face, hi, shade, squareBottom) {
    const data = blank(w, h);
    const topBand = hi ? Math.min(10, radius) : 0;
    const botBand = shade ? Math.min(12, Math.floor(h / 5)) : 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const px = x + 0.5;
            const py = y + 0.5;
            const flatBottom = squareBottom && py >= h - radius;
            const sd = flatBottom ? NaN : sdRoundRect(px, py, 0, 0, w, h, radius);
            const inside = flatBottom ? px > 0 && px < w && py > 0 && py < h : sd < 0;
            if (!inside) continue;
            const depth = flatBottom ? Math.min(px, w - px, h - py) : -sd;
            let rgb = stroke;
            if (depth >= strokeW) {
                if (hi && y < topBand) rgb = hi;
                else if (shade && y >= h - botBand) rgb = shade;
                else rgb = face;
                if (depth < strokeW + 1) rgb = dark(rgb);
            }
            put(data, w, x, y, rgb);
        }
    }
    return data;
}

function frame(w, h, radius, bands) {
    const data = blank(w, h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const sd = sdRoundRect(x + 0.5, y + 0.5, 0, 0, w, h, radius);
            if (sd >= 0) continue;
            let depth = -sd;
            let rgb = bands[bands.length - 1][1];
            for (const [band, color] of bands) {
                if (depth < band) {
                    rgb = color;
                    break;
                }
                depth -= band;
            }
            put(data, w, x, y, rgb);
        }
    }
    return data;
}

function disc(data, w, h, cx, cy, r, rgb) {
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dx = x + 0.5 - cx;
            const dy = y + 0.5 - cy;
            if (dx * dx + dy * dy <= r * r) put(data, w, x, y, rgb);
        }
    }
}

function scaleNearest(art, aw, ah) {
    const w = aw * 2;
    const h = ah * 2;
    const out = new Uint8Array(w * h * 4);
    for (let y = 0; y < ah; y++) {
        for (let x = 0; x < aw; x++) {
            const s = (y * aw + x) * 4;
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const d = ((y * 2 + dy) * w + x * 2 + dx) * 4;
                    out[d] = art[s];
                    out[d + 1] = art[s + 1];
                    out[d + 2] = art[s + 2];
                    out[d + 3] = art[s + 3];
                }
            }
        }
    }
    return out;
}

function button(face, hi, shade) {
    return plate(380, 120, 16, 3, OLIVE, face, hi, shade, false);
}

function buttonSecondary() {
    const data = plate(380, 120, 16, 3, OLIVE, CREAM, CREAM_HI, CREAM_DK, false);
    for (let y = 0; y < 120; y++) {
        for (let x = 0; x < 380; x++) {
            const sd = sdRoundRect(x + 0.5, y + 0.5, 0, 0, 380, 120, 16);
            if (sd >= 0) continue;
            const depth = -sd;
            if (depth >= 3 && depth < 8) put(data, 380, x, y, depth < 4 ? OAK_DK : OAK);
        }
    }
    return data;
}

function titleBar() {
    const w = 320;
    const h = 85;
    const data = plate(w, h, 16, 3, OLIVE, OAK, OAK_HI, OAK_DK, false);
    disc(data, w, h, 24, 42, 6, OLIVE_DK);
    disc(data, w, h, 24, 41, 3, OAK_HI);
    disc(data, w, h, w - 24, 42, 6, OLIVE_DK);
    disc(data, w, h, w - 24, 41, 3, OAK_HI);
    return data;
}

function panelPlate() {
    return frame(176, 168, 16, [[3, OLIVE], [9, OAK], [2, CREAM_DK], [99, CREAM]]);
}

function slotPlate() {
    return frame(88, 88, 12, [[3, OLIVE], [7, OAK], [2, CREAM_DK], [99, CREAM]]);
}

function tabPlate(face, shade) {
    return plate(154, 72, 10, 2, OLIVE, face, null, shade, true);
}

function selectFrame() {
    const w = 88;
    const h = 88;
    const data = blank(w, h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const depth = -sdRoundRect(x + 0.5, y + 0.5, 0, 0, w, h, 12);
            if (depth <= 0 || depth >= 6) continue;
            put(data, w, x, y, depth < 3 ? GREEN_HI : GREEN_DK);
        }
    }
    return data;
}

function capsule(w, h, stroke, face, hi, topInset) {
    const data = plate(w, h, h / 2, stroke, OLIVE, face, hi, null, false);
    if (!hi) return data;
    for (let y = topInset; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            if (data[i + 3] !== 255) continue;
            if (data[i] === hi[0] && data[i + 1] === hi[1] && data[i + 2] === hi[2]) {
                data[i] = face[0];
                data[i + 1] = face[1];
                data[i + 2] = face[2];
            }
        }
    }
    return data;
}

function sliderTrack() {
    return plate(112, 28, 8, 2, OLIVE, OAK_DK, null, null, false);
}

function sliderThumb() {
    const data = blank(44, 44);
    disc(data, 44, 44, 22, 22, 20, OLIVE);
    disc(data, 44, 44, 22, 22, 16, CREAM);
    disc(data, 44, 44, 22, 16, 7, CREAM_HI);
    return data;
}

function stepperPlate() {
    return frame(140, 72, 12, [[3, OLIVE], [7, OAK], [2, CREAM_DK], [99, CREAM]]);
}

function blitRows(data, w, rows, scale, rgb, ox, oy) {
    rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
            if (ch !== '#') return;
            for (let dy = 0; dy < scale; dy++) {
                for (let dx = 0; dx < scale; dx++) put(data, w, ox + x * scale + dx, oy + y * scale + dy, rgb);
            }
        });
    });
}

function iconFrom(rows, rgb) {
    const data = blank(88, 88);
    const scale = 8;
    const gw = rows[0].length * scale;
    const gh = rows.length * scale;
    blitRows(data, 88, rows, scale, rgb, Math.floor((88 - gw) / 2), Math.floor((88 - gh) / 2));
    return data;
}

function iconClose() {
    return iconFrom([
        '##    ##',
        ' ##  ## ',
        '  ####  ',
        '   ##   ',
        '  ####  ',
        ' ##  ## ',
        '##    ##',
    ], GREEN_DK);
}

function iconHelp() {
    return iconFrom([
        '  ####  ',
        ' ##  ## ',
        ' #   ## ',
        '    ##  ',
        '   ##   ',
        '   ##   ',
        '        ',
        '   ##   ',
    ], OLIVE_DK);
}

function iconPlus() {
    return iconFrom([
        '   ##   ',
        '   ##   ',
        '   ##   ',
        '########',
        '########',
        '   ##   ',
        '   ##   ',
        '   ##   ',
    ], GREEN);
}

function iconMinus() {
    return iconFrom([
        '        ',
        '        ',
        '        ',
        '########',
        '########',
        '        ',
        '        ',
        '        ',
    ], OLIVE_DK);
}

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

function piece(name, art, aw, ah, border, sliced, x, y, reserved) {
    if (art.length !== aw * ah * 4) throw new Error(`${name} 像素长度不对`);
    return {
        name,
        art,
        aw,
        ah,
        border: border.map((n) => n * 2),
        sliced,
        x,
        y,
        w: aw * 2,
        h: ah * 2,
        reserved: !!reserved,
    };
}

function gapOf(a, b) {
    const dx = Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w);
    const dy = Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h);
    if (dx < 0 && dy < 0) return -1;
    if (dx < 0) return dy;
    if (dy < 0) return dx;
    return Math.hypot(dx, dy);
}

function buildPieces() {
    const b = [16, 16, 16, 16];
    const list = [
        piece('btn_primary', button(GREEN, GREEN_HI, GREEN_DK), 380, 120, b, true, 32, 32),
        piece('btn_secondary', buttonSecondary(), 380, 120, b, true, 32, 304),
        piece('btn_warning', button(YELLOW, YELLOW_HI, YELLOW_DK), 380, 120, b, true, 32, 576),
        piece('btn_neutral', button(SAND, SAND_HI, SAND_DK), 380, 120, b, true, 32, 848),
        piece('btn_info', button(BLUE, BLUE_HI, BLUE_DK), 380, 120, b, true, 32, 1120),
        piece('title_bar', titleBar(), 320, 85, [48, 48, 20, 20], true, 824, 32),
        piece('panel', panelPlate(), 176, 168, [20, 20, 20, 20], true, 824, 234),
        piece('slot_item', slotPlate(), 88, 88, b, true, 1208, 234),
        piece('frame_select', selectFrame(), 88, 88, [0, 0, 0, 0], false, 1416, 234),
        piece('tab_normal', tabPlate(CREAM, CREAM_DK), 154, 72, [10, 10, 10, 2], true, 824, 602),
        piece('tab_selected', tabPlate(GREEN, GREEN_DK), 154, 72, [10, 10, 10, 2], true, 1164, 602),
        piece('stepper_plate', stepperPlate(), 140, 72, b, true, 824, 778),
        piece('bar_bg', capsule(160, 64, 3, CREAM, CREAM_HI, 8), 160, 64, [32, 32, 8, 8], true, 1136, 778),
        piece('bar_fill', capsule(100, 40, 2, GREEN, GREEN_HI, 4), 100, 40, [20, 20, 4, 4], true, 824, 954),
        piece('progress_fill', capsule(120, 40, 2, GREEN, GREEN_HI, 4), 120, 40, [20, 20, 4, 4], true, 1056, 954),
        piece('slider_track', sliderTrack(), 112, 28, [14, 14, 8, 8], true, 824, 1082),
        piece('slider_thumb', sliderThumb(), 44, 44, [0, 0, 0, 0], false, 1080, 1066),
        piece('icon_close', iconClose(), 88, 88, [0, 0, 0, 0], false, 824, 1186),
        piece('icon_help', iconHelp(), 88, 88, [0, 0, 0, 0], false, 1032, 1186),
        piece('icon_plus', iconPlus(), 88, 88, [0, 0, 0, 0], false, 1240, 1186),
        piece('icon_minus', iconMinus(), 88, 88, [0, 0, 0, 0], false, 1448, 1186),
        piece('switch', blank(160, 72), 160, 72, [16, 16, 12, 12], true, 32, 1394, true),
        piece('checkbox', blank(72, 72), 72, 72, [0, 0, 0, 0], false, 384, 1394, true),
        piece('radio', blank(72, 72), 72, 72, [0, 0, 0, 0], false, 560, 1394, true),
        piece('input', blank(400, 72), 400, 72, [16, 16, 12, 12], true, 736, 1394, true),
        piece('badge', blank(64, 64), 64, 64, [0, 0, 0, 0], false, 1568, 1394, true),
        piece('dropdown', blank(320, 72), 320, 72, [16, 16, 12, 12], true, 32, 1570, true),
        piece('toast', blank(480, 128), 480, 128, [20, 20, 20, 20], true, 704, 1570, true),
        piece('count_plate', blank(96, 64), 96, 64, [12, 12, 12, 12], true, 32, 1746, true),
        piece('scrollbar', blank(32, 160), 32, 160, [8, 8, 12, 12], true, 1656, 32, true),
        piece('scrollbar_thumb', blank(32, 64), 32, 64, [0, 0, 0, 0], false, 1656, 384, true),
    ];
    for (const item of list) {
        if (item.x < GAP || item.y < GAP || item.x + item.w > SHEET - GAP || item.y + item.h > SHEET - GAP) {
            throw new Error(`${item.name} 超出画布边距`);
        }
    }
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const g = gapOf(list[i], list[j]);
            if (g <= 24) throw new Error(`${list[i].name} 和 ${list[j].name} 间距 ${g}`);
        }
    }
    return list;
}

function compose(list) {
    const sheet = blank(SHEET, SHEET);
    for (const item of list) {
        if (item.reserved) continue;
        const src = scaleNearest(item.art, item.aw, item.ah);
        for (let y = 0; y < item.h; y++) {
            for (let x = 0; x < item.w; x++) {
                const s = (y * item.w + x) * 4;
                if (src[s + 3] === 0) continue;
                const dx = item.x + x;
                const dy = item.y + y;
                const d = (dy * SHEET + dx) * 4;
                if (sheet[d + 3] !== 0) throw new Error(`${item.name} 盖住了已有像素 ${dx},${dy}`);
                sheet[d] = src[s];
                sheet[d + 1] = src[s + 1];
                sheet[d + 2] = src[s + 2];
                sheet[d + 3] = 255;
            }
        }
    }
    return sheet;
}

function assertSheet(sheet, list) {
    const owners = list.filter((item) => !item.reserved);
    for (let i = 3; i < sheet.length; i += 4) {
        const a = sheet[i];
        if (a !== 0 && a !== 255) throw new Error(`半透明 a=${a}`);
        if (a === 0) continue;
        const p = (i - 3) / 4;
        const x = p % SHEET;
        const y = (p - x) / SHEET;
        const hit = owners.filter((item) => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h);
        if (hit.length !== 1) throw new Error(`像素 ${x},${y} 落在 ${hit.length} 个槽里`);
    }
}

function toJson(list) {
    const slots = {};
    for (const item of list) {
        const slot = {
            rect: [item.x, item.y, item.w, item.h],
            border: item.border,
            sliced: item.sliced,
            display: [item.aw, item.ah],
        };
        if (item.reserved) slot.reserved = true;
        slots[item.name] = slot;
    }
    return {
        sheet: 'ctrl.png',
        size: [SHEET, SHEET],
        theme: 'ZooV7',
        slots,
    };
}

function writeDocs(json) {
    const hist = path.join(outDir, 'history', 'v8');
    fs.mkdirSync(hist, { recursive: true });
    const params = {
        method: 'script',
        script: 'tools/draw-zoo-v7-ctrl.mjs',
        scale: 2,
        sheet: [SHEET, SHEET],
        gap: GAP,
        note: '显示尺寸上画硬边，最近邻放大 2 倍。不是把 v7 的 1024 图放大。',
    };
    fs.writeFileSync(path.join(hist, 'params.json'), JSON.stringify(params, null, 4) + '\n');
    fs.copyFileSync(path.join(outDir, 'ctrl.png'), path.join(hist, 'ctrl.png'));
    fs.writeFileSync(path.join(hist, 'ctrl.json'), JSON.stringify(json, null, 4) + '\n');
    fs.writeFileSync(path.join(hist, '结论.md'), [
        '# v8',
        '',
        '采用。按已确认的 2 倍尺寸用脚本重画，硬边、空白 alpha 为 0。',
        '风格句用 `style/ZooV7/style.md`。母版只作对照：`style/ZooV7/控件/history/v7/ui-sheet-v7.png`。',
        '没有调用绘图接口，也没有把 v7 的 1024 图放大。',
        '',
    ].join('\n'));
}

function main() {
    const list = buildPieces();
    const drawn = list.filter((item) => !item.reserved);
    if (drawn.length !== 21) throw new Error(`实画 ${drawn.length} 件，名单是 21 个`);
    if (list.length - drawn.length !== 10) throw new Error('预留不是 10 个');
    const sheet = compose(list);
    assertSheet(sheet, list);
    fs.mkdirSync(outDir, { recursive: true });
    const json = toJson(list);
    fs.writeFileSync(path.join(outDir, 'ctrl.png'), encodePng(SHEET, SHEET, sheet));
    fs.writeFileSync(path.join(outDir, 'ctrl.json'), JSON.stringify(json, null, 4) + '\n');
    writeDocs(json);
    console.log(`ctrl.png ${SHEET} 实画 ${drawn.length} 预留 ${list.length - drawn.length}`);
}

main();
