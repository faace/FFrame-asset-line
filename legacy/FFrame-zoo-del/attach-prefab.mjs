import fs from 'fs';

const scenePath = 'assets/game/bundles/ZooHome/ScZooHome.scene';
const prefabMetaPath = 'assets/game/bundles/ZooHome/PfZooHomeYard.prefab.meta';

const scene = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
const prefabUuid = JSON.parse(fs.readFileSync(prefabMetaPath, 'utf8')).uuid;

const canvasIdx = scene.findIndex(o => o && o.__type__ === 'cc.Node' && o._name === 'Canvas');
if (canvasIdx < 0) throw new Error('找不到 Canvas');

if (scene.some(o => o && o.__type__ === 'cc.Node' && o._name === 'PfZooHomeYard')) {
  console.log('已存在，跳过');
  process.exit(0);
}

// 按 Creator 3.x 预制体实例格式：
//   Node(_prefab -> PrefabInfo{asset, instance -> 预实例数据})
//   + cc.PrefabInstance 组件承载 targetOverrides
const base = scene.length;
const nodeIdx = base;
const uitIdx = base + 1;
const uitInfoIdx = base + 2;
const prefabInfoIdx = base + 3;
const prefabCompIdx = base + 4;
const prefabCompInfoIdx = base + 5;
const instIdx = base + 6;

scene.push(null, null, null, null, null, null, null);

// 组件：UITransform + cc.PrefabInstance
scene[uitIdx] = {
  __type__: 'cc.UITransform',
  _name: '',
  _objFlags: 0,
  __editorExtras__: {},
  node: { __id__: nodeIdx },
  _enabled: true,
  __prefab: { __id__: uitInfoIdx },
  _contentSize: { __type__: 'cc.Size', width: 720, height: 1280 },
  _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
  _id: 'pfYardUit',
};
scene[uitInfoIdx] = { __type__: 'cc.CompPrefabInfo', fileId: 'pfYardUitC' };

scene[prefabCompIdx] = {
  __type__: 'cc.PrefabInstance',
  _name: '',
  _objFlags: 0,
  __editorExtras__: {},
  node: { __id__: nodeIdx },
  _enabled: true,
  __prefab: { __id__: prefabCompInfoIdx },
  _id: 'pfYardInst',
};
scene[prefabCompInfoIdx] = { __type__: 'cc.CompPrefabInfo', fileId: 'pfYardInstC' };

// 预实例数据：asset 指向 prefab，fileId 与预制体内根节点一致
scene[instIdx] = {
  __type__: 'cc.PrefabInstance',
  fileId: 'pfYardRootFileId',
  prefabRootNode: { __id__: nodeIdx },
  mountedChildren: [],
  mountedComponents: [],
  propertyOverrides: [],
  removedComponents: [],
  localID: ['pfYardRootFileId'],
};

scene[prefabInfoIdx] = {
  __type__: 'cc.PrefabInfo',
  root: { __id__: nodeIdx },
  asset: { __uuid__: prefabUuid, __expectedType__: 'cc.Prefab' },
  fileId: 'pfYardRootFileId',
  instance: { __id__: instIdx },
  targetOverrides: null,
  nestedPrefabInstanceRoots: null,
};

scene[nodeIdx] = {
  __type__: 'cc.Node',
  _name: 'PfZooHomeYard',
  _objFlags: 0,
  __editorExtras__: {},
  _parent: { __id__: canvasIdx },
  _children: [],
  _active: true,
  _components: [{ __id__: uitIdx }, { __id__: prefabCompIdx }],
  _prefab: { __id__: prefabInfoIdx },
  _lpos: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
  _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
  _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
  _mobility: 0,
  _layer: 33554432,
  _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
  _id: 'pfYardNode',
};

// 放在 ScZooHome 之前，保证园景在底层
scene[canvasIdx]._children.unshift({ __id__: nodeIdx });

fs.writeFileSync(scenePath, JSON.stringify(scene, null, 2) + '\n', 'utf8');
console.log('已挂入场景，节点索引', nodeIdx);
console.log('Canvas 子节点顺序:', scene[canvasIdx]._children.map(c => scene[c.__id__]._name));
console.log('prefab uuid:', prefabUuid);
