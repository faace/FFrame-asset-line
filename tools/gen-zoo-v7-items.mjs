#!/usr/bin/env node
/**
 * ZooV7 物品图标：走 PixelLab，不走控件图那套色块填充。
 * 用法：node tools/gen-zoo-v7-items.mjs
 * token 读环境变量 PIXELLAB_TOKEN，否则读 %USERPROFILE%\.cursor\mcp.json。
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "style", "ZooV7", "物品", "history", "v1");

const style = [
    "Same pixel craft as a bright cozy zoo map: lawn green, sand-path cream, pond blue, sunflower yellow, and pale oak.",
    "Chubby rounded object, visible medium pixel grain, crisp edges, clean color blocks, thin dark-olive outline.",
    "High-key and saturated, not washed out. Not glossy plastic, not thick chocolate frames, not 8-bit, not gray, not photoreal.",
    "Flat front view, zero perspective, orthographic, the object face-on.",
    "Even soft light. One-pixel darker rim. No cast shadow, no glossy highlight.",
    "One object only, centered, with empty space around it. No plate, no frame, no text, no digits, no watermark.",
].join(" ");

const jobs = [
    { file: "icon_gold.png", w: 128, h: 128, bg: true, description: `${style} A single gold coin, round, face-on.` },
    { file: "icon_diamond.png", w: 128, h: 128, bg: true, description: `${style} A single blue diamond gem, faceted, face-on.` },
    { file: "icon_energy.png", w: 128, h: 128, bg: true, description: `${style} A single yellow lightning bolt, face-on.` },
    { file: "icon_ad.png", w: 128, h: 128, bg: true, description: `${style} A single chunky lawn-green play triangle pointing right, the mark for watching an ad. Not a screen, not a letter.` },
    { file: "icon_music.png", w: 128, h: 128, bg: true, description: `${style} A single music note, face-on.` },
    { file: "icon_sfx.png", w: 128, h: 128, bg: true, description: `${style} A single speaker with two sound waves, face-on.` },
    { file: "icon_settings.png", w: 128, h: 128, bg: true, description: `${style} A single settings gear, face-on.` },
    { file: "icon_play.png", w: 128, h: 128, bg: true, description: `${style} A single pond-blue play triangle pointing right. Not the green ad triangle.` },
];

function readToken() {
    const fromEnv = process.env.PIXELLAB_TOKEN;
    if (fromEnv) return fromEnv;
    const mcp = JSON.parse(readFileSync(join(process.env.USERPROFILE, ".cursor", "mcp.json"), "utf8"));
    const header = mcp?.mcpServers?.pixellab?.headers?.Authorization || "";
    const token = header.replace(/^Bearer\s+/i, "").trim();
    if (!token) throw new Error("no PixelLab token");
    return token;
}

async function generate(token, job) {
    const res = await fetch("https://api.pixellab.ai/v2/create-image-pixen", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            description: job.description,
            image_size: { width: job.w, height: job.h },
            no_background: job.bg,
        }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 360)}`);
    const data = JSON.parse(text);
    if (!data?.image?.base64) throw new Error(`no image ${text.slice(0, 360)}`);
    writeFileSync(join(outDir, job.file), Buffer.from(data.image.base64, "base64"));
    return data.usage ?? null;
}

mkdirSync(outDir, { recursive: true });
const token = readToken();
const log = [];
for (const job of jobs) {
    const started = Date.now();
    process.stdout.write(`gen ${job.file} ... `);
    try {
        const usage = await generate(token, job);
        console.log(`ok ${Date.now() - started}ms`);
        log.push({ file: job.file, w: job.w, h: job.h, ok: true, ms: Date.now() - started, usage });
    } catch (err) {
        console.log(`fail ${err.message}`);
        log.push({ file: job.file, ok: false, error: String(err.message) });
    }
}
writeFileSync(join(outDir, "params.json"), JSON.stringify({
    method: "pixellab",
    endpoint: "/v2/create-image-pixen",
    no_background: true,
    jobs: log,
}, null, 4) + "\n");
const failed = log.filter((job) => !job.ok).length;
console.log(`done ${log.length - failed}/${log.length} -> ${outDir}`);
if (failed) process.exitCode = 1;
