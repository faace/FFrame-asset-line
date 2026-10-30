import fs from 'fs';
import { execSync } from 'child_process';

const now = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

console.log('=== place 分布 ===');
const dist = {};
for (const p of now.pieces) dist[p.place] = (dist[p.place] || 0) + 1;
console.log(dist);

console.log('\n=== anchor 分布 ===');
const anchors = {};
for (const p of now.pieces) {
  const k = JSON.stringify(p.anchor);
  anchors[k] = (anchors[k] || 0) + 1;
}
console.log(anchors);

console.log('\n=== 相对 HEAD 的变化 ===');
const head = JSON.parse(execSync('git show HEAD:assets/game/bundles/ZooHome/scenery.json', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));
const headMap = new Map(head.pieces.map(p => [p.id, p]));

let cnt = 0;
for (const p of now.pieces) {
  const o = headMap.get(p.id);
  if (!o) { console.log('新增', p.id); cnt++; continue; }
  const diffs = [];
  for (const k of Object.keys(p)) {
    if (JSON.stringify(o[k]) !== JSON.stringify(p[k])) diffs.push(`${k}: ${JSON.stringify(o[k])} → ${JSON.stringify(p[k])}`);
  }
  for (const k of Object.keys(o)) {
    if (!(k in p)) diffs.push(`${k}: 被删除（原 ${JSON.stringify(o[k])}）`);
  }
  if (diffs.length) {
    console.log(`\n${p.id}`);
    for (const d of diffs) console.log(`    ${d}`);
    cnt++;
  }
}
console.log(`\n共 ${cnt} 件有变化`);
