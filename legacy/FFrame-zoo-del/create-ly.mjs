#!/usr/bin/env node
/**
 * 生成 Ly* 预制体默认结构：根（脚本 + UITransform + 标题 + 关闭钮）+ 空 panel。
 * mask 不进 prefab，由 GMLayer 运行时克隆。
 *
 * 用法：node tools/create-ly-prefab.mjs <目录> Ly名字 [标题]
 * 例：node tools/create-ly-prefab.mjs assets/game/bundles/ZooHome LySetting 设置
 *
 * 与 FFrame 同名工具的区别：那个只生成「根 + 空 panel」，
 * 这个按本工程约定补上顶栏（PfGMTitle 嵌套 + 关闭钮），省掉每个弹窗手摆一遍。
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Creator 的脚本类型 id：uuid 压缩成 23 字符 */
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

const fileId = () => crypto.randomBytes(8).toString('base64url').slice(0, 11);

function relImportToGmajor(absDir) {
    const from = path.relative(absDir, path.join(ROOT, 'assets', 'gmajor')).replace(/\\/g, '/');
    return from.startsWith('.') ? from : './' + from;
}

const tsMeta = (uuid) => `{
  "ver": "4.0.24",
  "importer": "typescript",
  "imported": true,
  "uuid": "${uuid}",
  "files": [],
  "subMetas": {},
  "userData": {}
}
`;

const prefabMeta = (uuid, name) => `{
  "ver": "1.1.50",
  "importer": "prefab",
  "imported": true,
  "uuid": "${uuid}",
  "files": [
    ".json"
  ],
  "subMetas": {},
  "userData": {
    "syncNodeName": "${name}"
  }
}
`;

// 框架预制体 uuid
const PF_GM_TITLE = '74c34df9-f233-43c9-abec-7ca45db63ede';
const PF_GM_BTN = 'b8d4f2c1-5a3b-4e9f-8d22-7c6b9f3e5a81';

const vec3 = (x, y, z = 0) => `{ "__type__": "cc.Vec3", "x": ${x}, "y": ${y}, "z": ${z} }`;
const quat = '{ "__type__": "cc.Quat", "x": 0, "y": 0, "z": 0, "w": 1 }';

/** 嵌套预制体实例节点：Node + UITransform + PrefabInfo(asset=子预制体) */
function nestedPrefab({ name, parent, x, y, w, h }) {
    const nId = ++idSeq;
    const uitId = ++idSeq;
    const uitInfoId = ++idSeq;
    const pInfoId = ++idSeq;
    const instId = ++idSeq;
    const propId = ++idSeq;

    nodes.push({
        slot: nId,
        json: {
            __type__: 'cc.Node',
            _name: name,
            _objFlags: 0,
            __editorExtras__: {},
            _parent: { __id__: parent },
            _children: [],
            _active: true,
            _components: [{ __id__: uitId }],
            _prefab: { __id__: pInfoId },
            _lpos: { __type__: 'cc.Vec3', x, y, z: 0 },
            _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
            _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
            _mobility: 0,
            _layer: 33554432,
            _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
            _id: '',
        },
    });
    nodes.push({
        slot: uitId,
        json: {
            __type__: 'cc.UITransform',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: nId },
            _enabled: true,
            __prefab: { __id__: uitInfoId },
            _contentSize: { __type__: 'cc.Size', width: w, height: h },
            _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
            _id: '',
        },
    });
    nodes.push({ slot: uitInfoId, json: { __type__: 'cc.CompPrefabInfo', fileId: fileId() } });
    nodes.push({
        slot: pInfoId,
        json: {
            __type__: 'cc.PrefabInfo',
            root: { __id__: 1 },
            asset: { __uuid__: PF_GM_TITLE, __expectedType__: 'cc.Prefab' },
            fileId: 'pfGmTitleRoot',
            instance: { __id__: instId },
            targetOverrides: null,
            nestedPrefabInstanceRoots: null,
        },
    });
    nodes.push({
        slot: instId,
        json: {
            __type__: 'cc.PrefabInstance',
            fileId: 'pfGmTitleInst',
            prefabRootNode: { __id__: nId },
            mountedChildren: [],
            mountedComponents: [],
            propertyOverrides: [{ __id__: propId }],
            removedComponents: [],
        },
    });
    nodes.push({
        slot: propId,
        json: {
            __type__: 'CCPropertyOverrideInfo',
            targetInfo: { __id__: pInfoId },
            propertyPath: ['_contentSize'],
            value: { __type__: 'cc.Size', width: w, height: h },
        },
    });
    return nId;
}

const nodes = [];
let idSeq = 1; // 0 是 cc.Prefab

const dirArg = process.argv[2];
const name = process.argv[3];
const title = process.argv[4] ?? name.replace(/^Ly/, '');

if (!dirArg || !name) {
    console.error('用法: node tools/create-ly-prefab.mjs <目录> Ly名字 [标题]');
    process.exit(1);
}
if (!/^Ly[A-Z][A-Za-z0-9]*$/.test(name)) {
    console.error('名字必须是 Ly + 大驼峰，例如 LyShop');
    process.exit(1);
}

const absDir = path.resolve(ROOT, dirArg);
if (!fs.existsSync(absDir)) {
    console.error('目录不存在', absDir);
    process.exit(1);
}
const tsPath = path.join(absDir, name + '.ts');
const prefabPath = path.join(absDir, name + '.prefab');
if (fs.existsSync(tsPath) || fs.existsSync(prefabPath)) {
    console.error('已存在，未覆盖', name);
    process.exit(1);
}

// 预留 1=根，2=根UITransform，3=根脚本……先占前 10 个槽
idSeq = 10;
const rootId = 1;
const rootUitId = 2;
const rootTsId = 3;
const panelId = 11; idSeq = 11;
const panelUitId = 12; idSeq = 12;

