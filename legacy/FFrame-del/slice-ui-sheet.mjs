import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sheetPath = join(root, 'tools', 'temp', 'ui-style', 'ui-sheet-v7.png');
const skinDir = join(root, 'assets', 'gmajor', 'ui', 'skin'); // 框架默认皮
const write = process.argv.includes('--write');
const ICON_SIZE = 110; // 图标画布。图形不缩放，居中，四周透明

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c >>> 0;
}

function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const body = Buffer.concat([Buffer.from(type), data]);
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    body.copy(out, 4);
    out.writeUInt32BE(crc32(body), 8 + data.length);
    return out;
}

function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
}

function unfilter(filter, row, prev, channels) {
    const stride = row.length;
    for (let i = 0; i < stride; i++) {
        const left = i >= channels ? row[i - channels] : 0;
        const up = prev[i];
        const ul = i >= channels ? prev[i - channels] : 0;
        if (filter === 1) row[i] = (row[i] + left) & 255;
        else if (filter === 2) row[i] = (row[i] + up) & 255;
        else if (filter === 3) row[i] = (row[i] + ((left + up) >> 1)) & 255;
        else if (filter === 4) row[i] = (row[i] + paeth(left, up, ul)) & 255;
        else if (filter !== 0) throw new Error(`filter ${filter}`);
    }
}

function decodePng(buf) {
    let pos = 8;
    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    const idat = [];
    while (pos < buf.length) {
        const len = buf.readUInt32BE(pos);
        pos += 4;
        const type = buf.toString('ascii', pos, pos + 4);
        pos += 4;
        const data = buf.subarray(pos, pos + len);
        pos += len + 4;
        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            bitDepth = data[8];
            colorType = data[9];
        } else if (type === 'IDAT') {
            idat.push(data);
        } else if (type === 'IEND') break;
    }
    if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) throw new Error(`png ${bitDepth}/${colorType}`);
    const channels = colorType === 6 ? 4 : 3;
    const raw = inflateSync(Buffer.concat(idat));
    const stride = width * channels;
    const out = Buffer.alloc(width * height * 4);
    let src = 0;
    let prev = Buffer.alloc(stride);
    for (let y = 0; y < height; y++) {
        const filter = raw[src++];
        const row = Buffer.from(raw.subarray(src, src + stride));
        src += stride;
        unfilter(filter, row, prev, channels);
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const s = x * channels;
            out[i] = row[s];
            out[i + 1] = row[s + 1];
            out[i + 2] = row[s + 2];
            out[i + 3] = channels === 4 ? row[s + 3] : 255;
        }
        prev = row;
    }
    return { width, height, data: out };
}

function encodePng(width, height, rgba) {
    const stride = width * 4;
    const raw = Buffer.alloc((stride + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[y * (stride + 1)] = 0;
        rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    return Buffer.concat([
        sig,
        chunk('IHDR', ihdr),
        chunk('IDAT', deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

function components(img) {
    const { width: w, height: h, data } = img;
    const n = w * h;
    const parent = new Int32Array(n);
    for (let i = 0; i < n; i++) parent[i] = i;
    const find = (a) => {
        let p = a;
        while (parent[p] !== p) p = parent[p];
        while (parent[a] !== a) {
            const next = parent[a];
            parent[a] = p;
            a = next;
        }
        return p;
    };
    const union = (a, b) => {
        const pa = find(a);
        const pb = find(b);
        if (pa !== pb) parent[pb] = pa;
    };
    const on = (x, y) => data[(y * w + x) * 4 + 3] > 20;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!on(x, y)) continue;
            const i = y * w + x;
            if (x > 0 && on(x - 1, y)) union(i, i - 1);
            if (y > 0 && on(x, y - 1)) union(i, i - w);
        }
    }
    const boxes = new Map();
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!on(x, y)) continue;
            const id = find(y * w + x);
            let box = boxes.get(id);
            if (!box) {
                box = { x0: x, y0: y, x1: x, y1: y };
                boxes.set(id, box);
            } else {
                if (x < box.x0) box.x0 = x;
                if (y < box.y0) box.y0 = y;
                if (x > box.x1) box.x1 = x;
                if (y > box.y1) box.y1 = y;
            }
        }
    }
    return [...boxes.values()].map((box) => ({
        x: box.x0,
        y: box.y0,
        w: box.x1 - box.x0 + 1,
        h: box.y1 - box.y0 + 1,
    }));
}

