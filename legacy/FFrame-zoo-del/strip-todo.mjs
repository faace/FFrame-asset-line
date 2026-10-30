import fs from 'fs';

const PREFAB = 'assets/game/bundles/ZooHome/PfZooHomeYard.prefab';
const arr = JSON.parse(fs.readFileSync(PREFAB, 'utf8').replace(/^\uFEFF/, ''));

let n = 0;
for (const o of arr) {
  if (o && o.__type__ === 'cc.Node' && /__TODO$/.test(o._name)) {
    o._name = o._name.replace(/__TODO$/, '');
    console.log('去掉标记:', o._name);
    n++;
  }
}
fs.writeFileSync(PREFAB, JSON.stringify(arr, null, 2) + '\n', 'utf8');
console.log('\n共', n, '个');
