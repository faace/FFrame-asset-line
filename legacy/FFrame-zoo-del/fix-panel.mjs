import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';
const names = ['LyTaskDetail', 'LyEnergy', 'LyCooldown', 'LyBubble', 'LyShop', 'LyBag', 'LyReward', 'LySignIn', 'LyAdReward', 'LySetting'];

const PANEL_W = 620;
const PANEL_H = 800;

// Skin 面板皮的 spriteFrame uuid（panel.png）
function spriteUuid(pngPath) {
    const meta = JSON.parse(fs.readFileSync(pngPath + '.meta', 'utf8'));
    for (const k of Object.keys(meta.subMetas || {})) {
        if (meta.subMetas[k].name === 'spriteFrame') return meta.subMetas[k].uuid;
    }
    return null;
}
const panelFrame = spriteUuid('assets/game/bundles/Skin/panel.png');
console.log('panel.png spriteFrame:', panelFrame);

for (const name of names) {
    const p = path.join(dir, name + '.prefab');
    const arr = JSON.parse(fs.readFileSync(p, 'utf8'));

    // 找 panel 节点与其 UITransform
    const panelIdx = arr.findIndex(o => o && o.__type__ === 'cc.Node' && o._name === 'panel');
    if (panelIdx < 0) { console.log('✗ 缺 panel', name); continue; }
    const panel = arr[panelIdx];
    const uitCompRef = panel._components[0];
    const uit = arr[uitCompRef.__id__];

    // 1. panel 尺寸
    uit._contentSize = { __type__: 'cc.Size', width: PANEL_W, height: PANEL_H };

    // 2. 给 panel 加 Sprite 底板（复用已有 UITransform）
    const hasSprite = panel._components.some(c => arr[c.__id__]?.__type__ === 'cc.Sprite');
    if (!hasSprite && panelFrame) {
        // 新增 Sprite + CompPrefabInfo（插到数组末尾，引用用新索引）
        const spriteIdx = arr.length;
        const spriteInfoIdx = arr.length + 1;
        arr.push(null, null);
        arr[spriteIdx] = {
            __type__: 'cc.Sprite',
            _name: '',
            _objFlags: 0,
            __editorExtras__: {},
            node: { __id__: panelIdx },
            _enabled: true,
            __prefab: { __id__: spriteInfoIdx },
            _customMaterial: null,
            _srcBlendFactor: 2,
            _dstBlendFactor: 4,
            _color: { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 },
            _spriteFrame: { __uuid__: panelFrame, __expectedType__: 'cc.SpriteFrame' },
            _type: 1, // SLICED
            _fillType: 0,
            _sizeMode: 0,
            _fillCenter: { __type__: 'cc.Vec2', x: 0, y: 0 },
            _fillStart: 0,
            _fillRange: 0,
            _isTrimmedMode: true,
            _useGrayscale: false,
            _atlas: null,
            _id: '',
        };
        arr[spriteInfoIdx] = { __type__: 'cc.CompPrefabInfo', fileId: crypto.randomBytes(8).toString('base64url').slice(0, 11) };
        panel._components.push({ __id__: spriteIdx });
    }

    fs.writeFileSync(p, JSON.stringify(arr, null, 2) + '\n', 'utf8');
    console.log(`✓ ${name}  panel ${PANEL_W}×${PANEL_H}${hasSprite ? '（已有底图）' : ' + 底板'}`);
}