function gap(a, b) {
    const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w));
    const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
    return Math.max(dx, dy);
}

function mergeSmall(boxes) {
    let list = boxes.filter((b) => b.w * b.h > 40);
    let changed = true;
    while (changed) {
        changed = false;
        const next = [];
        const used = new Array(list.length).fill(false);
        for (let i = 0; i < list.length; i++) {
            if (used[i]) continue;
            let cur = list[i];
            for (let j = i + 1; j < list.length; j++) {
                if (used[j]) continue;
                const other = list[j];
                const small = cur.w < 180 && cur.h < 180 && other.w < 180 && other.h < 180;
                if (small && gap(cur, other) <= 14) {
                    const x0 = Math.min(cur.x, other.x);
                    const y0 = Math.min(cur.y, other.y);
                    const x1 = Math.max(cur.x + cur.w, other.x + other.w);
                    const y1 = Math.max(cur.y + cur.h, other.y + other.h);
                    cur = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
                    used[j] = true;
                    changed = true;
                }
            }
            next.push(cur);
        }
        list = next;
    }
    return list.sort((a, b) => a.y - b.y || a.x - b.x);
}

function crop(img, box) {
    const rgba = Buffer.alloc(box.w * box.h * 4);
    for (let y = 0; y < box.h; y++) {
        const src = ((box.y + y) * img.width + box.x) * 4;
        img.data.copy(rgba, y * box.w * 4, src, src + box.w * 4);
    }
    return rgba;
}

function opaqueCountCol(rgba, w, h, x) {
    let n = 0;
    for (let y = 0; y < h; y++) if (rgba[(y * w + x) * 4 + 3] > 40) n++;
    return n;
}

function opaqueCountRow(rgba, w, h, y) {
    let n = 0;
    for (let x = 0; x < w; x++) if (rgba[(y * w + x) * 4 + 3] > 40) n++;
    return n;
}

function capSize(counts, full) {
    const limit = Math.max(2, full - 2);
    let i = 0;
    while (i < counts.length && counts[i] < limit) i++;
    return Math.max(4, Math.min(i, Math.floor(counts.length / 2) - 2));
}

function pix(rgba, w, x, y) {
    const i = (y * w + x) * 4;
    return { r: rgba[i], g: rgba[i + 1], b: rgba[i + 2], a: rgba[i + 3] };
}

function near(a, b) {
    return a.a > 40 && b.a > 40
        && Math.abs(a.r - b.r) < 28
        && Math.abs(a.g - b.g) < 28
        && Math.abs(a.b - b.b) < 28;
}

function flatInset(samples, center) {
    const run = 6;
    for (let i = 0; i < samples.length / 2; i++) {
        let ok = true;
        for (let k = 0; k < run; k++) {
            if (!near(samples[i + k], center)) ok = false;
        }
        if (ok) return Math.max(8, i);
    }
    return null;
}

function borders(rgba, w, h, sliced) {
    if (!sliced) return { left: 0, right: 0, top: 0, bottom: 0 };
    const cols = [];
    const rows = [];
    for (let x = 0; x < w; x++) cols.push(opaqueCountCol(rgba, w, h, x));
    for (let y = 0; y < h; y++) rows.push(opaqueCountRow(rgba, w, h, y));
    const fullW = Math.max(...cols);
    const fullH = Math.max(...rows);
    const cap = {
        left: capSize(cols, fullW),
        right: capSize([...cols].reverse(), fullW),
        top: capSize(rows, fullH),
        bottom: capSize([...rows].reverse(), fullH),
    };
    const cy = Math.floor(h / 2);
    const cx = Math.floor(w / 2);
    const center = pix(rgba, w, cx, cy);
    const horizontal = [];
    const vertical = [];
    for (let x = 0; x < w; x++) horizontal.push(pix(rgba, w, x, cy));
    for (let y = 0; y < h; y++) vertical.push(pix(rgba, w, cx, y));
    const left = flatInset(horizontal, center);
    const right = flatInset([...horizontal].reverse(), center);
    const top = flatInset(vertical, center);
    const bottom = flatInset([...vertical].reverse(), center);
    if (left == null || right == null || top == null || bottom == null) return cap;
    const color = { left, right, top, bottom };
    const thicker = left + right > cap.left + cap.right + 8;
    return thicker ? color : cap;
}

