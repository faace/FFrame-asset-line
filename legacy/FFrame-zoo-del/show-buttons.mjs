import fs from 'fs';

const ts = fs.readFileSync('assets/game/bundles/ZooHome/ScZooHome.ts', 'utf8');

// 提取 HOME_BTNS 内容
const m = ts.match(/const HOME_BTNS: HomeBtn\[\] = \[([\s\S]*?)\];/);
console.log('=== 现有按钮定义 ===');
console.log(m ? m[1].trim() : '未找到');

// 画布尺寸与按钮档位
console.log('\n=== 画布与档位 ===');
console.log('Canvas: 720 x 1280，锚点 (0.5, 0.5)，位置 (360, 640)');
console.log('坐标原点在画布中心，x 向右为正，y 向上为正');
console.log('所以可见范围：x -360 ~ +360，y -640 ~ +640');
console.log('大档按钮 380x120，中档 260x88');
