import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

// 运行时到底读哪些字段？先确认 ScZooHome.ts 里的读取
const ts = fs.readFileSync('assets/game/bundles/ZooHome/ScZooHome.ts', 'utf8');
console.log('=== ScZooHome.ts 里对 place / masterBox / view / foot 的引用 ===');
for (const key of ['place', 'masterBox', 'view', 'foot', 'cocos', 'anchor', 'png']) {
  const hits = ts.split('\n').map((l, i) => ({ l, i: i + 1 })).filter(x => new RegExp(`\\b${key}\\b`).test(x.l) && !/^\s*\/\//.test(x.l));
  console.log(`  ${key.padEnd(12)} ${hits.length} 处`);
  hits.slice(0, 4).forEach(h => console.log(`      ${h.i}: ${h.l.trim()}`));
}

// view.y 与 cocos.y 的关系
console.log('\n=== view.y 是否等于 1280 - cocos.y ===');
let bad = 0;
for (const p of scenery.pieces) {
  if (!p.cocos || !p.view) continue;
  const expect = 1280 - p.cocos.y;
  if (Math.abs(p.view.y - expect) > 0.01) {
    console.log(`  异常 ${p.id}: view.y=${p.view.y} 期望=${expect}`);
    bad++;
  }
}
console.log('异常数:', bad);