function vertices(w, h) {
    const hw = w / 2;
    const hh = h / 2;
    return {
        rawPosition: [-hw, -hh, 0, hw, -hh, 0, -hw, hh, 0, hw, hh, 0],
        indexes: [0, 1, 2, 2, 1, 3],
        uv: [0, h, w, h, 0, 0, w, 0],
        nuv: [0, 0, 1, 0, 0, 1, 1, 1],
        minPos: [-hw, -hh, 0],
        maxPos: [hw, hh, 0],
    };
}

function padCenter(rgba, w, h, size) {
    if (w > size || h > size) throw new Error(`icon ${w}x${h} exceeds ${size}`);
    const out = Buffer.alloc(size * size * 4);
    const x0 = Math.floor((size - w) / 2);
    const y0 = Math.floor((size - h) / 2);
    for (let y = 0; y < h; y++) {
        rgba.copy(out, ((y0 + y) * size + x0) * 4, y * w * 4, (y + 1) * w * 4);
    }
    return out;
}

function writeMeta(name, w, h, border, trimType = 'auto') {
    const metaPath = `${skinDir}/${name}.png.meta`;
    let uuid = randomUUID();
    if (existsSync(metaPath)) {
        uuid = JSON.parse(readFileSync(metaPath, 'utf8')).uuid;
    }
    const meta = {
        ver: '1.0.27',
        importer: 'image',
        imported: true,
        uuid,
        files: ['.json', '.png'],
        subMetas: {
            '6c48a': {
                ver: '1.0.22',
                importer: 'texture',
                uuid: `${uuid}@6c48a`,
                imported: true,
                files: ['.json'],
                subMetas: {},
                userData: {
                    wrapModeS: 'clamp-to-edge',
                    wrapModeT: 'clamp-to-edge',
                    minfilter: 'linear',
                    magfilter: 'linear',
                    mipfilter: 'none',
                    premultiplyAlpha: false,
                    anisotropy: 0,
                    isUuid: true,
                    imageUuidOrDatabaseUri: uuid,
                    visible: false,
                },
                displayName: name,
                id: '6c48a',
                name: 'texture',
            },
            f9941: {
                ver: '1.0.12',
                importer: 'sprite-frame',
                uuid: `${uuid}@f9941`,
                imported: true,
                files: ['.json'],
                subMetas: {},
                userData: {
                    trimType,
                    trimThreshold: 1,
                    rotated: false,
                    offsetX: 0,
                    offsetY: 0,
                    trimX: 0,
                    trimY: 0,
                    width: w,
                    height: h,
                    rawWidth: w,
                    rawHeight: h,
                    borderTop: border.top,
                    borderBottom: border.bottom,
                    borderLeft: border.left,
                    borderRight: border.right,
                    packable: true,
                    pixelsToUnit: 100,
                    pivotX: 0.5,
                    pivotY: 0.5,
                    meshType: 0,
                    isUuid: true,
                    imageUuidOrDatabaseUri: `${uuid}@6c48a`,
                    vertices: vertices(w, h),
                    atlasUuid: '',
                },
                displayName: name,
                id: 'f9941',
                name: 'spriteFrame',
            },
        },
        userData: {
            type: 'sprite-frame',
            hasAlpha: true,
            fixAlphaTransparencyArtifacts: false,
            redirect: `${uuid}@6c48a`,
        },
    };
    writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
}

const SLICED = new Set([
    'TitleBar', 'Panel', 'BtnPrimary', 'BtnSecondary', 'BtnAd', 'BtnGold', 'BtnDiamond',
    'TabNormal', 'TabSelected', 'PlateStepper', 'SliderTrack', 'ProgressFill',
    'XpTrack', 'XpFill',
]);

