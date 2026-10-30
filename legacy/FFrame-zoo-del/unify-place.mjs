import fs from 'fs';

const PATH = 'assets/game/bundles/ZooHome/scenery.json';
const scenery = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// 统一：ground 件全部用 foot，并都补 masterBox（区域范围记录，仅参考，运行时不读）
function calcMasterBox(p) {
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

console.log('=== 统一 ground 件的 place 与 masterBox ===\n');
for (const p of scenery.pieces) {
  if (p.layer !== 'ground' || !p.cocos) continue;
  const before = { place: p.place, masterBox: p.masterBox };
  p.place = 'foot';
  p.masterBox = calcMasterBox(p);
  console.log(`${p.id.padEnd(22)} place: ${String(before.place).padEnd(5)} → foot   masterBox: ${JSON.stringify(before.masterBox) || '-'} → ${JSON.stringify(p.masterBox)}`);
}

fs.writeFileSync(PATH, JSON.stringify(scenery, null, 2) + '\n', 'utf8');
console.log('\n已写入');
