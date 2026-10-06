import fs from "node:fs";
import path from "node:path";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const manifestPath = arg("--manifest");
if (!manifestPath) {
  console.error("用法: node scripts/html.js --manifest <清单.json>");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const root = path.dirname(path.resolve(manifestPath));
const items = [];
const sites = [];

for (const zone of manifest.zones || []) {
  if (zone.site !== false && zone.board) {
    sites.push({ name: zone.name, x: zone.board.x, y: zone.board.y });
  }
  for (const piece of zone.pieces || []) {
    const src = `${zone.id}/assets_png/${piece.file}`;
    items.push({
      zone: zone.name,
      name: piece.name,
      file: piece.file,
      src,
      kind: piece.kind || "",
      flip: piece.flip === "lr",
      estimated: Boolean(piece.estimated),
      placed: piece.placed !== false && Boolean(piece.ref_box),
      x: piece.ref_box ? piece.ref_box[0] : 0,
      y: piece.ref_box ? piece.ref_box[1] : 0,
      w: piece.ref_box ? piece.ref_box[2] : 0,
      h: piece.ref_box ? piece.ref_box[3] : 0,
      z: piece.z || 0,
      scale: piece.scale ?? 1,
      note: piece.note || "",
    });
  }
}

const data = { items, sites, total: items.length };
const opening = manifest.opening || "开场背景.png";
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${manifest.theme || "拼图预览"}</title>
<style>
  :root { --ink:#2a2118; --paper:#f6f0e4; --line:#e4d8c4; --wood:#c9854a; --wood-dark:#7a4a24; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { display: flex; background: #243042; color: var(--ink); font-family: "Microsoft YaHei", "PingFang SC", sans-serif; }
  aside { width: 320px; flex: none; background: var(--paper); border-right: 1px solid #d9cbb6; padding: 16px 16px 28px; overflow: auto; }
  h1 { font-size: 18px; margin: 0 0 8px; }
  .total { font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 6px; }
  .total b { color: #9a3d16; }
  p { margin: 0 0 10px; font-size: 13px; line-height: 1.55; }
  .modes { display: flex; gap: 8px; margin: 12px 0; }
  button { flex: 1; border: 1px solid var(--wood-dark); background: #fff; color: var(--ink); border-radius: 8px; padding: 8px 6px; font: inherit; cursor: pointer; }
  button.on { background: var(--wood); color: #fff; border-color: var(--wood); }
  .now { font-size: 13px; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; margin-bottom: 12px; }
  details { border-top: 1px solid var(--line); padding: 8px 0; }
  summary { cursor: pointer; font-size: 14px; }
  ul { margin: 6px 0 0; padding-left: 18px; font-size: 12px; line-height: 1.45; }
  li.miss { color: #9a3d16; }
  li.est { color: #6a5420; }
  main { flex: 1; overflow: auto; padding: 16px; }
  #sizer { position: relative; transform-origin: top left; }
  #stage { position: relative; width: 1440px; height: 2560px; }
  #stage img.bg { position: absolute; left: 0; top: 0; width: 1440px; height: 2560px; }
  .piece { position: absolute; image-rendering: auto; }
  .piece.flip { transform: scaleX(-1); }
  .board { position: absolute; width: 132px; height: 168px; z-index: 80000; pointer-events: none; }
  .wood { height: 132px; background: linear-gradient(#f0d7a4, #e2b56a); border: 6px solid #8a5324; border-radius: 8px; box-shadow: 0 6px 0 rgba(90,50,20,.18); display: flex; align-items: center; justify-content: center; color: #6a3414; font-weight: 700; font-size: 26px; }
  .cap { margin-top: 4px; text-align: center; font-size: 14px; color: #fff; text-shadow: 0 1px 2px #000; }
  body.full .board { display: none; }
  body.open .piece { display: none; }
</style>
</head>
<body class="open">
<aside>
  <h1>${manifest.theme || "拼图预览"}</h1>
  <p class="total">一共要完成 <b id="total"></b> 个元素</p>
  <p>开场背景是 1440×2560。贴纸按效果图上的位置贴，宽和高用同一个倍数，不拉扁、不拉高。</p>
  <div class="modes">
    <button id="btn-open" class="on" type="button">开场 · 施工中</button>
    <button id="btn-full" type="button">完整</button>
  </div>
  <div class="now" id="now"></div>
  <p>施工地各放一张同样的施工牌。主路不是施工地，开场不放牌子。</p>
  <div id="zones"></div>
</aside>
<main>
  <div id="sizer">
    <div id="stage">
      <img class="bg" alt="开场背景" src="${opening}">
    </div>
  </div>
</main>
<script>
const DATA = ${JSON.stringify(data)};
const stage = document.getElementById("stage");
const sizer = document.getElementById("sizer");
document.getElementById("total").textContent = DATA.total;
DATA.sites.forEach((site) => {
  const board = document.createElement("div");
  board.className = "board";
  board.style.left = (site.x - 66) + "px";
  board.style.top = (site.y - 84) + "px";
  board.innerHTML = '<div class="wood">施工中</div><div class="cap"></div>';
  board.querySelector(".cap").textContent = site.name;
  stage.appendChild(board);
});
const byZone = new Map();
DATA.items.forEach((it) => {
  if (!byZone.has(it.zone)) byZone.set(it.zone, []);
  byZone.get(it.zone).push(it);
  if (!it.placed) return;
  const img = document.createElement("img");
  img.className = "piece" + (it.flip ? " flip" : "");
  img.src = it.src;
  img.alt = it.zone + " " + it.name;
  img.style.left = it.x + "px";
  img.style.top = it.y + "px";
  img.style.width = it.w + "px";
  img.style.height = it.h + "px";
  img.style.zIndex = String(it.z);
  stage.appendChild(img);
});
const zones = document.getElementById("zones");
byZone.forEach((list, zone) => {
  const d = document.createElement("details");
  const placed = list.filter((it) => it.placed).length;
  const sum = document.createElement("summary");
  sum.textContent = zone + "　" + list.length + " 件";
  d.appendChild(sum);
  const ul = document.createElement("ul");
  list.forEach((it) => {
    const li = document.createElement("li");
    let text = it.name;
    if (!it.placed) { li.className = "miss"; text += "　未贴上"; if (it.note) text += "：" + it.note; }
    else if (it.estimated) { li.className = "est"; text += "　位置是对着效果图估的"; }
    li.textContent = text;
    ul.appendChild(li);
  });
  d.appendChild(ul);
  zones.appendChild(d);
});
function setMode(mode) {
  document.body.classList.toggle("open", mode === "open");
  document.body.classList.toggle("full", mode === "full");
  document.getElementById("btn-open").classList.toggle("on", mode === "open");
  document.getElementById("btn-full").classList.toggle("on", mode === "full");
  const now = document.getElementById("now");
  if (mode === "open") now.textContent = "这一页：开场背景，加上施工牌。园景元素先不放。";
  else {
    const placed = DATA.items.filter((it) => it.placed).length;
    const miss = DATA.total - placed;
    now.textContent = "这一页：背景上贴了 " + placed + " 件。" + (miss ? "还有 " + miss + " 件没贴上。" : "清单里的件都贴上了。");
  }
}
document.getElementById("btn-open").onclick = () => setMode("open");
document.getElementById("btn-full").onclick = () => setMode("full");
function fit() {
  const availW = Math.max(200, window.innerWidth - 320 - 32);
  const availH = Math.max(200, window.innerHeight - 32);
  const s = Math.min(availW / 1440, availH / 2560);
  sizer.style.transform = "scale(" + s + ")";
  sizer.style.width = (1440 * s) + "px";
  sizer.style.height = (2560 * s) + "px";
}
window.addEventListener("resize", fit);
setMode("open");
fit();
</script>
</body>
</html>
`;

const out = path.join(root, "预览.html");
fs.writeFileSync(out, html);
console.log(JSON.stringify({ html: out, total: items.length, sites: sites.length }));
