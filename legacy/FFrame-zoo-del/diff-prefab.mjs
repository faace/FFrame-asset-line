import fs from 'fs';
import { execSync } from 'child_process';

const nowRaw = fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8');
const now = JSON.parse(nowRaw.replace(/^\uFEFF/, ''));
const head = JSON.parse(execSync('git show HEAD:assets/game/bundles/ZooHome/PfZooHomeYard.prefab', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));

console.log('现在数组长度:', now.length, ' HEAD 长度:', head.length);

// 按节点名对比
function collect(arr) {
  const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
  const layerSet = new Set((arr[rootIdx]?._children || []).map(c => c.__id__));
  const out = new Map();
  for (const [i, n] of arr.entries()) {
    if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
    if (!layerSet.has(n._parent.__id__)) continue;
    const uit = arr[n._components[0].__id__];
    out.set(n._name, {
      x: n._lpos.x, y: n._lpos.y, sx: n._lscale.x,
      ax: uit._anchorPoint.x, ay: uit._anchorPoint.y,
      w: uit._contentSize.width, h: uit._contentSize.height,
      layer: arr[n._parent.__id__]._name,
    });
  }
  return out;
}

const a = collect(now), b = collect(head);
console.log('节点数 now:', a.size, ' head:', b.size);

console.log('\n=== 逐节点差异 ===');
let diff = 0;
for (const [name, nv] of a) {
  const ov = b.get(name);
  if (!ov) { console.log(`[新增] ${name}`); diff++; continue; }
  const ds = [];
  if (Math.abs(nv.x - ov.x) > 1e-6) ds.push(`x ${ov.x} → ${nv.x}`);
  if (Math.abs(nv.y - ov.y) > 1e-6) ds.push(`y ${ov.y} → ${nv.y}`);
  if (Math.abs(nv.sx - ov.sx) > 1e-6) ds.push(`scale ${ov.sx} → ${nv.sx}`);
  if (Math.abs(nv.ax - ov.ax) > 1e-6) ds.push(`anchorX ${ov.ax} → ${nv.ax}`);
  if (Math.abs(nv.ay - ov.ay) > 1e-6) ds.push(`anchorY ${ov.ay} → ${nv.ay}`);
  if (nv.layer !== ov.layer) ds.push(`layer ${ov.layer} → ${nv.layer}`);
  if (ds.length) { console.log(`  ${name}: ${ds.join(', ')}`); diff++; }
}
for (const name of b.keys()) if (!a.has(name)) { console.log(`[删除] ${name}`); diff++; }
console.log('\n差异节点数:', diff);
