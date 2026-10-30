from PIL import Image
import numpy as np
import os

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
H, W, _ = M.shape
print('母图', master.size)

def locate(ref_path):
    ref = Image.open(ref_path).convert('RGB')
    # 直接按 1:1 在原图里找（ref 是从母图裁出来的）
    t = np.asarray(ref, dtype=np.float32)
    th, tw, _ = t.shape
    if th > H or tw > W:
        print('ref 比母图大'); return None
    tg = t.mean(axis=2); tg0 = tg - tg.mean()
    denom_t = np.sqrt((tg0**2).sum())
    best = (-2, None)
    for y in range(0, H - th + 1):
        for x in range(0, W - tw + 1):
            win = M[y:y+th, x:x+tw].mean(axis=2)
            w0 = win - win.mean()
            d = np.sqrt((w0**2).sum())
            if d < 1e-6: continue
            s = float((w0*tg0).sum()/(d*denom_t))
            if s > best[0]:
                best = (s, (x, y))
                if s > 0.999:
                    print(f'  早停 score={s:.6f} at {best[1]}')
                    return best
    return best

for p, name in [
    (r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets\_ref_v06.png', '火烈鸟 ref'),
    (r'D:\creator\FFrame-zoo\资源生成\小动物村\v2-按尺子\source_sheets\_ref_v06.png', '小动物村 ref'),
]:
    r = locate(p)
    print(name, '->', r)
