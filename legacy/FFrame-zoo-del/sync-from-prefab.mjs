import fs from 'fs';
import path from 'path';

const root = path.resolve('.');
const prefabPath = 'assets/game/bundles/ZooHome/PfZooHomeYard.prefab';
const sceneryPath = 'assets/game/bundles/ZooHome/scenery.json';

const a = JSON.parse(fs.readFileSync(prefabPath, 'utf8').replace(/^\uFEFF/, ''));
const scenery = JSON.parse(fs.readFileSync(sceneryPath, 'utf8'));

// 从预制体读出每个件的 位置/缩放/尺寸/锚点
const read = new Map();
for (const o of a) {
  if (!o || o.__type__ !== 'cc.Node') continue;
  if (!o._parent) continue; // 根
  const parent = a[o._parent.__id__];
  if (!parent || parent.__type__ !== 'cc.Node') continue;
  if (parent._name === 'PfZooHomeYard') continue; // 层节点
  const base = o._name.replace(/__TODO$/, '');
  const uit = a[o._components[0].__id__];
  read.set(base, {
    x: o._lpos.x, y: o._lpos.y,
    scale: o._lscale.x,
    w: uit._contentSize.width,
    h: uit._contentSize.height,
    ax: uit._anchorPoint.x, ay: uit._anchorPoint.y,
    layer: parent._name,
    name: o._name,
  });
}

console.log('预制体读到件数:', read.size);

let updated = 0, missing = [];
for (const p of scenery.pieces) {
  const base = p.id.replace(/\//g, '_');
  const r = read.get(base);
  if (!r) { missing.push(p.id); continue; }
  // 只在有变化时写
  const cocos = { x: r.x, y: r.y, scale: r.scale };
  const view = { x: r.x, y: 1280 - (r.y), scale: r.scale };
  const old = p.cocos ? JSON.stringify(p.cocos) : '';
  if (old !== JSON.stringify(cocos)) updated++;

  p.cocos = cocos;
  // foot 反推：cocos.y = (2560 - foot.y) * 0.5  →  foot.y = 2560 - cocos.y*2
  // cocos.x = foot.x * 0.5 → foot.x = cocos.x*2
  p.foot = [Math.round(r.x * 2), Math.round(2560 - r.y * 2)];
  p.scale = r.scale;
  p.scaleEach = r.scale;
  p.view = { x: r.x, y: 1280 - r.y, scale: r.scale };
  // place 类型保持原样；有 foot 的一律 foot（区域地面用 box）
  if (p.place !== 'box' && p.place !== 'foot') {
    p.place = p.layer === 'ground' ? 'box' : 'foot';
  }
}

// 火烈鸟空池子没有 masterBox，用预制体里的尺寸补
const fh = read.get('Flamingo_habitat');
if (fh) {
  const p = scenery.pieces.find(x => x.id === 'Flamingo/habitat');
  if (p && !p.masterBox) {
    // masterBox 是母图像素矩形 [x0,y0,x1,y1]，左上角对齐
    const left = (fh.x) * 2;
    const top = (2560 - fh.y * 2);
    p.masterBox = [Math.round(left), Math.round(top), Math.round(left + fh.w * fh.scale * 2), Math.round(top + fh.h * fh.scale * 2)];
    console.log('补 Flamingo/habitat masterBox:', p.masterBox);
  }
}

console.log('位置有变化的件:', updated);
if (missing.length) console.log('预制体里没有的件:', missing);

fs.writeFileSync(sceneryPath, JSON.stringify(scenery, null, 2) + '\n', 'utf8');
console.log('已写回 scenery.json');
