import fs from 'fs';
import path from 'path';

const root = path.resolve('.');
const scenery = JSON.parse(fs.readFileSync(path.join(root, 'assets/game/bundles/ZooHome/scenery.json'), 'utf8'));

const TODO = '__TODO';
const W = 720, H = 1280;

function spriteUuid(file) {
  const metaPath = path.join(root, 'assets/game/bundles/ZooHome', file + '.meta');
  if (!fs.existsSync(metaPath)) return null;
  const m = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  for (const k of Object.keys(m.subMetas || {})) {
    if (m.subMetas[k].name === 'spriteFrame') return m.subMetas[k].uuid;
  }
  return null;
}

// ---- 区域兜底位置（缺坐标的件先摆到区域重心）----
const zoneStats = {};
for (const p of scenery.pieces) {
  if (!p.cocos) continue;
  const z = (zoneStats[p.zone] = zoneStats[p.zone] || { xs: [], ys: [], scales: [] });
  z.xs.push(p.cocos.x); z.ys.push(p.cocos.y); z.scales.push(p.cocos.scale);
}
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const fallback = {};
for (const [zone, z] of Object.entries(zoneStats)) {
  fallback[zone] = {
    x: z.xs.reduce((a, b) => a + b, 0) / z.xs.length,
    y: z.ys.reduce((a, b) => a + b, 0) / z.ys.length,
    scale: median(z.scales),
  };
}

// ---- 构建数组 ----
const arr = [];
let rootIdx = -1;

function v3(x, y, z = 0) { return { __type__: 'cc.Vec3', x, y, z }; }
const QUAT = () => ({ __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 });
const EULER = () => ({ __type__: 'cc.Vec3', x: 0, y: 0, z: 0 });

let fidSeq = 0;
const nextFid = (hint) => `fid_${hint}_${fidSeq++}`;

/**
 * 加一个节点（含组件与 PrefabInfo）。
 * 输出顺序与 Creator 一致：node → (comp, CompPrefabInfo)×N → PrefabInfo
 */
function addNode({ name, parentIdx, lpos, lscale, comps }) {
  const nodeIdx = arr.length; arr.push(null);
  const compIdxList = [];
  const compInfoIdxList = [];
  for (const c of comps) {
    const ci = arr.length; arr.push(null);
    const infoI = arr.length;
    arr.push({ __type__: 'cc.CompPrefabInfo', fileId: nextFid('c') });
    compIdxList.push(ci); compInfoIdxList.push(infoI);
  }
  const pInfoIdx = arr.length;
  arr.push({
    __type__: 'cc.PrefabInfo',
    root: { __id__: rootIdx },
    asset: { __id__: 0 },
    fileId: nextFid('n'),
    instance: null,
    targetOverrides: null,
    nestedPrefabInstanceRoots: null,
  });

  arr[nodeIdx] = {
    __type__: 'cc.Node',
    _name: name,
    _objFlags: 0,
    __editorExtras__: {},
    _parent: parentIdx === null ? null : { __id__: parentIdx },
    _children: [],
    _active: true,
    _components: compIdxList.map(i => ({ __id__: i })),
    _prefab: { __id__: pInfoIdx },
    _lpos: lpos,
    _lrot: QUAT(),
    _lscale: lscale,
    _mobility: 0,
    _layer: 33554432,
    _euler: EULER(),
    _id: '',
  };

  comps.forEach((c, k) => {
    const ci = compIdxList[k];
    arr[ci] = c.build(nodeIdx, { __id__: compInfoIdxList[k] });
  });

  return nodeIdx;
}

function uit(w, h, ax, ay) {
  return {
    build: (nodeIdx, prefabRef) => ({
      __type__: 'cc.UITransform',
      _name: '', _objFlags: 0, __editorExtras__: {},
      node: { __id__: nodeIdx },
      _enabled: true,
      __prefab: prefabRef,
      _contentSize: { __type__: 'cc.Size', width: w, height: h },
      _anchorPoint: { __type__: 'cc.Vec2', x: ax, y: ay },
      _id: '',
    }),
  };
}

