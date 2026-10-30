import fs from 'fs';
import path from 'path';

const root = process.cwd();
const scenery = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/scenery.json', 'utf8'));

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

const arr = [];
let rootIdx = -1;

const v3 = (x, y, z = 0) => ({ __type__: 'cc.Vec3', x, y, z });
const QUAT = () => ({ __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 });
const EULER = () => ({ __type__: 'cc.Vec3', x: 0, y: 0, z: 0 });

let fidSeq = 0;
const nextFid = (hint) => `fid_${hint}_${fidSeq++}`;

function addNode({ name, parentIdx, lpos, lscale, comps }) {
  const nodeIdx = arr.length; arr.push(null);
  const compIdxList = [];
  const compInfoIdxList = [];
  for (let i = 0; i < comps.length; i++) {
    compIdxList.push(arr.length); arr.push(null);
    compInfoIdxList.push(arr.length);
    arr.push({ __type__: 'cc.CompPrefabInfo', fileId: nextFid('c') });
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
    arr[compIdxList[k]] = c.build(nodeIdx, { __id__: compInfoIdxList[k] });
  });

  return nodeIdx;
}

const uit = (w, h, ax, ay) => ({
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
});

const sprite = (uuid) => ({
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
});

// 0 占位（cc.Prefab），1 根节点
arr.push(null);
rootIdx = 1;

const rootNodeIdx = addNode({
  name: 'PfZooHomeYard',
  parentIdx: null,
  lpos: v3(-W / 2, -H / 2, 0),
  lscale: v3(1, 1, 1),
  comps: [uit(W, H, 0, 0)],
});
if (rootNodeIdx !== rootIdx) throw new Error('根节点索引错位: ' + rootNodeIdx);

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

// 以 scenery.json 为准，按 order 排绘制顺序
const sorted = [...scenery.pieces].sort((a, b) => a.order - b.order);
let noCocos = [];

for (const p of sorted) {
  const uuid = spriteUuid(p.file);
  if (!uuid) throw new Error('缺 spriteFrame: ' + p.file);
  if (!p.cocos) { noCocos.push(p.id); continue; }

  const name = p.id.replace(/\//g, '_');
  const idx = addNode({
    name,
    parentIdx: layerIdx[p.layer],
    lpos: v3(p.cocos.x, p.cocos.y, 0),
    lscale: v3(p.cocos.scale, p.cocos.scale, 1),
    comps: [
      uit(p.png[0], p.png[1], p.anchor[0], p.anchor[1]),
      sprite(uuid),
    ],
  });
  arr[layerIdx[p.layer]]._children.push({ __id__: idx });
}

fs.writeFileSync(
  'assets/game/bundles/ZooHome/PfZooHomeYard.prefab',
  JSON.stringify(arr, null, 2) + '\n',
  'utf8',
);

console.log('节点:', arr.filter(o => o && o.__type__ === 'cc.Node').length);
console.log('Sprite:', arr.filter(o => o && o.__type__ === 'cc.Sprite').length);
console.log('带 __TODO 的节点:', arr.filter(o => o && o.__type__ === 'cc.Node' && /__TODO/.test(o._name)).length);
if (noCocos.length) console.log('无 cocos 未写入:', noCocos);
