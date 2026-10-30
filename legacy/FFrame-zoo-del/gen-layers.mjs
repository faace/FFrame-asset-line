import { execSync } from 'child_process';

// 策划案里的 10 个弹窗（页面 04—13），除去任务详情（常驻卡＋弹窗，单独处理）
const LAYERS = [
  ['LyTaskDetail', '任务详情'],
  ['LyEnergy', '体力'],
  ['LyCooldown', '生成器恢复'],
  ['LyBubble', '气泡'],
  ['LyShop', '商店'],
  ['LyBag', '背包'],      // 已存在
  ['LyReward', '待领奖励'],
  ['LySignIn', '签到'],
  ['LyAdReward', '广告累计奖励'],
  ['LySetting', '设置'],
];

for (const [name] of LAYERS) {
  try {
    const out = execSync(`node tools/create-ly-prefab.mjs assets/game/bundles/ZooHome ${name}`, { encoding: 'utf8' });
    process.stdout.write(out);
  } catch (e) {
    console.log(`${name}: ${e.stdout || e.message}`);
  }
}
