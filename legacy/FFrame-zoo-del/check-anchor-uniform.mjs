import fs from 'fs';

const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

const rootIdx = arr.findIndex(n => n && n.__type__ === 'cc.Node' && n._parent === null);
const layerSet = new Set((arr[rootIdx]._children || []).map(c => c.__id__));

console.log('=== 锚点不是 (0.5, …) 的节点 ===');
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  if (Math.abs(uit._anchorPoint.x - 0.5) > 1e-6) {
    const p = scenery.pieces.find(x => x.id.replace(/\//g, '_') === n._name);
    console.log(`  ${n._name.padEnd(24)} anchor=(${uit._anchorPoint.x}, ${uit._anchorPoint.y})  place=${p ? p.place : '?'}`);
  }
}

console.log('\n=== 锚点 y 值范围（说明为什么不可能统一）===');
const ys = [];
for (const n of arr) {
  if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
  if (!layerSet.has(n._parent.__id__)) continue;
  const uit = arr[n._components[0].__id__];
  ys.push({ name: n._name, ay: uit._anchorPoint.y, h: uit._contentSize.height });
}
ys.sort((a, b) => a.ay - b.ay);
console.log(`  最小 ${ys[0].ay} (${ys[0].name})`);
console.log(`  最大 ${ys[ys.length - 1].ay} (${ys[ys.length - 1].name})`);
console.log(`  不同取值共 ${new Set(ys.map(y => y.ay)).size} 种`);

console.log('\n=== anchor.y 的定义验证：= 底部透明留白 / png 高度 ===');
for (const p of scenery.pieces.slice(0, 5)) {
  const padBottom = p.png[1] - p.content[3];
  console.log(`  ${p.id.padEnd(26)} png高=${p.png[1]} content底=${p.content[3]} 留白=${padBottom}  anchor.y=${p.anchor[1]}  算得=${(padBottom / p.png[1]).toFixed(4)}`);
}
