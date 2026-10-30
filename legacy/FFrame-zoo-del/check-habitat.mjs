import fs from 'fs';
import path from 'path';

const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

// ---------- 1. 验证 masterBox 公式能复现已知的三个 habitat ----------
console.log('=== 1. 用公式复现已知 habitat 的 masterBox ===');
function deriveMasterBox(p) {
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;
  return [
    Math.round(leftC * 2),
    Math.round(2560 - (bottomC + h * s) * 2),
    Math.round((leftC + w * s) * 2),
    Math.round(2560 - bottomC * 2),
  ];
}
for (const id of ['Panda/habitat', 'Savannah/habitat', 'IceBay/habitat']) {
  const p = scenery.pieces.find(x => x.id === id);
  const calc = deriveMasterBox(p);
  const ok = JSON.stringify(calc) === JSON.stringify(p.masterBox);
  console.log(`  ${id.padEnd(20)} 记录=${JSON.stringify(p.masterBox)}  算得=${JSON.stringify(calc)}  ${ok ? '✓' : '✗'}`);
}

// ---------- 2. 五个 habitat 的形状对比 ----------
console.log('\n=== 2. 五个 ground habitat 的形状 ===');
for (const p of scenery.pieces.filter(x => x.layer === 'ground')) {
  const [w, h] = p.png;
  const ratio = w / h;
  console.log(`  ${p.id.padEnd(22)} png=${String(w).padStart(3)}x${String(h).padStart(3)}  宽高比=${ratio.toFixed(2)}  place=${String(p.place).padEnd(5)} anchor=${JSON.stringify(p.anchor)} inQueue=${p.inQueue}`);
}

// ---------- 3. 火烈鸟空池子 PNG 的实际内容 ----------
console.log('\n=== 3. 火烈鸟空池子 PNG 分析 ===');
