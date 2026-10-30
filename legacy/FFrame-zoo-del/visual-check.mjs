import fs from 'fs';
import path from 'path';

const RES = 'assets/game/bundles/ZooHome/res';
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

// 生成一个 HTML/JSON 供人工核对：每个件的 母图矩形（由 cocos + png + anchor + scale 反推）
// 母图 1440x2560，cocos 720x1280，换算 foot.x = cocos.x*2，foot.y = 2560 - cocos.y*2
const out = [];
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const [w, h] = p.png;
  const [ax, ay] = p.anchor;
  const s = p.cocos.scale;
  // cocos 左下为原点，y 向上；png 锚点 (ax, ay) 在该点
  const leftC = p.cocos.x - w * s * ax;
  const bottomC = p.cocos.y - h * s * ay;
  const rightC = leftC + w * s;
  const topC = bottomC + h * s;
  // 转母图像素（左上原点）
  out.push({
    id: p.id,
    zone: p.zone,
    layer: p.layer,
    inQueue: p.inQueue,
    master: [
      Math.round(leftC * 2),
      Math.round(2560 - topC * 2),
      Math.round(rightC * 2),
      Math.round(2560 - bottomC * 2),
    ],
    pngFile: p.file,
  });
}

fs.writeFileSync('del/pieces-master-rect.json', JSON.stringify(out, null, 2), 'utf8');

// 检查火烈鸟区各件是否落在 habitat 范围内，以及相互重叠
const fl = out.filter(r => r.zone === '火烈鸟');
const hb = fl.find(r => r.id === 'Flamingo/habitat');
console.log('火烈鸟 habitat 母图矩形:', hb.master);
console.log('\n各件母图矩形与池子范围关系:');
for (const r of fl) {
  if (r.id === 'Flamingo/habitat') continue;
  const [x0, y0, x1, y1] = r.master;
  const [hx0, hy0, hx1, hy1] = hb.master;
  const inside = x0 >= hx0 && x1 <= hx1 && y0 >= hy0 && y1 <= hy1;
  const overlap = !(x1 < hx0 || x0 > hx1 || y1 < hy0 || y0 > hy1);
  const rel = inside ? '完全在池内' : (overlap ? '与池相交' : '池外');
  console.log(`  ${r.id.replace('Flamingo/', '').padEnd(20)} [${x0},${y0},${x1},${y1}]  ${rel}`);
}

// 相互重叠检查（同区）
console.log('\n同区间明显重叠（面积占比 > 50%）:');
for (let i = 0; i < fl.length; i++) {
  for (let j = i + 1; j < fl.length; j++) {
    const a = fl[i].master, b = fl[j].master;
    const ox = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0]));
    const oy = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    if (!ox || !oy) continue;
    const oa = ox * oy;
    const aa = (a[2] - a[0]) * (a[3] - a[1]);
    const ba = (b[2] - b[0]) * (b[3] - b[1]);
    const ratio = oa / Math.min(aa, ba);
    if (ratio > 0.5) console.log(`  ${fl[i].id} ⊗ ${fl[j].id}  重叠 ${(ratio * 100).toFixed(0)}%`);
  }
}
