import fs from 'fs';

const btns = [
  { name: 'pfBtnBoard', text: '进入棋盘', x: 0, y: -564, w: 380, h: 120 },
  { name: 'pfBtnSign', text: '签到', x: 214, y: 580, w: 260, h: 88 },
  { name: 'pfBtnScenery', text: '园景素材', x: 214, y: 476, w: 260, h: 88 },
  { name: 'pfBtnTown', text: '小镇', x: 214, y: 372, w: 260, h: 88 },
  { name: 'pfBtnAd', text: '广告任务', x: 214, y: 268, w: 260, h: 88 },
  { name: 'pfBtnSetting', text: '设置', x: 214, y: 164, w: 260, h: 88 },
];

console.log('=== 当前 6 个按钮的实际占位（Canvas 720x1280，原点在中心）===');
console.log('可见范围 x: -360~360, y: -640~640\n');
for (const b of btns) {
  const l = b.x - b.w / 2, r = b.x + b.w / 2;
  const bo = b.y - b.h / 2, t = b.y + b.h / 2;
  const side = b.x > 100 ? '右侧' : (b.x < -100 ? '左侧' : '居中');
  console.log(`${b.text.padEnd(6)} 位置(${b.x}, ${b.y})  ${b.w}x${b.h}  占 x ${l.toFixed(0)}~${r.toFixed(0)}, y ${bo.toFixed(0)}~${t.toFixed(0)}  ${side}`);
}

console.log('\n=== 策划案要求 ===');
console.log('顶部：体力、建设百分比、已建/总数（无 HUD 底色）');
console.log('左侧：签到、广告累计奖励、设置、隐藏UI（按钮约 56 宽，间隔 12）');
console.log('底部：小镇、进入合成、建设按钮、剩余素材');
console.log('顶部安全区下方 80 高；底部按钮在安全区上方留 20 以上');

console.log('\n=== 冲突 ===');
console.log('策划案「左侧按钮约 56 宽」= 纯图标方钮；框架 PfGMBtn 只有两档：');
console.log('  medium 260x88（icon 版 88x88）');
console.log('  large  380x120（icon 版 120x120）');
console.log('  最小也是 88 宽，做不到 56。');
