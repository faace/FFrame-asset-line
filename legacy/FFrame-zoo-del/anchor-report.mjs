import fs from 'fs';

// 生成前后对比图，供人工核对
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

const lines = [];
lines.push('id,anchor_old,anchor_new,pos_old,pos_new,左边缘_old,左边缘_new');
const before = JSON.parse(fs.readFileSync('del/rect-before.json', 'utf8'));
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const old = before.json[p.id];
  lines.push([
    p.id,
    '由切图留白算出',
    `${p.anchor[0]},${p.anchor[1]}`,
    JSON.stringify(old),
    `${p.cocos.x},${p.cocos.y}`,
    old.left,
    (p.cocos.x - p.png[0] * p.cocos.scale * 0.5).toFixed(4),
  ].join(','));
}
fs.writeFileSync('del/anchor-report.csv', lines.join('\n'), 'utf8');
console.log('报告已写 del/anchor-report.csv');

// 打印锚点变化最明显的几个
console.log('\n=== 锚点 y 变化最大的 6 件（pos 已补偿）===');
const rows = scenery.pieces.filter(p => p.cocos).map(p => {
  const old = before.json[p.id];
  const oldAy = p.png[1] > 0 ? (p.cocos.y === undefined ? 0 : 0) : 0;
  return p;
});
// 直接从 HEAD 拿旧 anchor
import { execSync } from 'child_process';
const head = JSON.parse(execSync('git show HEAD:assets/game/bundles/ZooHome/scenery.json', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));
const headMap = new Map(head.pieces.map(p => [p.id, p]));
const diffs = [];
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const o = headMap.get(p.id);
  if (!o || !o.cocos) continue;
  diffs.push({
    id: p.id,
    oldAnchor: o.anchor,
    newAnchor: p.anchor,
    dy: +(p.cocos.y - o.cocos.y).toFixed(3),
    dx: +(p.cocos.x - o.cocos.x).toFixed(3),
  });
}
diffs.sort((a, b) => Math.abs(b.dy) - Math.abs(a.dy));
for (const d of diffs.slice(0, 6)) {
  console.log(`  ${d.id.padEnd(26)} anchor ${JSON.stringify(d.oldAnchor)} → [0.5,0.5]   pos 补偿 dx=${d.dx} dy=${d.dy}`);
}
