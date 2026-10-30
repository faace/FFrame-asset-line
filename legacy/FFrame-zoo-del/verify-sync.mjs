import fs from 'fs';
import path from 'path';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerNodes = new Set((arr[rootIdx]._children || []).map(c => c.__id__));

const inPrefab = new Map();
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerNodes.has(n._parent.__id__)) continue;
  inPrefab.set(n._name, { x: n._lpos.x, y: n._lpos.y, s: n._lscale.x });
}

let mismatch = 0;
for (const p of scenery.pieces) {
  const key = p.id.replace(/\//g, '_');
  const n = inPrefab.get(key);
  if (!n) { console.log('预制体缺:', key); mismatch++; continue; }
  if (!p.cocos) { console.log('scenery 缺 cocos:', p.id); mismatch++; continue; }
  if (Math.abs(n.x - p.cocos.x) > 0.01 || Math.abs(n.y - p.cocos.y) > 0.01 || Math.abs(n.s - p.cocos.scale) > 0.0001) {
    console.log('不一致:', key, p.cocos, n);
    mismatch++;
  }
}
console.log('预制体与 scenery.json 一致:', mismatch === 0 ? '是（88 件全部吻合）' : `否，${mismatch} 处`);
