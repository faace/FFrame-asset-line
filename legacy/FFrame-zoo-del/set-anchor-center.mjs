import fs from 'fs';

const SCENERY = 'assets/game/bundles/ZooHome/scenery.json';
const PREFAB = 'assets/game/bundles/ZooHome/PfZooHomeYard.prefab';

const scenery = JSON.parse(fs.readFileSync(SCENERY, 'utf8'));
const arr = JSON.parse(fs.readFileSync(PREFAB, 'utf8').replace(/^\uFEFF/, ''));

const NEW_AX = 0.5, NEW_AY = 0.5;

// ---- 1. scenery.json ----
// 旧: left = x - w*s*ax  →  新: x' = left + w*s*NEW_AX
let n1 = 0;
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const [w, h] = p.png;
  const s = p.cocos.scale;
  const [ax, ay] = p.anchor;

  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;

  const nx = +(leftC + w * s * NEW_AX).toFixed(4);
  const ny = +(bottomC + h * s * NEW_AY).toFixed(4);

  if (Math.abs(nx - p.cocos.x) > 1e-9 || Math.abs(ny - p.cocos.y) > 1e-9) n1++;

  p.cocos = { x: nx, y: ny, scale: s };
  p.view = { x: nx, y: +(1280 - ny).toFixed(4), scale: s };
  p.anchor = [NEW_AX, NEW_AY];
  p.foot = [Math.round(nx * 2), Math.round(2560 - ny * 2)];
}
fs.writeFileSync(SCENERY, JSON.stringify(scenery, null, 2) + '\n', 'utf8');
console.log(`scenery.json: ${n1} 件 pos 重算`);

// ---- 2. prefab ----
const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerSet = new Set((arr[rootIdx]._children || []).map(c => c.__id__));

let n2 = 0;
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  const w = uit._contentSize.width, h = uit._contentSize.height;
  const s = n._lscale.x;
  const ax = uit._anchorPoint.x, ay = uit._anchorPoint.y;

  const leftC = n._lpos.x - w * s * ax;
  const bottomC = n._lpos.y - h * s * ay;

  const nx = +(leftC + w * s * NEW_AX).toFixed(4);
  const ny = +(bottomC + h * s * NEW_AY).toFixed(4);

  if (Math.abs(nx - n._lpos.x) > 1e-9 || Math.abs(ny - n._lpos.y) > 1e-9) n2++;

  n._lpos.x = nx;
  n._lpos.y = ny;
  uit._anchorPoint.x = NEW_AX;
  uit._anchorPoint.y = NEW_AY;
}
fs.writeFileSync(PREFAB, JSON.stringify(arr, null, 2) + '\n', 'utf8');
console.log(`prefab: ${n2} 件 pos 重算`);
