import fs from 'fs';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';
const names = ['LyTaskDetail', 'LyEnergy', 'LyCooldown', 'LyBubble', 'LyShop', 'LyBag', 'LyReward', 'LySignIn', 'LyAdReward', 'LySetting'];

let fail = 0;
for (const name of names) {
  const ts = path.join(dir, name + '.ts');
  const prefab = path.join(dir, name + '.prefab');
  const issues = [];

  if (!fs.existsSync(ts)) issues.push('缺 ts');
  if (!fs.existsSync(prefab)) issues.push('缺 prefab');
  if (!fs.existsSync(ts + '.meta')) issues.push('缺 ts.meta');
  if (!fs.existsSync(prefab + '.meta')) issues.push('缺 prefab.meta');

  if (fs.existsSync(ts)) {
    const src = fs.readFileSync(ts, 'utf8');
    if (!src.includes('extends GMLayer')) issues.push('未继承 GMLayer');
    if (!src.includes('db://gmajor/index')) issues.push('import 路径不是 db://gmajor');
  }

  if (fs.existsSync(prefab)) {
    const raw = fs.readFileSync(prefab, 'utf8');
    let arr;
    try { arr = JSON.parse(raw); } catch { issues.push('JSON 不合法'); arr = null; }
    if (arr) {
      const nodes = arr.filter(o => o && o.__type__ === 'cc.Node');
      const panel = nodes.find(n => n._name === 'panel');
      if (!panel) issues.push('缺 panel（GMLayer 会报错）');
      const root = nodes.find(n => n._parent === null);
      if (!root) issues.push('缺根节点');
      if (root && root._components.length < 2) issues.push('根节点组件不全');
      // 引用完整性
      let badRef = 0;
      const walk = (o) => {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) return o.forEach(walk);
        if (typeof o.__id__ === 'number' && (o.__id__ < 0 || o.__id__ >= arr.length)) badRef++;
        Object.values(o).forEach(walk);
      };
      walk(arr);
      if (badRef) issues.push(`越界引用 ${badRef}`);
    }
  }

  if (issues.length) { console.log(`✗ ${name}: ${issues.join('; ')}`); fail++; }
  else console.log(`✓ ${name}`);
}
console.log(fail === 0 ? '\n=== 10 个弹窗骨架全部就绪 ===' : `\n=== ${fail} 个有问题 ===`);
