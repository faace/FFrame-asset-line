import fs from 'fs';
import path from 'path';

// 在所有工程里找真实的预制体实例格式
const roots = ['D:/creator/DiceTD2', 'D:/creator/MagicSort', 'D:/creator/RaisePig', 'D:/creator/StrangeVillages', 'D:/creator/FFrame'];
function walk(d, out = [], depth = 0) {
  if (depth > 7) return out;
  let es;
  try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return out; }
  for (const e of es) {
    if (['node_modules', 'library', 'temp', 'build', '.git'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out, depth + 1);
    else if (e.name.endsWith('.scene') || e.name.endsWith('.prefab')) out.push(p);
  }
  return out;
}

let found = 0;
for (const r of roots) {
  if (!fs.existsSync(r)) continue;
  for (const f of walk(r)) {
    let txt;
    try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (!txt.includes('cc.PrefabInstance')) continue;
    let j;
    try { j = JSON.parse(txt); } catch { continue; }
    const inst = j.find(o => o && o.__type__ === 'cc.PrefabInstance' && o.prefabRootNode);
    if (!inst) continue;
    console.log('\n=== 样例:', path.relative('D:/creator', f), '===');
    console.log(JSON.stringify(inst, null, 2).slice(0, 1200));
    // 同时打印对应的 Node 和 PrefabInfo
    const node = j.find(o => o && o.__type__ === 'cc.Node' && o._prefab && j[o._prefab.__id__] && j[o._prefab.__id__].instance);
    if (node) {
      console.log('  Node._prefab:', JSON.stringify(node._prefab));
      console.log('  PrefabInfo:', JSON.stringify(j[node._prefab.__id__], null, 2).slice(0, 600));
      console.log('  Node._components:', JSON.stringify(node._components));
    }
    if (++found >= 2) break;
  }
  if (found >= 2) break;
}
if (!found) console.log('没有找到任何预制体实例样例');
