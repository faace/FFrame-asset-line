import fs from 'fs';
import path from 'path';

const base = '资源生成';
const zones = fs.readdirSync(base, { withFileTypes: true }).filter(e => e.isDirectory() && e.name !== '__pycache__');

console.log('=== 各区域 habitat 的切图记录（anchor 来源）===');
for (const z of zones) {
  const mdir = path.join(base, z.name, 'v2-按尺子', 'manifests');
  if (!fs.existsSync(mdir)) continue;
  for (const f of fs.readdirSync(mdir)) {
    if (!/habitat/i.test(f)) continue;
    const j = JSON.parse(fs.readFileSync(path.join(mdir, f), 'utf8'));
    for (const a of j.assets || []) {
      console.log(`  ${z.name.padEnd(8)} ${f.padEnd(18)} file=${a.file} anchor=${a.anchor} png=${JSON.stringify(a.png_wh)} opaque=${JSON.stringify(a.opaque_wh)}`);
    }
  }
}

// 火烈鸟空池子
const pool = path.join(base, '火烈鸟', '空池子', 'cut_v4.json');
if (fs.existsSync(pool)) {
  const j = JSON.parse(fs.readFileSync(pool, 'utf8'));
  for (const a of j.assets || []) {
    console.log(`  火烈鸟    空池子/cut_v4      file=${a.file} anchor=${a.anchor} png=${JSON.stringify(a.png_wh)} opaque=${JSON.stringify(a.opaque_wh)}`);
  }
}
