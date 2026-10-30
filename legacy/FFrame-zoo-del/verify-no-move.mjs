import fs from 'fs';

const scene = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const before = JSON.parse(fs.readFileSync('del/rect-before.json', 'utf8'));

function rect(p) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const left = p.cocos.x - w * s * ax;
  const bottom = p.cocos.y - h * s * ay;
  return {
    id: p.id,
    left: +left.toFixed(4), bottom: +bottom.toFixed(4),
    right: +(left + w * s).toFixed(4), top: +(bottom + h * s).toFixed(4),
    scale: s,
  };
}

const after = scene.pieces.filter(p => p.cocos).map(rect);
const beforeMap = new Map(before.map(r => [r.id, r]));

let moved = 0;
for (const a of after) {
  const b = beforeMap.get(a.id);
  if (!b) { console.log('新增', a.id); continue; }
  if (a.left !== b.left || a.bottom !== b.bottom || a.right !== b.right || a.top !== b.top) {
    console.log('位置变化', a.id, b, '→', a);
    moved++;
  }
}
console.log('件数:', after.length);
console.log('画面位置变化的件数:', moved, moved === 0 ? '（零移动）' : '');

// place 统计
const g = scene.pieces.filter(p => p.layer === 'ground');
console.log('\nground 件 place 分布:', g.reduce((m, p) => (m[p.place] = (m[p.place] || 0) + 1, m), {}));
console.log('全部 ground 有 masterBox:', g.every(p => Array.isArray(p.masterBox)));
