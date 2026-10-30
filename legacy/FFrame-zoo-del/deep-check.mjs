import fs from 'fs';

const a = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

// fileId 必须唯一
const ids = [];
a.forEach(o => { if (o && (o.__type__ === 'cc.CompPrefabInfo' || o.__type__ === 'cc.PrefabInfo') && o.fileId) ids.push(o.fileId); });
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
console.log('fileId 总数:', ids.length, '重复:', dup.length ? [...new Set(dup)] : '无');

// 每个 cc.Node 必须有且仅有一个 __prefab PrafabInfo，且其 root 指向根
const rootNode = a.find(o => o && o.__type__ === 'cc.Node' && o._parent === null);
const rootIdx = a.indexOf(rootNode);
let bad = 0;
a.forEach((o, i) => {
  if (!o || o.__type__ !== 'cc.Node') return;
  if (!o._prefab) { console.log('节点无 __prefab:', o._name); bad++; return; }
  const pi = a[o._prefab.__id__];
  if (!pi || pi.__type__ !== 'cc.PrefabInfo') { console.log('__prefab 指向错误:', o._name); bad++; return; }
  if (pi.root.__id__ !== rootIdx) { console.log('root 指向错误:', o._name, pi.root.__id__); bad++; }
  if (o._id !== '') { console.log('_id 应为空:', o._name, o._id); bad++; }
});
console.log('节点 prefab 信息问题:', bad);

// 名字唯一性（同层内）
const byParent = new Map();
a.forEach(o => {
  if (!o || o.__type__ !== 'cc.Node' || !o._parent) return;
  const pk = o._parent.__id__;
  if (!byParent.has(pk)) byParent.set(pk, []);
  byParent.get(pk).push(o._name);
});
let dupName = 0;
for (const [pk, names] of byParent) {
  const seen = new Set();
  for (const n of names) { if (seen.has(n)) { console.log('同层重名:', n, '于父', a[pk]._name); dupName++; } seen.add(n); }
}
console.log('同层重名:', dupName);

// layer 值检查
const layers = new Set(a.filter(o => o && o.__type__ === 'cc.Node').map(o => o._layer));
console.log('用到的 layer 值:', [...layers], '(33554432 = UI_2D)');

// 检查所有 Sprite 都有 spriteFrame
let noFrame = 0;
a.forEach(o => { if (o && o.__type__ === 'cc.Sprite' && !o._spriteFrame) noFrame++; });
console.log('缺 spriteFrame 的 Sprite:', noFrame);
