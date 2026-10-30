import fs from 'fs';

const a = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

// 抽查：预制体里的位置是否与 scenery.json 的 cocos 一致
const read = new Map();
for (const o of a) {
  if (!o || o.__type__ !== 'cc.Node' || !o._parent) continue;
  const parent = a[o._parent.__id__];
  if (!parent || parent._name === 'PfZooHomeYard') continue;
  read.set(o._name.replace(/__TODO$/, ''), { x: o._lpos.x, y: o._lpos.y, s: o._lscale.x, layer: parent._name });
}

let diff = 0, checked = 0;
for (const p of scenery.pieces) {
  const r = read.get(p.id.replace(/\//g, '_'));
  if (!r || !p.cocos) continue;
  checked++;
  if (Math.abs(r.x - p.cocos.x) > 1e-6 || Math.abs(r.y - p.cocos.y) > 1e-6 || Math.abs(r.s - p.cocos.scale) > 1e-6) {
    console.log('不一致', p.id, p.cocos, r); diff++;
  }
}
console.log(`位置一致（已校验 ${checked} 件），差异 ${diff} 件`);

// 检查 layer 分组与 order 顺序
console.log('\n各层节点数:');
for (const o of a) {
  if (!o || o.__type__ !== 'cc.Node' || o._name === 'PfZooHomeYard' || o._parent === null) continue;
  const parent = a[o._parent.__id__];
  if (parent && parent._name === 'PfZooHomeYard') {
    console.log(`  ${o._name}: ${o._children.length} 件`);
  }
}

// 根节点与层节点
const root = a.find(o => o && o.__type__ === 'cc.Node' && o._parent === null);
console.log('\n根:', root._name, 'pos=', root._lpos, 'layer=', root._layer);
