import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const before = JSON.parse(fs.readFileSync('del/rect-before.json', 'utf8'));

function rectOf(x, y, w, h, s, ax, ay) {
  const left = x - w * s * ax;
  const bottom = y - h * s * ay;
  return {
    left: +left.toFixed(6),
    bottom: +bottom.toFixed(6),
    right: +(left + w * s).toFixed(6),
    top: +(bottom + h * s).toFixed(6),
  };
}

console.log('=== 1. 锚点是否全部 (0.5, 0.5) ===');
let anchorOK = true;
for (const p of scenery.pieces) {
  if (p.anchor[0] !== 0.5 || p.anchor[1] !== 0.5) { console.log('  scenery 异常', p.id, p.anchor); anchorOK = false; }
}
const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerSet = new Set((arr[rootIdx]._children || []).map(c => c.__id__));
let pcs = 0;
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  if (uit._anchorPoint.x !== 0.5 || uit._anchorPoint.y !== 0.5) { console.log('  prefab 异常', n._name); anchorOK = false; }
  pcs++;
}
console.log(anchorOK ? '  PASS 全部 0.5/0.5（scenery + prefab）' : '  FAIL');

console.log('\n=== 2. 可见矩形是否零变化 ===');
let moved = 0;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const now = rectOf(p.cocos.x, p.cocos.y, p.png[0], p.png[1], p.cocos.scale, 0.5, 0.5);
  const old = before.json[p.id];
  if (!old) continue;
  const d = Math.max(Math.abs(now.left - old.left), Math.abs(now.bottom - old.bottom), Math.abs(now.right - old.right), Math.abs(now.top - old.top));
  if (d > 0.01) { console.log(`  移动 ${p.id} 偏差 ${d.toFixed(4)}`); moved++; }
}
console.log(moved === 0 ? '  PASS 88 件可见矩形完全未变（偏差 < 0.01）' : `  FAIL ${moved} 件移位`);

console.log('\n=== 3. prefab 与 scenery.json 位置一致 ===');
const pMap = new Map();
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  pMap.set(n._name, { x: n._lpos.x, y: n._lpos.y, s: n._lscale.x });
}
let mismatch = 0;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const n = pMap.get(p.id.replace(/\//g, '_'));
  if (!n) { console.log('  缺', p.id); mismatch++; continue; }
  if (Math.abs(n.x - p.cocos.x) > 0.01 || Math.abs(n.y - p.cocos.y) > 0.01 || Math.abs(n.s - p.cocos.scale) > 1e-6) {
    console.log('  不一致', p.id, p.cocos, n); mismatch++;
  }
}
console.log(mismatch === 0 ? '  PASS 88 件完全一致' : `  FAIL ${mismatch}`);

console.log('\n=== 4. foot 与 cocos 自洽 ===');
let footOK = true;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const expect = [Math.round(p.cocos.x * 2), Math.round(2560 - p.cocos.y * 2)];
  if (JSON.stringify(expect) !== JSON.stringify(p.foot)) { console.log('  异常', p.id, p.foot, expect); footOK = false; }
}
console.log(footOK ? '  PASS' : '  FAIL');

console.log('\n=== 5. 抽样对比（改前 → 改后）===');
for (const id of ['SouthGate/gate_01', 'Panda/panda_left_01', 'Flamingo/umbrella_01', 'Panda/habitat']) {
  const p = scenery.pieces.find(x => x.id === id);
  const old = before.json[id];
  console.log(`  ${id.padEnd(24)} 可见矩形 left=${old.left} bottom=${old.bottom}`);
  console.log(`  ${''.padEnd(24)} 新 pos=(${p.cocos.x}, ${p.cocos.y}) anchor=${JSON.stringify(p.anchor)} scale=${p.cocos.scale}`);
}
