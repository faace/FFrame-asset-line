import fs from 'fs';

// 检查 ScZooHome.ts 里 showLayer 的调用形式是否与框架签名一致
const src = fs.readFileSync('assets/game/bundles/ZooHome/ScZooHome.ts', 'utf8');
const m = src.match(/gu\.showLayer\([\s\S]*?\);/);
console.log('=== showLayer 调用 ===');
console.log(m ? m[0] : '未找到');

const ui = fs.readFileSync('D:/creator/FFrame/gmajor/ui/GMUIManager.ts', 'utf8');
const sig = ui.match(/showLayer\([^)]*\)[^{]*/);
console.log('\n=== 框架签名 ===');
console.log(sig ? sig[0].replace(/\s+/g, ' ') : '未找到');
