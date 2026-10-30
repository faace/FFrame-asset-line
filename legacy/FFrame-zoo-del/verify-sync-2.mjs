import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const q = scenery.pieces.filter(p => p.inQueue);

const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerSet = new Set((arr[rootIdx]._children || []).map(c => c.__id__));
const pMap = new Map();
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  pMap.set(n._name, { x: n._lpos.x, y: n._lpos.y, s: n._lscale.x, ax: uit._anchorPoint.x, ay: uit._anchorPoint.y, layer: arr[n._parent.__id__]._name });
}

const checks = [];
checks.push(['inQueue = 86', q.length === 86]);
checks.push(['place 全部 foot', scenery.pieces.every(p => p.place === 'foot')]);
checks.push(['锚点全部 0.5/0.5', scenery.pieces.every(p => p.anchor[0] === 0.5 && p.anchor[1] === 0.5)]);
checks.push(['foot 与 cocos 自洽', scenery.pieces.every(p => !p.cocos || JSON.stringify(p.foot) === JSON.stringify([Math.round(p.cocos.x * 2), Math.round(2560 - p.cocos.y * 2)]))]);
checks.push(['queueIndex 1-86 连续', q.map(p => p.queueIndex).sort((a, b) => a - b).every((v, i) => v === i + 1)]);
checks.push(['order 0-87 连续', scenery.pieces.map(p => p.order).sort((a, b) => a - b).every((v, i) => v === i)]);
checks.push(['预制体无 __TODO', !arr.some(o => o && o.__type__ === 'cc.Node' && /__TODO/.test(o._name))]);

// 预制体与 json 一致
let mismatch = 0;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const n = pMap.get(p.id.replace(/\//g, '_'));
  if (!n) { mismatch++; continue; }
  if (Math.abs(n.x - p.cocos.x) > 0.01 || Math.abs(n.y - p.cocos.y) > 0.01 || Math.abs(n.s - p.cocos.scale) > 1e-6) mismatch++;
}
checks.push(['预制体与 json 88 件一致', mismatch === 0]);
checks.push(['预制体锚点全 0.5/0.5', [...pMap.values()].every(v => v.ax === 0.5 && v.ay === 0.5)]);

// 位置是否落在画布内（容错：允许部分出界，只提示）
const outOfCanvas = [];
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const n = pMap.get(p.id.replace(/\//g, '_'));
  if (!n) continue;
  const w = p.png[0] * p.cocos.scale, h = p.png[1] * p.cocos.scale;
  const left = n.x - w / 2, right = n.x + w / 2;
  const bottom = n.y - h / 2, top = n.y + h / 2;
  if (right < 0 || left > 720 || top < 0 || bottom > 1280) outOfCanvas.push(`${p.id} 完全在画布外`);
}

let ok = true;
for (const [n, p] of checks) { console.log((p ? 'PASS  ' : 'FAIL  ') + n); if (!p) ok = false; }
console.log('\n' + (ok ? '=== 全部通过 ===' : '=== 有失败项 ==='));
if (outOfCanvas.length) { console.log('\n提示：'); outOfCanvas.forEach(x => console.log('  ' + x)); }
