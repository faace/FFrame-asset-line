const W = 720, H = 1280;
const L = -W / 2, R = W / 2, B = -H / 2, T = H / 2;
const MED = { w: 260, h: 88 };
const LARGE = { w: 380, h: 120 };

const layout = [
  { name: '进入合成', size: LARGE, x: 0, y: -550, zone: '底部' },
  { name: '小镇', size: MED, x: -140, y: -430, zone: '底部' },
  { name: '建设', size: MED, x: 140, y: -430, zone: '底部' },
  { name: '签到', size: MED, x: -210, y: 560, zone: '左侧' },
  { name: '广告累计', size: MED, x: -210, y: 460, zone: '左侧' },
  { name: '设置', size: MED, x: -210, y: 360, zone: '左侧' },
];

const box = o => ({ l: o.x - o.size.w / 2, r: o.x + o.size.w / 2, b: o.y - o.size.h / 2, t: o.y + o.size.h / 2 });

let fail = 0;
for (const o of layout) {
  const b = box(o);
  const issues = [];
  if (b.l < L) issues.push(`左出界 ${b.l - L}`);
  if (b.r > R) issues.push(`右出界 ${b.r - R}`);
  if (b.b < B) issues.push(`下出界 ${b.b - B}`);
  if (b.t > T) issues.push(`上出界 ${b.t - T}`);
  if (issues.length) { fail++; console.log(`✗ ${o.name}: ${issues.join('; ')}`); }
  console.log(`${o.zone} ${o.name.padEnd(6)} (${String(o.x).padStart(4)}, ${String(o.y).padStart(4)})  占 x ${b.l}~${b.r}, y ${b.b}~${b.t}`);
}

for (let i = 0; i < layout.length; i++) for (let j = i + 1; j < layout.length; j++) {
  const a = box(layout[i]), c = box(layout[j]);
  const ox = Math.min(a.r, c.r) - Math.max(a.l, c.l);
  const oy = Math.min(a.t, c.t) - Math.max(a.b, c.b);
  if (ox > 0 && oy > 0) { console.log(`✗ ${layout[i].name} ⊗ ${layout[j].name} 重叠 ${ox}x${oy}`); fail++; }
}

console.log(`\n边距：上 ${T - Math.max(...layout.map(o => box(o).t))}  下 ${Math.min(...layout.map(o => box(o).b)) - B}  左 ${Math.min(...layout.map(o => box(o).l)) - L}  右 ${R - Math.max(...layout.map(o => box(o).r))}`);
console.log(fail === 0 ? '✓ 无重叠、无出界' : `✗ ${fail} 处问题`);

// 对照园景密度（图像坐标 y 向下，160 像素 = 80 cocos 单位）
console.log('\n左侧按钮覆盖的园景带（图像坐标）:');
for (const o of layout.filter(x => x.zone === '左侧')) {
  const b = box(o);
  const imgTop = 1280 - (b.t + 640);
  const imgBottom = 1280 - (b.b + 640);
  console.log(`  ${o.name.padEnd(6)} 图像 y ${imgTop.toFixed(0)}~${imgBottom.toFixed(0)}`);
}
