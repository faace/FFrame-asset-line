import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerNodes = new Set((arr[rootIdx]._children || []).map(c => c.__id__));
const layerName = new Map([...layerNodes].map(i => [i, arr[i]._name]));

// 火烈鸟区在母图的实际范围（_ref_v06 1:1 匹配 (860,1480)-(1400,2200)）
const FL_MASTER = { x0: 860, y0: 1480, x1: 1400, y1: 2200 };
const FL_COCOS = {
  x0: FL_MASTER.x0 * 0.5, x1: FL_MASTER.x1 * 0.5,
  y0: 1280 - FL_MASTER.y1 * 0.5, y1: 1280 - FL_MASTER.y0 * 0.5,
};
console.log('火烈鸟区 cocos 范围:', FL_COCOS);

console.log('\n=== 火烈鸟区所有件在母图的脚点，看是否落在区内 ===');
const rows = [];
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!n._name.startsWith('Flamingo_')) continue;
  const base = n._name.replace('__TODO', '');
  const p = scenery.pieces.find(x => x.id.replace(/\//g, '_') === base);
  const x = n._lpos.x, y = n._lpos.y;
  const fx = Math.round(x * 2), fy = Math.round(2560 - y * 2);
  const inX = fx >= FL_MASTER.x0 && fx <= FL_MASTER.x1;
  const inY = fy >= FL_MASTER.y0 && fy <= FL_MASTER.y1;
  const wasKnown = p && p.foot;
  rows.push({ name: base, x, y, fx, fy, inX, inY, wasKnown, layer: layerName.get(n._parent.__id__) });
}
rows.sort((a, b) => a.fy - b.fy);
for (const r of rows) {
  const flag = r.inX && r.inY ? '' : '  ⚠ 区外';
  const tag = r.wasKnown ? '(原有)' : '(新摆)';
  console.log(`  ${r.name.replace('Flamingo_', '').padEnd(20)} cocos=(${r.x.toFixed(1).padStart(6)}, ${r.y.toFixed(1).padStart(6)})  母图脚点=(${r.fx}, ${r.fy}) ${tag}${flag}`);
}

// 火烈鸟 habitat 的范围：用它的显示尺寸反推
console.log('\n=== 火烈鸟 habitat 覆盖范围 ===');
const fh = arr.find(n => n && n.__type__ === 'cc.Node' && n._name.startsWith('Flamingo_habitat'));
const uit = arr[fh._components[0].__id__];
const s = fh._lscale.x;
const w = uit._contentSize.width, h = uit._contentSize.height;
const ax = uit._anchorPoint.x, ay = uit._anchorPoint.y;
const leftC = fh._lpos.x - w * s * ax;
const bottomC = fh._lpos.y - h * s * ay;
console.log(`  pos=(${fh._lpos.x}, ${fh._lpos.y}) scale=${s} size=${w}x${h} anchor=(${ax}, ${ay})`);
console.log(`  cocos 覆盖: x ${leftC.toFixed(1)} ~ ${(leftC + w * s).toFixed(1)}, y ${bottomC.toFixed(1)} ~ ${(bottomC + h * s).toFixed(1)}`);
console.log(`  母图覆盖: x ${(leftC * 2).toFixed(0)} ~ ${((leftC + w * s) * 2).toFixed(0)}, y ${(2560 - (bottomC + h * s) * 2).toFixed(0)} ~ ${(2560 - bottomC * 2).toFixed(0)}`);
