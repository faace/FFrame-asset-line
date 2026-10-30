import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

console.log('=== 火烈鸟区 12 件最终状态 ===');
const fl = scenery.pieces.filter(p => p.zone === '火烈鸟');
for (const p of fl) {
  console.log(`${p.id.padEnd(28)} place=${String(p.place).padEnd(5)} inQueue=${String(p.inQueue).padEnd(5)} masterBox=${JSON.stringify(p.masterBox) || '无'} cocos=${JSON.stringify(p.cocos)}`);
}

const h = scenery.pieces.find(p => p.id === 'Flamingo/habitat');
console.log('\n=== 火烈鸟 habitat 详情 ===');
console.log(JSON.stringify({
  place: h.place, masterBox: h.masterBox, cocos: h.cocos, png: h.png,
  anchor: h.anchor, scale: h.scale, inQueue: h.inQueue, queueIndex: h.queueIndex,
  foot: h.foot,
}, null, 2));

// 校验：没有残留 __TODO
const todo = arr.filter(n => n && n.__type__ === 'cc.Node' && /__TODO/.test(n._name));
console.log('\n剩余 __TODO 节点:', todo.length);

// 校验：全部 86 件都有 cocos
const inQ = scenery.pieces.filter(p => p.inQueue);
console.log('inQueue 件数:', inQ.length, '全部有 cocos:', inQ.every(p => p.cocos));
console.log('全部有 place:', inQ.every(p => p.place));
console.log('缺 foot 但 place=foot 的:', inQ.filter(p => p.place === 'foot' && !p.foot).map(p => p.id));