function nameBoxes(boxes) {
    const icons = boxes.filter((b) => b.y > 930).sort((a, b) => a.x - b.x);
    const rest = boxes.filter((b) => b.y <= 930);
    const iconNames = [
        'IconGold', 'IconDiamond', 'IconEnergy', 'IconMusic', 'IconSfx', 'IconSettings',
        'IconAd', 'IconPlus', 'IconMinus', 'IconClose', 'IconHelp',
    ];
    if (icons.length !== iconNames.length) {
        throw new Error(`icons ${icons.length}: ${icons.map((b) => `${b.x},${b.y} ${b.w}x${b.h}`).join(' | ')}`);
    }
    const named = icons.map((box, i) => ({ ...box, name: iconNames[i] }));
    const left = rest.filter((b) => b.x < 460).sort((a, b) => a.y - b.y);
    const leftNames = ['BtnPrimary', 'BtnSecondary', 'BtnAd', 'BtnGold', 'BtnDiamond'];
    if (left.length !== leftNames.length) {
        throw new Error(`left ${left.length}: ${left.map((b) => `${b.x},${b.y} ${b.w}x${b.h}`).join(' | ')}`);
    }
    left.forEach((box, i) => named.push({ ...box, name: leftNames[i] }));
    const right = rest.filter((b) => b.x >= 460);
    const take = (pred, name) => {
        const hits = right.filter((b) => !b.name && pred(b));
        if (hits.length !== 1) throw new Error(`${name} hits ${hits.length}: ${hits.map((b) => `${b.x},${b.y} ${b.w}x${b.h}`).join(' | ')}`);
        hits[0].name = name;
        named.push({ ...hits[0], name });
    };
    take((b) => b.y < 230 && b.w > 300, 'TitleBar');
    take((b) => b.w > 180 && b.h > 180, 'Panel');
    take((b) => b.x > 880 && b.y < 420, 'FrameSelect');
    take((b) => b.x > 760 && b.x < 880 && b.y < 420, 'SlotItem');
    take((b) => b.x > 800 && b.y > 500 && b.y < 700, 'TabSelected');
    take((b) => b.x < 800 && b.y > 500 && b.y < 680 && b.w > 180, 'TabNormal');
    take((b) => b.y > 680 && b.y < 860 && b.x < 790 && b.w > 180, 'PlateStepper');
    take((b) => b.y > 660 && b.y < 760 && b.x > 780 && b.w > 380, 'XpTrack');
    take((b) => b.y > 740 && b.y < 830 && b.x > 780 && b.w > 300, 'XpFill');
    take((b) => b.y > 830 && b.x < 800 && b.w > 200 && b.h < 50, 'SliderTrack');
    take((b) => b.y > 830 && b.x > 780 && b.x < 900 && b.w < 100, 'SliderThumb');
    take((b) => b.y > 830 && b.x > 900 && b.h < 50, 'ProgressFill');
    const missed = right.filter((b) => !b.name);
    if (missed.length) {
        throw new Error(`unnamed ${missed.map((b) => `${b.x},${b.y} ${b.w}x${b.h}`).join(' | ')}`);
    }
    return named;
}

const img = decodePng(readFileSync(sheetPath));
const boxes = mergeSmall(components(img));
console.log(boxes.map((b) => `${b.x},${b.y} ${b.w}x${b.h}`).join('\n'));
console.log('count', boxes.length);

if (!write) process.exit(0);

mkdirSync(skinDir, { recursive: true });
const named = nameBoxes(boxes);
for (const box of named) {
    let rgba = crop(img, box);
    let w = box.w;
    let h = box.h;
    const icon = box.name.startsWith('Icon');
    const border = borders(rgba, w, h, SLICED.has(box.name));
    if (icon) {
        rgba = padCenter(rgba, w, h, ICON_SIZE);
        w = ICON_SIZE;
        h = ICON_SIZE;
    }
    const png = encodePng(w, h, rgba);
    writeFileSync(`${skinDir}/${box.name}.png`, png);
    writeMeta(box.name, w, h, border, icon ? 'none' : 'auto');
    console.log(`${box.name} ${w}x${h} border ${border.left},${border.right},${border.top},${border.bottom} ${createHash('sha1').update(png).digest('hex').slice(0, 8)}`);
}

const drop = [
    'BtnClose', 'BtnHelp', 'BtnSmallPrimary', 'BtnSmallSecondary', 'IconLanguage',
    'Extra0', 'Extra1', 'Extra2', 'Extra3', 'Extra4', 'Icon9',
];
for (const name of drop) {
    for (const ext of ['.png', '.png.meta']) {
        const p = `${skinDir}/${name}${ext}`;
        if (existsSync(p)) unlinkSync(p);
    }
}
