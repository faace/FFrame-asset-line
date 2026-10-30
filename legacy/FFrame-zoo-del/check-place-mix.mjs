import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

console.log('=== place=box 的件 ===');
for (const p of scenery.pieces.filter(x => x.place === 'box')) {
  console.log(`  ${p.id}  layer=${p.layer}  inQueue=${p.inQueue}  anchor=${JSON.stringify(p.anchor)}  masterBox=${JSON.stringify(p.masterBox)}`);
}

console.log('\n=== place=foot 但 anchor.x=0 的件（语义不一致）===');
for (const p of scenery.pieces.filter(x => p.place === 'foot' && x.anchor[0] === 0)) {
  console.log(`  ${p.id.padEnd(22)} anchor=${JSON.stringify(p.anchor)}  cocos=(${p.cocos.x}, ${p.cocos.y})  png=${p.png}  scale=${p.cocos.scale}`);
  const [w, h] = p.png, s = p.cocos.scale;
  const left = p.cocos.x, bottom = p.cocos.y - h * s;
  console.log(`      可见矩形: x ${left}~${left + w * s}, y ${bottom}~${p.cocos.y}`);
  console.log(`      若改 anchor=(0.5, 0.5) 并保持画面不动，cocos 应为 (${(left + w * s / 2).toFixed(2)}, ${(bottom + h * s / 2).toFixed(2)})`);
}
