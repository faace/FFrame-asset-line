import fs from 'fs';

const raw = fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8');
const a = JSON.parse(raw.replace(/^\uFEFF/, ''));

console.log('数组长度:', a.length);
const nulls = a.map((o, i) => (o === null ? i : -1)).filter(i => i >= 0);
console.log('空槽:', nulls.length ? nulls : '无');

// 引用完整性
let badRef = 0;
function walk(o, pathStr) {
  if (o === null || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${pathStr}[${i}]`)); return; }
  if (typeof o.__id__ === 'number') {
    if (o.__id__ < 0 || o.__id__ >= a.length) { console.log('越界引用', pathStr, o.__id__); badRef++; }
  }
  for (const k of Object.keys(o)) walk(o[k], `${pathStr}.${k}`);
}
walk(a, 'root');
console.log('越界引用:', badRef);

const types = {};
a.forEach(o => { if (o && o.__type__) types[o.__type__] = (types[o.__type__] || 0) + 1; });
console.log('组件统计:', types);

// 检查 parent 反向一致
const nodes = a.map((o, i) => ({ o, i })).filter(x => x.o && x.o.__type__ === 'cc.Node');
let mismatch = 0;
for (const { o, i } of nodes) {
  for (const c of o._children || []) {
    const child = a[c.__id__];
    if (!child || !child._parent || child._parent.__id__ !== i) {
      console.log('父子不一致', o._name); mismatch++;
    }
  }
}
console.log('父子不一致:', mismatch);

console.log('\n需要调整的节点:');
a.filter(o => o && o.__type__ === 'cc.Node' && /__TODO/.test(o._name)).forEach(o => {
  console.log(`  ${o._name}  pos=(${o._lpos.x}, ${o._lpos.y}) scale=${o._lscale.x}`);
});
