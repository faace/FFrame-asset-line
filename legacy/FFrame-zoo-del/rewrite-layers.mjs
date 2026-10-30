import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';

// 弹窗名 → 标题
const LAYERS = {
    LyTaskDetail: '任务详情',
    LyEnergy: '体力',
    LyCooldown: '恢复中',
    LyBubble: '气泡',
    LyShop: '商店',
    LyBag: '背包',
    LyReward: '待领奖励',
    LySignIn: '签到',
    LyAdReward: '广告累计奖励',
    LySetting: '设置',
};

for (const [name, title] of Object.entries(LAYERS)) {
    const ts = path.join(dir, name + '.ts');
    const content = `import { _decorator } from 'cc';
import { ZooLayer } from './ZooLayer';

const { ccclass } = _decorator;

/** ${title}。内容挂 this.body；顶栏（标题条 + 关闭钮）由 ZooLayer 统一建 */
@ccclass('${name}')
export class ${name} extends ZooLayer {
    protected onLayerInit(): void {
        this.setTitle('${title}');
    }
}
`;
    fs.writeFileSync(ts, content, 'utf8');

    // 若 ts.meta 不存在则补
    if (!fs.existsSync(ts + '.meta')) {
        fs.writeFileSync(ts + '.meta', JSON.stringify({
            ver: '4.0.24',
            importer: 'typescript',
            imported: true,
            uuid: crypto.randomUUID(),
            files: [],
            subMetas: {},
            userData: {},
        }, null, 2) + '\n', 'utf8');
    }
    console.log('✓', name, '→', title);
}
