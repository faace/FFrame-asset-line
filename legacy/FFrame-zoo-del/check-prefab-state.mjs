import fs from 'fs';

const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

console.log('预制体数组长度:', arr.length);
const nodes = arr.filter(o => o && o.__type__ === 'cc.Node');
console.log('节点数:', nodes.length);

const todo = nodes.filter(n => /__TODO/.test(n._name));
console.log('带 __TODO 的节点:', todo.length);
for (const n of todo) {
  console.log(`  ${n._name}  pos=(${n._lpos.x.toFixed(2)}, ${n._lpos.y.toFixed(2)})  scale=${n._lscale.x}`);
}

// 对比 scenery.json 里的位置，看 prefab 是不是退回到占位值
console.log('\n=== 对比 scenery.json（已同步的正确位置） ===');
const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerNodes = new Set((arr[rootIdx]?._children || []).map(c => c.__id__));
const inPrefab = new Map();
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerNodes.has(n._parent.__id__)) continue;
  inPrefab.set(n._name.replace(/__TODO$/, ''), n);
}

let diff = 0;
for (const p of scenery.pieces) {
  const key = p.id.replace(/\//g, '_');
  const n = inPrefab.get(key);
  if (!n) { console.log('预制体缺:', key); diff++; continue; }
  if (!p.cocos) continue;
  if (Math.abs(n._lpos.x - p.cocos.x) > 0.01 || Math.abs(n._lpos.y - p.cocos.y) > 0.01 || Math.abs(n._lscale.x - p.cocos.scale) > 0.0001) {
    console.log(`  不一致 ${key}: prefab=(${n._lpos.x.toFixed(2)}, ${n._lpos.y.toFixed(2)}, s=${n._lscale.x})  json=(${p.cocos.x}, ${p.cocos.y}, s=${p.cocos.scale})`);
    diff++;
  }
}
console.log('位置不一致件数:', diff);
