import fs from 'fs';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';

console.log('=== 文件清单 ===');
const files = fs.readdirSync(dir).filter(f => !f.endsWith('.meta'));
for (const f of files.sort()) {
  const isDir = fs.statSync(path.join(dir, f)).isDirectory();
  const hasMeta = fs.existsSync(path.join(dir, f + '.meta'));
  console.log(`${isDir ? '[目录]' : '[文件]'} ${f.padEnd(28)} meta: ${hasMeta ? '有' : '缺'}`);
}

console.log('\n=== 首页 HUD 与弹窗的依赖链 ===');
const checks = [
  ['ScZooHome.ts 引用 HomeHud', 'ScZooHome.ts', 'mountHud'],
  ['ScZooHome.ts 引用 ZooFont', 'ScZooHome.ts', "from './ZooFont'"],
  ['HomeHud.ts 引用 ZooFont', 'HomeHud.ts', "from './ZooFont'"],
  ['ZooLayer.ts 引用 ZooFont', 'ZooLayer.ts', "from './ZooFont'"],
  ['ZooLayer 建标题条', 'ZooLayer.ts', "titleBar"],
  ['ZooLayer 建关闭钮', 'ZooLayer.ts', "btnClose"],
  ['ZooLayer 建 body', 'ZooLayer.ts', "getChildByName('body')"],
];
let fail = 0;
for (const [label, file, needle] of checks) {
  const src = fs.readFileSync(path.join(dir, file), 'utf8');
  const ok = src.includes(needle);
  console.log(`${ok ? '✓' : '✗'} ${label}`);
  if (!ok) fail++;
}

console.log('\n=== 弹窗是否都继承 ZooLayer ===');
const layers = files.filter(f => /^Ly.*\.ts$/.test(f));
for (const f of layers.sort()) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const ok = src.includes('extends ZooLayer');
  console.log(`${ok ? '✓' : '✗'} ${f}`);
  if (!ok) fail++;
}

console.log(`\n${fail === 0 ? '=== 全部通过 ===' : `=== ${fail} 处问题 ===`}`);
