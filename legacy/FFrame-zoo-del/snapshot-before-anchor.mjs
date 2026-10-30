import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

// 记录每件当前的「可见矩形」（cocos 坐标，左下原点）
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

const fromJson = {};
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  fromJson[p.id] = rectOf(p.cocos.x, p.cocos.y, p.png[0], p.png[1], p.cocos.scale, p.anchor[0], p.anchor[1]);
}

// 从预制体也记一份
const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerSet = new Set((arr[rootIdx]._children || []).map(c => c.__id__));
const fromPrefab = {};
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  fromPrefab[n._name] = rectOf(n._lpos.x, n._lpos.y, uit._contentSize.width, uit._contentSize.height, n._lscale.x, uit._anchorPoint.x, uit._anchorPoint.y);
}

fs.writeFileSync('del/rect-before.json', JSON.stringify({
  json: fromJson,
  prefab: fromPrefab,
}, null, 2), 'utf8');

console.log('json 件数:', Object.keys(fromJson).length);
console.log('prefab 件数:', Object.keys(fromPrefab).length);

// 两边是否一致
let diff = 0;
for (const [id, r] of Object.entries(fromJson)) {
  const key = id.replace(/\//g, '_');
  const o = fromPrefab[key];
  if (!o) { console.log('prefab 缺', key); diff++; continue; }
  if (JSON.stringify(r) !== JSON.stringify(o)) { console.log('不一致', id, r, o); diff++; }
}
console.log('json 与 prefab 矩形一致:', diff === 0 ? '是' : `否(${diff})`);
