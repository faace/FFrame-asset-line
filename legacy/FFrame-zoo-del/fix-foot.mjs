import fs from 'fs';

const PATH = 'assets/game/bundles/ZooHome/scenery.json';
const scene = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// foot 的正确定义：锚点落在母图上的位置（母图左上原点）
// cocos 画布 720x1280 与母图 1440x2560 是 0.5 倍关系，y 轴相反。
function footOf(p) {
  return [
    Math.round(p.cocos.x * 2),
    Math.round(2560 - p.cocos.y * 2),
  ];
}

let fixed = 0;
for (const p of scene.pieces) {
  if (!p.cocos) continue;
  const next = footOf(p);
  if (JSON.stringify(p.foot) !== JSON.stringify(next)) {
    if (fixed < 8) console.log(`${p.id.padEnd(26)} ${JSON.stringify(p.foot)} → ${JSON.stringify(next)}`);
    p.foot = next;
    fixed++;
  }
}
fs.writeFileSync(PATH, JSON.stringify(scene, null, 2) + '\n', 'utf8');
console.log(`\n修正 ${fixed} 件`);
