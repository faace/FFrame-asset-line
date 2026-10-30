from PIL import Image
import numpy as np
import os, sys

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
OUT = r'D:\creator\FFrame-zoo\del'

master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
print('母图', master.size)

def find_template(tpl_path, scales, label):
    tpl_img = Image.open(tpl_path).convert('RGB')
    best = None
    for s in scales:
        w = max(8, int(round(tpl_img.width * s)))
        h = max(8, int(round(tpl_img.height * s)))
        if w >= M.shape[1] or h >= M.shape[0]:
            continue
        t = np.asarray(tpl_img.resize((w, h), Image.LANCZOS), dtype=np.float32)
        th, tw, _ = t.shape
        # 用灰度做 NCC，滑动窗口
        tg = t.mean(axis=2)
        tg0 = tg - tg.mean()
        denom_t = np.sqrt((tg0 ** 2).sum())
        if denom_t < 1e-6:
            continue
        best_local = (-2, None)
        step = max(1, th // 40)
        for y in range(0, M.shape[0] - th + 1, step):
            for x in range(0, M.shape[1] - tw + 1, step):
                win = M[y:y+th, x:x+tw].mean(axis=2)
                w0 = win - win.mean()
                d = np.sqrt((w0 ** 2).sum())
                if d < 1e-6:
                    continue
                score = float((w0 * tg0).sum() / (d * denom_t))
                if score > best_local[0]:
                    best_local = (score, (x, y, w, h, s))
        if best is None or best_local[0] > best[0]:
            best = (best_local[0], best_local[1])
    print(f'{label}: score={best[0]:.4f} box={best[1]}')
    return best

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'ref'
    if which == 'ref':
        for f in ['_ref_v06.png']:
            p = os.path.join(r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets', f)
            find_template(p, [0.5, 0.4, 0.6, 0.35, 0.45], f)
