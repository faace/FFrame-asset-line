import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

const grounds = scenery.pieces.filter(p => p.layer === 'ground');

console.log('=== 五个 habitat 的完整数据 ===\n');
for (const p of grounds) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;
  const topC = bottomC + h * s;
  const rightC = leftC + w * s;

  // 母图矩形（左上原点）
  const mLeft = leftC * 2;
  const mTop = 2560 - topC * 2;
  const mRight = rightC * 2;
  const mBottom = 2560 - bottomC * 2;

  console.log(`${p.id}`);
  console.log(`  place=${p.place}  inQueue=${p.inQueue}  queueIndex=${p.queueIndex ?? '-'}`);
  console.log(`  anchor=(${ax}, ${ay})  这是「哪一点对齐 node 的 position」`);
  console.log(`  png=${w}x${h}  scale=${s}  显示=${(w*s).toFixed(0)}x${(h*s).toFixed(0)}`);
  console.log(`  cocos pos=(${p.cocos.x}, ${p.cocos.y})`);
  console.log(`  覆盖母图矩形=${JSON.stringify(p.masterBox || [Math.round(mLeft), Math.round(mTop), Math.round(mRight), Math.round(mBottom)])}`);
  console.log();
}

// 关键验证：masterBox 与 anchor 的关系
console.log('=== 结论验证：masterBox 是否 = 由 anchor 和 cocos 算出的矩形 ===');
for (const p of grounds) {
  if (!p.masterBox) { console.log(`  ${p.id.padEnd(22)} 无 masterBox`); continue; }
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const calc = [
    Math.round((p.cocos.x - w * s * ax) * 2),
    Math.round(2560 - (p.cocos.y - h * s * ay + h * s) * 2),
    Math.round((p.cocos.x - w * s * ax + w * s) * 2),
    Math.round(2560 - (p.cocos.y - h * s * ay) * 2),
  ];
  const same = JSON.stringify(calc) === JSON.stringify(p.masterBox);
  console.log(`  ${p.id.padEnd(22)} ${same ? '✓ 完全一致' : '✗ 不一致 ' + JSON.stringify(calc)}`);
}
