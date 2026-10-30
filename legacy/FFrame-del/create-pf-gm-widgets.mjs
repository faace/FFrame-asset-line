/**
 * 生成 PfGMSlider / PfGMBar / PfGMStepper 预制体，并嵌进 LySetting.panel。
 * 用法：node tools/temp/create-pf-gm-widgets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const UI = path.join(ROOT, 'assets/gmajor/ui');
const LAYER = 33554432;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const FONT = 'ee40121d-0b21-4bb3-b95c-fa7d2df322b4';
const WHITE = '7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca@f9941';
const SLIDER_TRACK = '1929048c-26c9-4e62-8ebb-4e611f126238@f9941';
const SLIDER_THUMB = '8d07ec81-2287-418b-ac3b-4a73da311637@f9941';
const BAR_BG = '0e53a6dd-c2a7-4b39-87de-13fc8517c40f@f9941';
const BAR_FILL = '16f21f42-a7a2-49b7-bef4-699b0a27fde0@f9941';
const PLATE = 'b3406ac1-ddfa-4265-88aa-68897d36fd53@f9941';
const PRIMARY = '075aa98d-9fff-42ff-8f75-29838e2f1f3b@f9941';
const SECONDARY = '52e1493a-81de-4f8f-898e-085c83bf35e4@f9941';
const ICON_MINUS = '04b21fc9-bef8-4f86-bb35-eb6f25cf9120@f9941';
const ICON_PLUS = '48fdb5f8-5e45-4263-937f-76e77e54051a@f9941';
const BTN_PREFAB = 'b8d4f2c1-5a3b-4e9f-8d22-7c6b9f3e5a81';

const ID = {
    sliderTs: 'c4a81e20-7b15-4f3a-9d62-1e8b0c5a7d31',
    barTs: 'd5b92f31-8c26-4a4b-ae73-2f9c1d6b8e42',
    stepperTs: 'e6c03a42-9d37-4b5c-bf84-3a0d2e7c9f53',
    sliderPf: 'f7d14b53-ae48-4c6d-8095-4b1e3f8d0a64',
    barPf: 'a8e25c64-bf59-4d7e-91a6-5c2f409e1b75',
    stepperPf: 'b9f36d75-c06a-4e8f-a2b7-6d3041af2c86',
};

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

const known = compressUuid('a7c3e1b0-4f2a-4d8e-9c11-6b5a8e2d4f70');
if (known !== 'a7c3eGwTypNjpwRa1qOLU9w') throw new Error('compressUuid 对不上 PfGMBtn');

function tsMeta(uuid) {
    return JSON.stringify({
        ver: '4.0.24',
        importer: 'typescript',
        imported: true,
        uuid,
        files: [],
        subMetas: {},
        userData: {},
    }, null, 2) + '\n';
}

function prefabMeta(uuid, name) {
    return JSON.stringify({
        ver: '1.1.50',
        importer: 'prefab',
        imported: true,
        uuid,
        files: ['.json'],
        subMetas: {},
        userData: { syncNodeName: name },
    }, null, 2) + '\n';
}

function vec3(x, y, z = 0) {
    return { __type__: 'cc.Vec3', x, y, z };
}

function quat() {
    return { __type__: 'cc.Quat', x: 0, y: 0, z: 0, w: 1 };
}

function size(width, height) {
    return { __type__: 'cc.Size', width, height };
}

function color(r, g, b, a = 255) {
    return { __type__: 'cc.Color', r, g, b, a };
}

function ref(id) {
    return { __id__: id };
}

class Bag {
    constructor() {
        this.arr = [];
    }

    add(obj) {
        this.arr.push(obj);
        return this.arr.length - 1;
    }
}

function baseNode(name, parent, children, components) {
    return {
        __type__: 'cc.Node',
        _name: name,
        _objFlags: 0,
        __editorExtras__: {},
        _parent: parent == null ? null : ref(parent),
        _children: children.map(ref),
        _active: true,
        _components: components.map(ref),
        _prefab: null,
        _lpos: vec3(0, 0, 0),
        _lrot: quat(),
        _lscale: vec3(1, 1, 1),
        _mobility: 0,
        _layer: LAYER,
        _euler: vec3(0, 0, 0),
        _id: '',
    };
}

function uit(node, w, h, ax = 0.5, ay = 0.5, fileId) {
    return [
        {
            __type__: 'cc.UITransform',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: ref(node),
            _enabled: true,
            __prefab: null,
            _contentSize: size(w, h),
            _anchorPoint: { __type__: 'cc.Vec2', x: ax, y: ay },
            _id: '',
        },
        { __type__: 'cc.CompPrefabInfo', fileId },
    ];
}

function sprite(node, frame, type, fileId, alpha = 255) {
    return [
        {
            __type__: 'cc.Sprite',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: ref(node),
            _enabled: true,
            __prefab: null,
            _customMaterial: null,
            _srcBlendFactor: 2,
            _dstBlendFactor: 4,
            _color: color(255, 255, 255, alpha),
            _spriteFrame: frame ? { __uuid__: frame, __expectedType__: 'cc.SpriteFrame' } : null,
            _type: type,
            _fillType: 0,
            _sizeMode: 0,
            _fillCenter: { __type__: 'cc.Vec2', x: 0, y: 0 },
            _fillStart: 0,
            _fillRange: 0,
            _isTrimmedMode: true,
            _useGrayscale: false,
            _atlas: null,
            _id: '',
        },
        { __type__: 'cc.CompPrefabInfo', fileId },
    ];
}

function linkPrefab(obj, infoId) {
    if (obj.__prefab === null) obj.__prefab = ref(infoId);
    if (obj._prefab === null) obj._prefab = ref(infoId);
}

function prefabAsset(name) {
    return {
        __type__: 'cc.Prefab',
        _name: name,
        _objFlags: 0,
        __editorExtras__: {},
        _native: '',
        data: ref(1),
        optimizationPolicy: 0,
        persistent: false,
        nestedPrefabInstanceRoots: null,
    };
}

function childNode(bag, name, parent, w, h, fileId, extras) {
    const id = bag.add(baseNode(name, parent, [], []));
    const comps = [];
    const [ut, utInfo] = uit(id, w, h, extras.ax ?? 0.5, extras.ay ?? 0.5, extras.uitFile);
    const utId = bag.add(ut);
    comps.push(utId);
    const utInfoId = bag.add(utInfo);
    linkPrefab(bag.arr[utId], utInfoId);
    if (extras.sprite) {
        const [sp, spInfo] = sprite(id, extras.sprite.frame, extras.sprite.type, extras.sprite.fileId, extras.sprite.alpha ?? 255);
        const spId = bag.add(sp);
        comps.push(spId);
        const spInfoId = bag.add(spInfo);
        linkPrefab(bag.arr[spId], spInfoId);
    }
    if (extras.label) {
        const labelId = bag.add(labelComp(id, extras.label));
        comps.push(labelId);
        const infoId = bag.add({ __type__: 'cc.CompPrefabInfo', fileId: extras.label.fileId });
        linkPrefab(bag.arr[labelId], infoId);
    }
    const infoId = bag.add({
        __type__: 'cc.PrefabInfo',
        root: ref(1),
        asset: ref(0),
        fileId,
        instance: null,
        targetOverrides: null,
        nestedPrefabInstanceRoots: null,
    });
    bag.arr[id]._components = comps.map(ref);
    bag.arr[id]._prefab = ref(infoId);
    if (extras.pos) bag.arr[id]._lpos = vec3(extras.pos[0], extras.pos[1], 0);
    return id;
}

function labelComp(node, spec) {
    return {
        __type__: 'cc.Label',
        _name: '',
        _objFlags: 0,
        __editorExtras__: {},
        node: ref(node),
        _enabled: true,
        __prefab: null,
        _customMaterial: null,
        _srcBlendFactor: 2,
        _dstBlendFactor: 4,
        _color: color(spec.r, spec.g, spec.b, 255),
        _string: spec.text,
        _horizontalAlign: 1,
        _verticalAlign: 1,
        _actualFontSize: spec.size,
        _fontSize: spec.size,
        _fontFamily: 'Arial',
        _lineHeight: spec.size,
        _overflow: 2,
        _enableWrapText: false,
        _font: { __uuid__: FONT, __expectedType__: 'cc.TTFFont' },
        _isSystemFontUsed: false,
        _spacingX: 0,
        _isItalic: false,
        _isBold: false,
        _isUnderline: false,
        _underlineHeight: 2,
        _cacheMode: 0,
        _enableOutline: false,
        _outlineColor: color(0, 0, 0, 255),
        _outlineWidth: 0,
        _enableShadow: false,
        _shadowColor: color(0, 0, 0, 255),
        _shadowOffset: { __type__: 'cc.Vec2', x: 2, y: 2 },
        _shadowBlur: 2,
        _id: '',
    };
}

function scriptComp(node, type, props, fileId) {
    return [
        {
            __type__: type,
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: ref(node),
            _enabled: true,
            __prefab: null,
            ...props,
            _id: '',
        },
        { __type__: 'cc.CompPrefabInfo', fileId },
    ];
}

function finishRoot(bag, nodeId, fileId, nested) {
    const infoId = bag.add({
        __type__: 'cc.PrefabInfo',
        root: ref(nodeId),
        asset: ref(0),
        fileId,
        instance: null,
        targetOverrides: null,
        nestedPrefabInstanceRoots: nested ? nested.map(ref) : null,
    });
    bag.arr[nodeId]._prefab = ref(infoId);
}

function widgetRoot(name, w, h, scriptType, props, scriptFile, children) {
    const bag = new Bag();
    bag.add(prefabAsset(name));
    const nodeId = bag.add(baseNode(name, null, [], []));
    const [ut, utInfo] = uit(nodeId, w, h, 0.5, 0.5, `${scriptFile}Uit`);
    const utId = bag.add(ut);
    const utInfoId = bag.add(utInfo);
    linkPrefab(bag.arr[utId], utInfoId);
    const comps = [utId];
    if (props.hit) {
        const [sp, spInfo] = sprite(nodeId, WHITE, 0, `${scriptFile}Hit`, 0);
        const spId = bag.add(sp);
        const spInfoId = bag.add(spInfo);
        linkPrefab(bag.arr[spId], spInfoId);
        comps.push(spId);
    }
    const [sc, scInfo] = scriptComp(nodeId, scriptType, props.fields, `${scriptFile}Ts`);
    const scId = bag.add(sc);
    const scInfoId = bag.add(scInfo);
    linkPrefab(bag.arr[scId], scInfoId);
    comps.push(scId);
    bag.arr[nodeId]._components = comps.map(ref);
    const childIds = children.map((c) => childNode(bag, c.name, nodeId, c.w, c.h, c.fileId, c));
    bag.arr[nodeId]._children = childIds.map(ref);
    return { bag, nodeId, childIds };
}

function writePrefab(name, uuid, arr) {
    const file = path.join(UI, `${name}.prefab`);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2) + '\n');
    fs.writeFileSync(`${file}.meta`, prefabMeta(uuid, name));
}

function slider() {
    const { bag, nodeId } = widgetRoot('PfGMSlider', 280, 44, compressUuid(ID.sliderTs), {
        hit: true,
        fields: { value: 0.5 },
    }, 'pfGmSlider', [
        { name: 'track', w: 280, h: 28, fileId: 'pfGmSliderTrack', sprite: { frame: SLIDER_TRACK, type: 1, fileId: 'pfGmSliderTrS' }, uitFile: 'pfGmSliderTrU' },
        { name: 'thumb', w: 44, h: 44, fileId: 'pfGmSliderThumb', sprite: { frame: SLIDER_THUMB, type: 0, fileId: 'pfGmSliderThS' }, uitFile: 'pfGmSliderThU' },
    ]);
    finishRoot(bag, nodeId, 'pfGmSliderRoot', null);
    writePrefab('PfGMSlider', ID.sliderPf, bag.arr);
}

function bar() {
    const { bag, nodeId } = widgetRoot('PfGMBar', 320, 64, compressUuid(ID.barTs), {
        fields: { value: 0.5 },
    }, 'pfGmBar', [
        { name: 'bg', w: 320, h: 64, fileId: 'pfGmBarBg', sprite: { frame: BAR_BG, type: 1, fileId: 'pfGmBarBgS' }, uitFile: 'pfGmBarBgU' },
        {
            name: 'fill', w: 148, h: 40, fileId: 'pfGmBarFill', ax: 0, ay: 0.5, pos: [-148, 0],
            sprite: { frame: BAR_FILL, type: 1, fileId: 'pfGmBarFiS' }, uitFile: 'pfGmBarFiU',
        },
    ]);
    finishRoot(bag, nodeId, 'pfGmBarRoot', null);
    writePrefab('PfGMBar', ID.barPf, bag.arr);
}

function override(bag, localId, prop, value) {
    const target = bag.add({ __type__: 'cc.TargetInfo', localID: [localId] });
    const info = bag.add({
        __type__: 'CCPropertyOverrideInfo',
        targetInfo: ref(target),
        propertyPath: [prop],
        value,
    });
    return info;
}

function nestedBtn(bag, parent, hostRoot, spec) {
    const nodeId = bag.add({
        __type__: 'cc.Node',
        _objFlags: 0,
        _parent: ref(parent),
        _prefab: null,
        __editorExtras__: {},
    });
    const overs = [];
    const add = (localId, prop, value) => overs.push(override(bag, localId, prop, value));
    add('pfGmBtnRoot', '_name', spec.name);
    add('pfGmBtnRoot', '_lpos', vec3(spec.x, 0, 0));
    add('pfGmBtnUit', '_contentSize', size(88, 88));
    add('pfGmBtnSp', '_spriteFrame', { __uuid__: spec.plate, __expectedType__: 'cc.SpriteFrame' });
    add('pfGmBtnTs', 'theme', spec.theme);
    add('pfGmBtnTs', 'style', 2);
    add('pfGmBtnTs', 'size', 0);
    add('pfGmBtnTs', 'text', '');
    add('pfGmBtnTs', 'icon', { __uuid__: spec.icon, __expectedType__: 'cc.SpriteFrame' });
    add('pfGmBtnIcS', '_spriteFrame', { __uuid__: spec.icon, __expectedType__: 'cc.SpriteFrame' });
    add('pfGmBtnIc', '_active', true);
    add('pfGmBtnLb', '_active', false);
    const instId = bag.add({
        __type__: 'cc.PrefabInstance',
        fileId: spec.inst,
        prefabRootNode: ref(hostRoot),
        mountedChildren: [],
        mountedComponents: [],
        propertyOverrides: overs.map(ref),
        removedComponents: [],
    });
    const infoId = bag.add({
        __type__: 'cc.PrefabInfo',
        root: ref(nodeId),
        asset: { __uuid__: BTN_PREFAB, __expectedType__: 'cc.Prefab' },
        fileId: 'pfGmBtnRoot',
        instance: ref(instId),
        targetOverrides: null,
    });
    bag.arr[nodeId]._prefab = ref(infoId);
    return nodeId;
}

function stepper() {
    const bag = new Bag();
    bag.add(prefabAsset('PfGMStepper'));
    const nodeId = bag.add(baseNode('PfGMStepper', null, [], []));
    const [ut, utInfo] = uit(nodeId, 348, 88, 0.5, 0.5, 'pfGmStepperUit');
    const utId = bag.add(ut);
    const utInfoId = bag.add(utInfo);
    linkPrefab(bag.arr[utId], utInfoId);
    const [sc, scInfo] = scriptComp(nodeId, compressUuid(ID.stepperTs), {
        value: 3, min: 0, max: 10, step: 1,
    }, 'pfGmStepperTs');
    const scId = bag.add(sc);
    const scInfoId = bag.add(scInfo);
    linkPrefab(bag.arr[scId], scInfoId);
    bag.arr[nodeId]._components = [utId, scId].map(ref);
    const plate = childNode(bag, 'plate', nodeId, 140, 72, 'pfGmStepperPlate', {
        uitFile: 'pfGmStepperPlU',
        sprite: { frame: PLATE, type: 1, fileId: 'pfGmStepperPlS' },
    });
    const label = childNode(bag, 'label', nodeId, 140, 72, 'pfGmStepperLb', {
        uitFile: 'pfGmStepperLbU',
        label: { text: '3', size: 28, r: 92, g: 64, b: 32, fileId: 'pfGmStepperLbC' },
    });
    const minus = nestedBtn(bag, nodeId, nodeId, {
        name: 'btnMinus', x: -130, theme: 1, plate: SECONDARY, icon: ICON_MINUS, inst: 'pfGmStepperMinus',
    });
    const plus = nestedBtn(bag, nodeId, nodeId, {
        name: 'btnPlus', x: 130, theme: 0, plate: PRIMARY, icon: ICON_PLUS, inst: 'pfGmStepperPlus',
    });
    bag.arr[nodeId]._children = [plate, label, minus, plus].map(ref);
    finishRoot(bag, nodeId, 'pfGmStepperRoot', [minus, plus]);
    writePrefab('PfGMStepper', ID.stepperPf, bag.arr);
}

function nestInLayer() {
    const file = path.join(ROOT, 'assets/game/bundles/Demo/DemoHome/LySetting.prefab');
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('sliderMusic')) {
        console.log('LySetting 已有滑条，跳过嵌套');
        return;
    }
    const arr = JSON.parse(text);
    const panel = arr.findIndex((o) => o && o._name === 'panel');
    const roots = arr.find((o) => o && Array.isArray(o.nestedPrefabInstanceRoots));
    if (panel < 0 || !roots) throw new Error('LySetting 找不到 panel');
    const bag = { arr, add(obj) { arr.push(obj); return arr.length - 1; } };
    const place = (asset, fileId, name, x, y) => {
        const nodeId = bag.add({
            __type__: 'cc.Node',
            _objFlags: 0,
            _parent: ref(panel),
            _prefab: null,
            __editorExtras__: {},
        });
        const overs = [
            override(bag, fileId, '_name', name),
            override(bag, fileId, '_lpos', vec3(x, y, 0)),
        ];
        const instId = bag.add({
            __type__: 'cc.PrefabInstance',
            fileId: `${name}Inst`,
            prefabRootNode: ref(1),
            mountedChildren: [],
            mountedComponents: [],
            propertyOverrides: overs.map(ref),
            removedComponents: [],
        });
        const infoId = bag.add({
            __type__: 'cc.PrefabInfo',
            root: ref(nodeId),
            asset: { __uuid__: asset, __expectedType__: 'cc.Prefab' },
            fileId,
            instance: ref(instId),
            targetOverrides: null,
        });
        arr[nodeId]._prefab = ref(infoId);
        arr[panel]._children.push(ref(nodeId));
        roots.nestedPrefabInstanceRoots.push(ref(nodeId));
    };
    place(ID.sliderPf, 'pfGmSliderRoot', 'sliderMusic', 40, 200);
    place(ID.sliderPf, 'pfGmSliderRoot', 'sliderSfx', 40, 110);
    place(ID.barPf, 'pfGmBarRoot', 'bar', 40, 16);
    place(ID.stepperPf, 'pfGmStepperRoot', 'stepper', 50, -170);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2) + '\n');
}

fs.writeFileSync(path.join(UI, 'PfGMSlider.ts.meta'), tsMeta(ID.sliderTs));
fs.writeFileSync(path.join(UI, 'PfGMBar.ts.meta'), tsMeta(ID.barTs));
fs.writeFileSync(path.join(UI, 'PfGMStepper.ts.meta'), tsMeta(ID.stepperTs));
slider();
bar();
stepper();
nestInLayer();
console.log('prefabs ok', compressUuid(ID.sliderTs), compressUuid(ID.barTs), compressUuid(ID.stepperTs));
