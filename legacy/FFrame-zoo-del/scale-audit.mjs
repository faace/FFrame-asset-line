import fs from 'fs';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));
const fl = scenery.pieces.filter(p => p.zone === '火烈鸟');

console.log('=== 火烈鸟区全部 12 件，按 queueIndex 排 ===');
const sorted = [...fl].sort((a, b) => (a.queueIndex || 0) - (b.queueIndex || 0));
for (const p of sorted) {
  const s = p.cocos.scale;
  const flag = s < 0.3 ? '  ⚠ 缩得很小' : '';
  console.log(`  ${String(p.queueIndex || '-').padStart(3)}. ${p.id.replace('Flamingo/', '').padEnd(20)} place=${String(p.place).padEnd(5)} scale=${String(s).padEnd(7)}${flag}`);
}

console.log('\n=== 与已知件 scale 对比（母图裁出的贴纸正常应在 0.4-0.6）===');
const others = scenery.pieces.filter(p => p.cocos && p.zone !== '火烈鸟' && p.cocos.scale);
const scales = others.map(p => p.cocos.scale).sort((a, b) => a - b);
console.log(`  其它区 ${scales.length} 件的 scale：最小 ${scales[0]}，中位 ${scales[Math.floor(scales.length / 2)]}，最大 ${scales[scales.length - 1]}`);

const small = fl.filter(p => p.cocos && p.cocos.scale < 0.3);
console.log(`\n火烈鸟区 scale < 0.3 的件：${small.length} 个`);
for (const p of small) {
  console.log(`  ${p.id.replace('Flamingo/', '').padEnd(20)} scale=${p.cocos.scale}  png=${p.png[0]}x${p.png[1]}  显示=${(p.png[0] * p.cocos.scale).toFixed(0)}x${(p.png[1] * p.cocos.scale).toFixed(0)}`);
}
