import fs from 'fs';

const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerNodes = new Set((arr[rootIdx]._children || []).map(c => c.__id__));
const layerName = new Map();
for (const id of layerNodes) layerName.set(id, arr[id]._name);

console.log('=== 带 __TODO 的节点当前状态 ===');
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!/__TODO$/.test(n._name)) continue;
  const uit = arr[n._components[0].__id__];
  const spr = n._components[1] ? arr[n._components[1].__id__] : null;
  console.log(`\n${n._name}`);
  console.log(`  layer=${layerName.get(n._parent.__id__)}  pos=(${n._lpos.x.toFixed(2)}, ${n._lpos.y.toFixed(2)})  scale=${n._lscale.x.toFixed(4)}`);
  console.log(`  size=${uit._contentSize.width}x${uit._contentSize.height}  anchor=(${uit._anchorPoint.x}, ${uit._anchorPoint.y})`);
  console.log(`  sprite=${spr && spr._spriteFrame ? spr._spriteFrame.__uuid__ : '无'}`);
}

console.log('\n=== ground 层其它 habitat 的处理 ===');
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (layerName.get(n._parent.__id__) !== 'ground') continue;
  const uit = arr[n._components[0].__id__];
  const base = n._name.replace('__TODO', '');
  const p = scenery.pieces.find(x => x.id.replace(/\//g, '_') === base);
  console.log(`\n${n._name}`);
  console.log(`  pos=(${n._lpos.x}, ${n._lpos.y})  scale=${n._lscale.x}  anchor=(${uit._anchorPoint.x}, ${uit._anchorPoint.y})  size=${uit._contentSize.width}x${uit._contentSize.height}`);
  if (p) {
    console.log(`  place=${p.place}  masterBox=${JSON.stringify(p.masterBox)}  png=${JSON.stringify(p.png)}`);
  }
}
