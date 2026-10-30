import fs from 'fs';

const PATH = 'assets/game/bundles/ZooHome/scenery.json';
const scene = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// 底边中点在母图上的坐标（母图左上原点）
function footOf(p) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;
  return [
    Math.round((leftC + w * s / 2) * 2),
    Math.round(2560 - bottomC * 2),
  ];
}

function masterBoxOf(p) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;
  return [
    Math.round(leftC * 2),
    Math.round(2560 - (bottomC + h * s) * 2),
    Math.round((leftC + w * s) * 2),
    Math.round(2560 - bottomC * 2),
  ];
}

console.log('=== 全部统一为 place=foot，并补齐 foot（底边中点）===\n');
for (const p of scene.pieces) {
  if (!p.cocos) { console.log(`${p.id.padEnd(22)} 跳过（无 cocos）`); continue; }
  const oldPlace = p.place;
  const oldFoot = JSON.stringify(p.foot);
  p.place = 'foot';
  p.foot = footOf(p);
  if (p.layer === 'ground') p.masterBox = masterBoxOf(p);
  if (oldPlace !== 'foot' || oldFoot !== JSON.stringify(p.foot)) {
    console.log(`${p.id.padEnd(22)} place: ${oldPlace} → foot   foot: ${oldFoot} → ${JSON.stringify(p.foot)}`);
  }
}

fs.writeFileSync(PATH, JSON.stringify(scene, null, 2) + '\n', 'utf8');

const dist = {};
for (const p of scene.pieces) dist[p.place] = (dist[p.place] || 0) + 1;
console.log('\nplace 分布:', dist);
console.log('全部有 foot:', scene.pieces.every(p => Array.isArray(p.foot)));
