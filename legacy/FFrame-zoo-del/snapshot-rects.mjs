import fs from 'fs';

const scene = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

// 快照：每件在 cocos 画布上的可见矩形（y 向上，左下原点）
function rect(p) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const left = p.cocos.x - w * s * ax;
  const bottom = p.cocos.y - h * s * ay;
  return {
    id: p.id,
    left: +left.toFixed(4),
    bottom: +bottom.toFixed(4),
    right: +(left + w * s).toFixed(4),
    top: +(bottom + h * s).toFixed(4),
    scale: s,
  };
}

const before = scene.pieces.filter(p => p.cocos).map(rect);
fs.writeFileSync('del/rect-before.json', JSON.stringify(before, null, 2), 'utf8');
console.log('已存快照', before.length, '件');