function sprite(uuid) {
  return {
    build: (nodeIdx, prefabRef) => ({
      __type__: 'cc.Sprite',
      _name: '', _objFlags: 0, __editorExtras__: {},
      node: { __id__: nodeIdx },
      _enabled: true,
      __prefab: prefabRef,
      _customMaterial: null,
      _srcBlendFactor: 2,
      _dstBlendFactor: 4,
      _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
      _spriteFrame: { __uuid__: uuid, __expectedType__: 'cc.SpriteFrame' },
      _type: 0,
      _fillType: 0,
      _sizeMode: 0,
      _fillCenter: { __type__: 'cc.Vec2', x: 0, y: 0 },
      _fillStart: 0,
      _fillRange: 0,
      _isTrimmedMode: false,
      _useGrayscale: false,
      _atlas: null,
      _id: '',
    }),
  };
}

// 0: cc.Prefab 占位，1: 根
arr.push(null);
rootIdx = 1;

const rootNodeIdx = addNode({
  name: 'PfZooHomeYard',
  parentIdx: null,
  lpos: v3(-W / 2, -H / 2, 0),
  lscale: v3(1, 1, 1),
  comps: [uit(W, H, 0, 0)],
});
if (rootNodeIdx !== rootIdx) throw new Error('根节点索引错位');

arr[0] = {
  __type__: 'cc.Prefab',
  _name: 'PfZooHomeYard',
  _objFlags: 0,
  __editorExtras__: {},
  _native: '',
  data: { __id__: rootIdx },
  optimizationPolicy: 0,
  persistent: false,
  nestedPrefabInstanceRoots: null,
};

// 层节点
const layerIdx = {};
for (const name of scenery.layers) {
  layerIdx[name] = addNode({
    name,
    parentIdx: rootIdx,
    lpos: v3(0, 0, 0),
    lscale: v3(1, 1, 1),
    comps: [uit(W, H, 0, 0)],
  });
  arr[rootIdx]._children.push({ __id__: layerIdx[name] });
}

// 园景件，按 order 排序保证绘制顺序与现有画面一致
const sorted = [...scenery.pieces].sort((a, b) => a.order - b.order);
const todoList = [];

for (const p of sorted) {
  const uuid = spriteUuid(p.file);
  if (!uuid) throw new Error('缺 spriteFrame: ' + p.file);

  const isTodo = !p.place || !p.cocos;
  const fb = fallback[p.zone] || { x: 0, y: 0, scale: 1 };
  const x = p.cocos ? p.cocos.x : fb.x;
  const y = p.cocos ? p.cocos.y : fb.y;
  const sc = p.cocos ? p.cocos.scale : fb.scale;

  const base = p.id.replace(/\//g, '_');
  const name = isTodo ? base + TODO : base;

  const idx = addNode({
    name,
    parentIdx: layerIdx[p.layer],
    lpos: v3(x, y, 0),
    lscale: v3(sc, sc, 1),
    comps: [
      uit(p.png ? p.png[0] : 100, p.png ? p.png[1] : 100, p.anchor[0], p.anchor[1]),
      sprite(uuid),
    ],
  });
  arr[layerIdx[p.layer]]._children.push({ __id__: idx });

  if (isTodo) {
    todoList.push({
      name, zone: p.zone, layer: p.layer,
      queue: p.queueIndex ?? '-',
      x, y, scale: sc,
      reason: p.inQueue ? '缺脚点/缩放，需在编辑器摆位' : '区域地面，缺范围',
    });
  }
}

fs.writeFileSync(
  path.join(root, 'assets/game/bundles/ZooHome/PfZooHomeYard.prefab'),
  JSON.stringify(arr, null, 2) + '\n',
  'utf8',
);

// ---- 报告 ----
console.log('数组长度:', arr.length);
console.log('节点:', arr.filter(o => o && o.__type__ === 'cc.Node').length, '(应为 1根 + 6层 + 88件 = 95)');
console.log('UITransform:', arr.filter(o => o && o.__type__ === 'cc.UITransform').length, '(应 95)');
console.log('Sprite:', arr.filter(o => o && o.__type__ === 'cc.Sprite').length, '(应 88)');
console.log('CompPrefabInfo:', arr.filter(o => o && o.__type__ === 'cc.CompPrefabInfo').length, '(应 95 + 88 = 183)');
console.log('PrefabInfo:', arr.filter(o => o && o.__type__ === 'cc.PrefabInfo').length, '(应 95)');

console.log('\n需要你调整的节点（名字带 ' + TODO + '）：共', todoList.length);
for (const t of todoList) {
  console.log(`  ${t.name.padEnd(34)} queue=${String(t.queue).padStart(2)}  ${t.zone}/${t.layer}  ${t.reason}`);
}

fs.writeFileSync(path.join(root, 'del/todo-nodes.json'), JSON.stringify(todoList, null, 2), 'utf8');
