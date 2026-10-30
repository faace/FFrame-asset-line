import fs from 'fs';
import path from 'path';

const root = path.resolve('.');
const resDir = path.join(root, 'assets/game/bundles/ZooHome/res');
const scenery = JSON.parse(fs.readFileSync(path.join(root, 'assets/game/bundles/ZooHome/scenery.json'), 'utf8'));

// 读每张图的 spriteFrame uuid
function spriteUuid(file) {
  const metaPath = path.join(root, 'assets/game/bundles/ZooHome', file + '.meta');
  if (!fs.existsSync(metaPath)) return null;
  const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const subs = m.subMetas || {};
  for (const k of Object.keys(subs)) {
    if (subs[k].name === 'spriteFrame') return subs[k].uuid;
  }
  return null;
}

let ok = 0, miss = [];
for (const p of scenery.pieces) {
  const u = spriteUuid(p.file);
  if (u) { ok++; p._sprite = u; } else miss.push(p.file);
}
console.log('spriteFrame 找到', ok, '缺失', miss.length);
if (miss.length) console.log(miss);

fs.writeFileSync('del/pieces-with-uuid.json', JSON.stringify(scenery, null, 2), 'utf8');
console.log('已写 del/pieces-with-uuid.json');