// panel 下：标题、关闭钮
const titleId = nestedPrefab({ name: 'pfTitle', parent: panelId, x: 0, y: 0, w: 400, h: 85 });

const tsUuid = crypto.randomUUID();
const prefabUuid = crypto.randomUUID();
const scriptCid = compressUuid(tsUuid);
const importPath = relImportToGmajor(absDir);

const fileIds = {
    root: fileId(), rootUit: fileId(), rootTs: fileId(),
    panel: fileId(), panelUit: fileId(),
};

// 组装：固定头尾 + 动态节点
const head = [
    {
        __type__: 'cc.Prefab',
        _name: name,
        _objFlags: 0,
        __editorExtras__: {},
        _native: '',
        data: { __id__: 1 },
        optimizationPolicy: 0,
        persistent: false,
        nestedPrefabInstanceRoots: null,
    },
    {
        __type__: 'cc.Node',
        _name: name,
        _objFlags: 0,
        __editorExtras__: {},
        _parent: null,
        _children: [{ __id__: panelId }],
        _active: true,
        _components: [{ __id__: rootUitId }, { __id__: rootTsId }],
        _prefab: { __id__: 4 },
        _lpos: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
        _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
        _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
        _mobility: 0,
        _layer: 33554432,
        _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
        _id: '',
    },
    {
        __type__: 'cc.UITransform',
        _name: '',
        _objFlags: 0,
        __editorExtras__: {},
        node: { __id__: rootId },
        _enabled: true,
        __prefab: { __id__: 5 },
        _contentSize: { __type__: 'cc.Size', width: 100, height: 100 },
        _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
        _id: '',
    },
    {
        __type__: scriptCid,
        _name: '',
        _objFlags: 0,
        __editorExtras__: {},
        node: { __id__: rootId },
        _enabled: true,
        __prefab: { __id__: 6 },
        _id: '',
    },
    {
        __type__: 'cc.PrefabInfo',
        root: { __id__: rootId },
        asset: { __id__: 0 },
        fileId: fileIds.root,
        instance: null,
        targetOverrides: null,
        nestedPrefabInstanceRoots: null,
    },
    { __type__: 'cc.CompPrefabInfo', fileId: fileIds.rootUit },
    { __type__: 'cc.CompPrefabInfo', fileId: fileIds.rootTs },
    // 7、8、9 空着留给固定头长度对齐；Creator 不在意空洞，但 null 不合法，所以放占位
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    // 10
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    // 11 panel
    {
        __type__: 'cc.Node',
        _name: 'panel',
        _objFlags: 0,
        __editorExtras__: {},
        _parent: { __id__: rootId },
        _children: [{ __id__: titleId }],
        _active: true,
        _components: [{ __id__: panelUitId }],
        _prefab: { __id__: 13 },
        _lpos: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
        _lrot: { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 },
        _lscale: { __type__: 'cc.Vec3', x: 1, y: 1, z: 1 },
        _mobility: 0,
        _layer: 33554432,
        _euler: { __type__: 'cc.Vec3', x: 0, y: 0, z: 0 },
        _id: '',
    },
    // 12 panel UITransform
    {
        __type__: 'cc.UITransform',
        _name: '',
        _objFlags: 0,
        __editorExtras__: {},
        node: { __id__: panelId },
        _enabled: true,
        __prefab: { __id__: 14 },
        _contentSize: { __type__: 'cc.Size', width: 620, height: 800 },
        _anchorPoint: { __type__: 'cc.Vec2', x: 0.5, y: 0.5 },
        _id: '',
    },
    // 13 panel PrefabInfo
    {
        __type__: 'cc.PrefabInfo',
        root: { __id__: rootId },
        asset: { __id__: 0 },
        fileId: fileIds.panel,
        instance: null,
        targetOverrides: null,
        nestedPrefabInstanceRoots: null,
    },
    // 14 panel CompPrefabInfo
    { __type__: 'cc.CompPrefabInfo', fileId: fileIds.panelUit },
];

// 用节点片段补齐到对应索引（简化：直接按顺序拼，不用空洞）
const arr = [
    head[0], head[1], head[2], head[3], head[4], head[5], head[6],
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    { __type__: 'cc.CompPrefabInfo', fileId: fileId() },
    head[11], head[12], head[13], head[14],
];

// 追加标题等动态节点（父引用用 panelId=11）
for (const n of nodes) arr[n.slot] = n.json;
// 补空槽
for (let i = 0; i < arr.length; i++) if (!arr[i]) arr[i] = { __type__: 'cc.CompPrefabInfo', fileId: fileId() };

// 标题 y：panel 顶边往下 15（条身压顶边）
const titleNode = arr[titleId];
titleNode._lpos.y = 800 / 2 - 15;

fs.writeFileSync(tsPath, tsSource(name, importPath), 'utf8');
fs.writeFileSync(tsPath + '.meta', tsMeta(tsUuid), 'utf8');
fs.writeFileSync(prefabPath, JSON.stringify(arr, null, 2) + '\n', 'utf8');
fs.writeFileSync(prefabPath + '.meta', prefabMeta(prefabUuid, name), 'utf8');
console.info('[create-ly-prefab] 已生成', path.relative(ROOT, tsPath), '标题:', title);

function tsSource(name, importPath) {
    return `import { _decorator } from 'cc';
import { GMLayer } from '${importPath}';

const { ccclass } = _decorator;

/** Layer：内容挂 this.panel；mask 由基类克隆；标题为 panel 下的 pfTitle */
@ccclass('${name}')
export class ${name} extends GMLayer {
    onInit(): void {
        if (!this.panel) return;
    }
}
`;
}
