import fs from 'fs';

const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));

// 火烈鸟区在母图的 cocos 范围：母图 (860,1480)-(1400,2200)，母图→cocos 乘 0.5
const ZONE = { x0: 430, x1: 700, y0: 180, y1: 540 }; // cocos 坐标，y 向上
const PET = { x0: 50, x1: 330, y0: 250, y1: 545 };

function check(zone, zoneName) {
  console.log(`\n=== ${zoneName} 摆位合理性 (cocos x ${zone.x0}-${zone.x1}, y ${zone.y0}-${zone.y1}) ===`);
  for (const n of arr) {
    if (!n || n.__type__ !== 'cc.Node' || !n._parent) continue;
    if (!/__TODO$/.test(n._name)) continue;
    const uit = arr[n._components[0].__id__];
    const x = n._lpos.x, y = n._lpos.y, s = n._lscale.x;
    const w = uit._contentSize.width * s, h = uit._contentSize.height * s;
    const isFlamingo = n._name.startsWith('Flamingo');
    if (zoneName.startsWith('火烈鸟') !== isFlamingo) continue;

    const out = [];
    if (x < zone.x0 || x > zone.x1) out.push(`x=${x.toFixed(0)} 超出`);
    if (y < zone.y0 || y > zone.y1) out.push(`y=${y.toFixed(0)} 超出`);
    if (s < 0.15) out.push(`scale=${s} 很小，描边可能看不清`);
    const flag = out.length ? '  ⚠ ' + out.join('; ') : '  ok';
    console.log(`  ${n._name.replace('__TODO', '').padEnd(30)} pos=(${x.toFixed(1)}, ${y.toFixed(1)}) scale=${s} 显示=${w.toFixed(0)}x${h.toFixed(0)}${flag}`);
  }
}

check(ZONE, '火烈鸟');
check(PET, '小动物村');
