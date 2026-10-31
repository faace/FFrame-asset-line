#!/usr/bin/env node
/**
 * 重画五张按钮底板：48×48，外圆角 12，九宫格边 16。
 * 颜色取重画前各层平色的中位数，写死，重复运行不会漂。
 * 用法：node tools/temp/draw-btn-plates.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SIZE = 48;
const RADIUS = 12;
const BORDER = 16;
const DIRS = [
    'assets/game/bundles/Skin',
    'assets/gmajor/ui/skin',
];

// 实心：顶 4 描边 + 12 亮边，底 12 暗边 + 4 描边，左右 4 描边
// secondary：3 深描边 + 4 金框 + 2 奶油内沿，其余到第 16 像素是脸
const THEMES = [
    { name: 'btn_primary', kind: 'solid', stroke: [24, 77, 17], hi: [111, 191, 49], face: [93, 171, 42], shade: [75, 149, 37] },
    { name: 'btn_warning', kind: 'solid', stroke: [103, 42, 1], hi: [251, 209, 44], face: [251, 188, 34], shade: [249, 164, 28] },
    { name: 'btn_neutral', kind: 'solid', stroke: [84, 52, 2], hi: [241, 194, 129], face: [225, 177, 111], shade: [214, 156, 92] },
    { name: 'btn_info', kind: 'solid', stroke: [3, 59, 103], hi: [98, 189, 237], face: [72, 167, 226], shade: [40, 141, 210] },
    { name: 'btn_secondary', kind: 'frame', stroke: [103, 63, 7], gold: [222, 163, 96], lip: [244, 235, 215], face: [241, 230, 204] },
];

function sdRoundRect(px, py, x0, y0, x1, y1, r) {
    const hx = (x1 - x0) / 2 - r;
    const hy = (y1 - y0) / 2 - r;
    const dx = Math.abs(px - (x0 + x1) / 2) - hx;
    const dy = Math.abs(py - (y0 + y1) / 2) - hy;
    const ax = Math.max(dx, 0);
    const ay = Math.max(dy, 0);
    return Math.min(Math.max(dx, dy), 0) + Math.hypot(ax, ay) - r;
}

function paint(theme, x, y) {
    const px = x + 0.5;
    const py = y + 0.5;
    const sd = sdRoundRect(px, py, 0, 0, SIZE, SIZE, RADIUS);
    if (sd >= 0) return [0, 0, 0, 0]; // 像素中心在外即透明，圆角走台阶
    let rgb = theme.stroke;
    if (theme.kind === 'solid') {
        const inner = sdRoundRect(px, py, 4, 4, SIZE - 4, SIZE - 4, RADIUS - 4);
        if (inner < 0) {
            if (y < BORDER) rgb = theme.hi;
            else if (y >= SIZE - BORDER) rgb = theme.shade;
            else rgb = theme.face;
        }
    } else {
        const depth = -sd; // 沿外轮廓法线向内
        if (depth < 3) rgb = theme.stroke;
        else if (depth < 7) rgb = theme.gold;
        else if (depth < 9) rgb = theme.lip;
        else rgb = theme.face;
    }
    return [rgb[0], rgb[1], rgb[2], 255];
}

function draw(theme) {
    const data = new Uint8Array(SIZE * SIZE * 4);
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const [r, g, b, a] = paint(theme, x, y);
            const i = (y * SIZE + x) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }
    }
    return data;
}

function at(data, x, y) {
    const i = (y * SIZE + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

function same(px, rgb, alpha = 255) {
    return px[0] === rgb[0] && px[1] === rgb[1] && px[2] === rgb[2] && px[3] === alpha;
}

function assertPlate(theme, data) {
    const fail = (msg) => {
        throw new Error(`${theme.name} ${msg}`);
    };
    if (!same(at(data, 0, 0), [0, 0, 0], 0)) fail('角点应透明');
    for (let i = 3; i < data.length; i += 4) {
        const a = data[i];
        if (a !== 0 && a !== 255) fail(`出现半透明 a=${a}`);
    }
    let stepped = false;
    for (let y = 1; y < 12; y++) {
        for (let x = 1; x < 12; x++) {
            if (at(data, x, y)[3] === 255 && at(data, x - 1, y)[3] === 0) stepped = true;
        }
    }
    if (!stepped) fail('圆角没有像素台阶');
    if (theme.kind === 'solid') {
        for (let y = 16; y < 32; y++) {
            for (let x = 16; x < 32; x++) if (!same(at(data, x, y), theme.face)) fail(`中心 ${x},${y} 不是脸`);
        }
        if (!same(at(data, 24, 2), theme.stroke)) fail('顶描边');
        if (!same(at(data, 24, 8), theme.hi)) fail('顶亮边');
        if (!same(at(data, 24, 15), theme.hi)) fail('亮边未铺满 16');
        if (!same(at(data, 24, 16), theme.face)) fail('中心顶行');
        if (!same(at(data, 24, 31), theme.face)) fail('中心底行');
        if (!same(at(data, 24, 32), theme.shade)) fail('底暗边');
        if (!same(at(data, 24, 46), theme.stroke)) fail('底描边');
        if (!same(at(data, 2, 24), theme.stroke)) fail('左描边');
        if (!same(at(data, 4, 24), theme.face)) fail('左侧应立刻接到脸');
    } else {
        if (!same(at(data, 24, 1), theme.stroke)) fail('木框描边');
        if (!same(at(data, 24, 4), theme.gold)) fail('金框');
        if (!same(at(data, 24, 7), theme.lip)) fail('奶油内沿');
        if (!same(at(data, 24, 9), theme.face)) fail('框外应是脸');
        for (let y = 16; y < 32; y++) {
            for (let x = 16; x < 32; x++) if (!same(at(data, x, y), theme.face)) fail(`中心 ${x},${y} 不是脸`);
        }
        if (!same(at(data, 1, 24), theme.stroke)) fail('左右也应是木框');
        if (!same(at(data, 4, 24), theme.gold)) fail('左右金框');
    }
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
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    return Buffer.concat([
        sig,
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

function patchMeta(metaPath) {
    const raw = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(raw);
    const frames = Object.values(meta.subMetas).filter((s) => s.importer === 'sprite-frame');
    if (frames.length !== 1) throw new Error(`${metaPath} sprite-frame 数量不是 1`);
    const ud = frames[0].userData;
    if (!ud.vertices || ud.vertices.rawPosition.length !== 12) throw new Error(`${metaPath} 顶点网格不是四边形`);
    ud.width = ud.height = ud.rawWidth = ud.rawHeight = SIZE;
    ud.borderTop = ud.borderBottom = ud.borderLeft = ud.borderRight = BORDER;
    ud.trimX = ud.trimY = 0;
    ud.offsetX = ud.offsetY = 0;
    const h = SIZE / 2;
    ud.vertices.rawPosition = [-h, -h, 0, h, -h, 0, -h, h, 0, h, h, 0];
    ud.vertices.uv = [0, SIZE, SIZE, SIZE, 0, 0, SIZE, 0];
    ud.vertices.minPos = [-h, -h, 0];
    ud.vertices.maxPos = [h, h, 0];
    const nl = raw.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2).replace(/\n/g, nl) + nl);
}

function sliced(src, dw, dh, dx, dy) {
    const map = (p, dest, srcSize) => {
        if (p < BORDER) return p;
        if (p >= dest - BORDER) return srcSize - (dest - p);
        const span = dest - BORDER * 2;
        const srcSpan = srcSize - BORDER * 2;
        const u = p - BORDER;
        return BORDER + Math.min(srcSpan - 1, Math.floor(((u + 0.5) * srcSpan) / span));
    };
    const x = Math.max(0, Math.min(SIZE - 1, map(dx, dw, SIZE)));
    const y = Math.max(0, Math.min(SIZE - 1, map(dy, dh, SIZE)));
    return at(src, x, y);
}

function blit(dst, dw, src, sw, sh, ox, oy, scale) {
    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const i = (y * sw + x) * 4;
            for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                    const di = ((oy + y * scale + sy) * dw + ox + x * scale + sx) * 4;
                    dst[di] = src[i];
                    dst[di + 1] = src[i + 1];
                    dst[di + 2] = src[i + 2];
                    dst[di + 3] = 255;
                    if (src[i + 3] < 255) {
                        const a = src[i + 3] / 255;
                        dst[di] = Math.round(255 * (1 - a) + src[i] * a);
                        dst[di + 1] = Math.round(0 * (1 - a) + src[i + 1] * a);
                        dst[di + 2] = Math.round(255 * (1 - a) + src[i + 2] * a);
                    }
                }
            }
        }
    }
}

function plateRgba(data, w, h) {
    const rgba = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const p = sliced(data, w, h, x, y);
            const i = (y * w + x) * 4;
            rgba[i] = p[0];
            rgba[i + 1] = p[1];
            rgba[i + 2] = p[2];
            rgba[i + 3] = p[3];
        }
    }
    return rgba;
}

function writePreview(plates) {
    const scale = 2;
    const cells = [
        [SIZE, SIZE],
        [88, 88],
        [260, 88],
        [380, 120],
    ];
    const gap = 8;
    const rowH = 120 * scale;
    const width = gap + cells.reduce((sum, [w]) => sum + w * scale + gap, 0);
    const height = gap + THEMES.length * (rowH + gap);
    const dst = new Uint8Array(width * height * 4);
    dst.fill(255);
    for (let i = 0; i < dst.length; i += 4) dst[i + 3] = 255;
    THEMES.forEach((theme, row) => {
        let x = gap;
        const y = gap + row * (rowH + gap);
        for (const [w, h] of cells) {
            const rgba = w === SIZE && h === SIZE ? plates[row] : plateRgba(plates[row], w, h);
            blit(dst, width, rgba, w, h, x, y, scale);
            x += w * scale + gap;
        }
    });
    const out = path.join(ROOT, 'tools/temp/ui-style/btn-plates-preview.png');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, encodePng(width, height, dst));
    return out;
}

function main() {
    const plates = THEMES.map((theme) => {
        const data = draw(theme);
        assertPlate(theme, data);
        const mid = sliced(data, 88, 88, 44, 44);
        if (!same(mid, theme.face)) throw new Error(`${theme.name} 方钮中心被拉开了`);
        const cap = sliced(data, 380, 120, 190, 4);
        const expect = theme.kind === 'solid' ? theme.hi : theme.gold;
        if (!same(cap, expect)) throw new Error(`${theme.name} 宽钮顶边厚度变了`);
        return data;
    });
    const pngs = plates.map((data) => encodePng(SIZE, SIZE, data));
    for (const dir of DIRS) {
        for (let i = 0; i < THEMES.length; i++) {
            const base = path.join(ROOT, dir, THEMES[i].name);
            fs.writeFileSync(`${base}.png`, pngs[i]);
            patchMeta(`${base}.png.meta`);
        }
    }
    const preview = writePreview(plates);
    console.log(`已写入 ${DIRS.length} 套，各 ${THEMES.length} 张 ${SIZE}×${SIZE}，九宫格边 ${BORDER}`);
    console.log(preview);
}

main();
