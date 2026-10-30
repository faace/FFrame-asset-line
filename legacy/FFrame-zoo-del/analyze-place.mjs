import fs from 'fs';

const scene = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

console.log('=== place 取值分布 ===');
const dist = {};
for (const p of scene.pieces) dist[p.place] = (dist[p.place] || 0) + 1;
console.log(dist);

console.log('\n=== place=foot 但缺 foot 的件 ===');
for (const p of scene.pieces) {
  if (p.place === 'foot' && !p.foot) {
    console.log(`  ${p.id.padEnd(24)} layer=${p.layer} anchor=${JSON.stringify(p.anchor)}`);
  }
}

console.log('\n=== 关键：anchor.x=0 的件（foot 反推会得到左上角而非底边中点）===');
for (const p of scene.pieces) {
  if (p.cocos && p.anchor[0] === 0) {
    console.log(`  ${p.id.padEnd(24)} anchor=${JSON.stringify(p.anchor)}  masterBox=${JSON.stringify(p.masterBox)}`);
  }
}

console.log('\n=== foot 与 masterBox 的关系（以 Panda 为例）===');
const panda = scene.pieces.find(p => p.id === 'Panda/habitat');
const [w, h] = panda.png;
const [ax, ay] = panda.anchor;
const s = panda.cocos.scale;
const leftC = panda.cocos.x - w * s * ax;
const bottomC = panda.cocos.y - h * s * ay;
console.log(`  cocos=(${panda.cocos.x}, ${panda.cocos.y})  anchor=(${ax}, ${ay})`);
console.log(`  覆盖 cocos 矩形: x ${leftC}~${leftC + w * s}, y ${bottomC}~${bottomC + h * s}`);
console.log(`  masterBox = ${JSON.stringify(panda.masterBox)}`);
console.log(`  若按 foot 公式反推 [cocos.x*2, 2560-cocos.y*2] = [${panda.cocos.x * 2}, ${2560 - panda.cocos.y * 2}]`);
console.log(`  ↑ 这等于 masterBox 的左上角，不是底边中点。因为 anchor=(0,1)。`);
