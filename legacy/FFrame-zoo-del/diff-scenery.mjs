import fs from 'fs';
import { execSync } from 'child_process';

const now = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const head = JSON.parse(execSync('git show HEAD:assets/game/bundles/ZooHome/scenery.json', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }));

const oldMap = new Map(head.pieces.map(p => [p.id, p]));
console.log('=== scenery.json 相对 HEAD 的变化 ===');
for (const p of now.pieces) {
  const o = oldMap.get(p.id);
  if (!o) { console.log('新增', p.id); continue; }
  for (const k of ['place', 'inQueue', 'queueIndex', 'layer', 'order']) {
    if (JSON.stringify(o[k]) !== JSON.stringify(p[k])) console.log(`  ${p.id}.${k}: ${JSON.stringify(o[k])} → ${JSON.stringify(p[k])}`);
  }
  if (JSON.stringify(o.cocos) !== JSON.stringify(p.cocos)) {
    console.log(`  ${p.id}.cocos: ${JSON.stringify(o.cocos)} → ${JSON.stringify(p.cocos)}`);
  }
  if (JSON.stringify(o.anchor) !== JSON.stringify(p.anchor)) {
    console.log(`  ${p.id}.anchor: ${JSON.stringify(o.anchor)} → ${JSON.stringify(p.anchor)}`);
  }
  if (JSON.stringify(o.masterBox) !== JSON.stringify(p.masterBox)) {
    console.log(`  ${p.id}.masterBox: ${JSON.stringify(o.masterBox)} → ${JSON.stringify(p.masterBox)}`);
  }
}
