import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const q = scenery.pieces.filter(p => p.inQueue);

const checks = [
  ['inQueue = 86', q.length === 86],
  ['place 全部同值', new Set(scenery.pieces.map(p => p.place)).size === 1],
  ['全部有 foot', scenery.pieces.every(p => Array.isArray(p.foot))],
  ['foot 与 cocos 自洽', scenery.pieces.every(p => !p.cocos || JSON.stringify(p.foot) === JSON.stringify([Math.round(p.cocos.x * 2), Math.round(2560 - p.cocos.y * 2)]))],
  ['ground 都有 masterBox', scenery.pieces.filter(p => p.layer === 'ground').every(p => Array.isArray(p.masterBox))],
  ['queueIndex 1-86', q.map(p => p.queueIndex).sort((a, b) => a - b).every((v, i) => v === i + 1)],
  ['预制体无 __TODO', !arr.some(o => o && o.__type__ === 'cc.Node' && /__TODO/.test(o._name))],
];
let ok = true;
for (const [n, p] of checks) { console.log((p ? 'PASS  ' : 'FAIL  ') + n); if (!p) ok = false; }
console.log('\n' + (ok ? '全部通过' : '有失败项'));

console.log('\nplace 取值:', [...new Set(scenery.pieces.map(p => p.place))]);
console.log('火烈鸟右鸟新位置:', JSON.stringify(scenery.pieces.find(p => p.id === 'Flamingo/flamingo_right_01').cocos));
