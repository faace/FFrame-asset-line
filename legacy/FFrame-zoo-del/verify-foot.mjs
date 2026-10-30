import fs from 'fs';
import { execSync } from 'child_process';

const now = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const head = JSON.parse(execSync('git show HEAD:assets/game/bundles/ZooHome/scenery.json', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));
const headMap = new Map(head.pieces.map(p => [p.id, p]));

console.log('=== foot 与历史记录对比 ===');
let same = 0, changed = [], newlyAdded = [];
for (const p of now.pieces) {
  const o = headMap.get(p.id);
  if (!o) continue;
  if (!o.foot) { newlyAdded.push(p.id); continue; }
  if (JSON.stringify(o.foot) === JSON.stringify(p.foot)) same++;
  else changed.push({ id: p.id, old: o.foot, now: p.foot });
}
console.log(`与历史一致: ${same} 件`);
console.log(`新增 foot（原来没有）: ${newlyAdded.length} 件`);
console.log(`被改动: ${changed.length} 件`);
for (const c of changed.slice(0, 20)) console.log(`  ${c.id}: ${JSON.stringify(c.old)} → ${JSON.stringify(c.now)}`);

// 画面是否移动
console.log('\n=== 画面矩形是否移动 ===');
const before = JSON.parse(fs.readFileSync('del/rect-before.json', 'utf8'));
function rect(p) {
  const [w, h] = p.png, [ax, ay] = p.anchor, s = p.cocos.scale;
  const left = p.cocos.x - w * s * ax;
  const bottom = p.cocos.y - h * s * ay;
  return { id: p.id, left: +left.toFixed(4), bottom: +bottom.toFixed(4), right: +(left + w * s).toFixed(4), top: +(bottom + h * s).toFixed(4) };
}
const bm = new Map(before.map(r => [r.id, r]));
let moved = 0;
for (const p of now.pieces.filter(x => x.cocos)) {
  const a = rect(p), b = bm.get(p.id);
  if (!b) continue;
  if (a.left !== b.left || a.bottom !== b.bottom || a.right !== b.right || a.top !== b.top) {
    console.log('  移动', p.id); moved++;
  }
}
console.log('画面移动件数:', moved);
