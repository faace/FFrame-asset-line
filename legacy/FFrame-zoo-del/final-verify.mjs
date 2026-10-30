import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const q = scenery.pieces.filter(p => p.inQueue);
const qi = q.map(p => p.queueIndex).sort((a, b) => a - b);

const checks = [
  ['JSON 合法', true],
  ['inQueue = 86', q.length === 86],
  ['queueIndex 1-86 连续无重复', qi.length === 86 && qi.every((v, i) => v === i + 1)],
  ['86 件全有 cocos', q.every(p => p.cocos)],
  ['place 全部为 foot（统一）', scenery.pieces.every(p => p.place === 'foot')],
  ['全部件有 foot', scenery.pieces.every(p => Array.isArray(p.foot))],
  ['ground 件都有 masterBox', scenery.pieces.filter(p => p.layer === 'ground').every(p => Array.isArray(p.masterBox))],
  ['order 仍 0-87 连续', scenery.pieces.map(p => p.order).sort((a, b) => a - b).every((v, i) => v === i)],
  ['预制体无 __TODO', arr.filter(o => o && o.__type__ === 'cc.Node' && /__TODO/.test(o._name)).length === 0],
  ['预制体节点 95', arr.filter(o => o && o.__type__ === 'cc.Node').length === 95],
  ['预制体 Sprite 88', arr.filter(o => o && o.__type__ === 'cc.Sprite').length === 88],
];

// foot 与 cocos 的自洽：foot = [cocos.x*2, 2560-cocos.y*2]
let footOK = true;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const expect = [Math.round(p.cocos.x * 2), Math.round(2560 - p.cocos.y * 2)];
  if (JSON.stringify(expect) !== JSON.stringify(p.foot)) { footOK = false; console.log('foot 不自洽:', p.id, p.foot, expect); }
}
checks.push(['foot 与 cocos 自洽', footOK]);

let ok = true;
for (const [name, pass] of checks) {
  console.log((pass ? 'PASS  ' : 'FAIL  ') + name);
  if (!pass) ok = false;
}
console.log('\n' + (ok ? '=== 全部通过 ===' : '=== 有失败项 ==='));

console.log('\n五个 ground habitat:');
for (const p of scenery.pieces.filter(x => x.layer === 'ground')) {
  console.log(`  ${p.id.padEnd(22)} place=${p.place} foot=${JSON.stringify(p.foot)} masterBox=${JSON.stringify(p.masterBox)} inQueue=${p.inQueue}`);
}
