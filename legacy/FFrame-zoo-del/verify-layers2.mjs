import fs from 'fs';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';
const names = ['LyTaskDetail', 'LyEnergy', 'LyCooldown', 'LyBubble', 'LyShop', 'LyBag', 'LyReward', 'LySignIn', 'LyAdReward', 'LySetting'];

// 脚本 uuid → 压缩 cid，验证 prefab 里引用的 cid 与 ts.meta 一致
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function compressUuid(uuid) {
  const hex = uuid.replace(/-/g, '');
  const head = hex.slice(0, 5);
  const rest = hex.slice(5);
  let out = head;
  for (let i = 0; i < rest.length; i += 3) {
    const num = parseInt(rest.slice(i, i + 3).padEnd(3, '0'), 16);
    out += B64[(num >> 6) & 63] + B64[num & 63];
  }
  return out;
}

let fail = 0;
for (const name of names) {
  const issues = [];
  const tsPath = path.join(dir, name + '.ts');
  const metaPath = tsPath + '.meta';
  const prefabPath = path.join(dir, name + '.prefab');

  const src = fs.readFileSync(tsPath, 'utf8');
  if (!src.includes('extends ZooLayer')) issues.push('未继承 ZooLayer');
  if (!src.includes("from './ZooLayer'")) issues.push('import 路径不对');

  const uuid = JSON.parse(fs.readFileSync(metaPath, 'utf8')).uuid;
  const cid = compressUuid(uuid);
  const arr = JSON.parse(fs.readFileSync(prefabPath, 'utf8'));
  const hasCid = arr.some(o => o && o.__type__ === cid);
  if (!hasCid) issues.push(`预制体里找不到脚本 cid ${cid}`);

  const panel = arr.find(o => o && o.__type__ === 'cc.Node' && o._name === 'panel');
  if (!panel) issues.push('缺 panel');
  else {
    const uit = arr[panel._components[0].__id__];
    if (uit._contentSize.width !== 620 || uit._contentSize.height !== 800) issues.push('panel 尺寸不是 620x800');
    const hasSprite = panel._components.some(c => arr[c.__id__]?.__type__ === 'cc.Sprite');
    if (!hasSprite) issues.push('panel 缺底板 Sprite');
  }

  if (issues.length) { console.log(`✗ ${name}: ${issues.join('; ')}`); fail++; }
  else console.log(`✓ ${name}`);
}
console.log(fail === 0 ? '\n=== 10 个弹窗全部就绪 ===' : `\n=== ${fail} 个有问题 ===`);
