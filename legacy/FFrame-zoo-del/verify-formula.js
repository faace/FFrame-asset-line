const j = require('../assets/game/bundles/ZooHome/scenery.json');

// 验证 foot -> cocos 的换算关系
console.log('=== foot → cocos 换算验证（用已有坐标的件反推）===');
const sample = j.pieces.filter(p => p.foot && p.cocos).slice(0, 6);
for (const p of sample) {
  const cx = p.foot[0] * 0.5;
  const cy = (2560 - p.foot[1]) * 0.5;
  console.log(
    p.id.padEnd(28),
    `foot=(${p.foot})`,
    `cocos=(${p.cocos.x}, ${p.cocos.y})`,
    `反推=(${cx}, ${cy})`,
    cx === p.cocos.x && cy === p.cocos.y ? 'OK' : '不符'
  );
}

console.log('\n=== scale 与 view.scale / scaleEach 关系 ===');
for (const p of sample) {
  console.log(
    p.id.padEnd(28),
    `scale=${p.scale}`,
    `scaleEach=${p.scaleEach}`,
    `view.scale=${p.view.scale}`,
    `cocos.scale=${p.cocos.scale}`,
    p.view.scale === p.scale * 0.5 ? 'view=scale*0.5' : 'view≠scale*0.5',
    Math.abs(p.cocos.scale - p.view.scale) < 1e-9 ? 'cocos=view' : 'cocos≠view'
  );
}

console.log('\n=== anchor 与 png / content 关系（anchor.y 应为底边留白/png高）===');
for (const p of sample) {
  const [, , , bottom] = p.content;       // content 相对 png 的 bottom 坐标
  const padBottom = p.png[1] - bottom;    // 底部留白
  const expect = padBottom / p.png[1];
  console.log(
    p.id.padEnd(28),
    `png高=${p.png[1]}`,
    `content底=${bottom}`,
    `留白=${padBottom}`,
    `anchor.y=${p.anchor[1]}`,
    `算得=${expect.toFixed(4)}`,
    Math.abs(p.anchor[1] - expect) < 0.002 ? 'OK' : '近似/不符'
  );
}
