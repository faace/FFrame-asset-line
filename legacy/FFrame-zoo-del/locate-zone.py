# -*- coding: utf-8 -*-
"""把各区的 _ref_v06 参照图在母图里精确定位（1:1），确定区域偏移。"""
from PIL import Image
import numpy as np
import os, sys

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
MH, MW, _ = M.shape
Mg = M.mean(axis=2)

REFS = [
    ('火烈鸟', r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets\_ref_v06.png'),
    ('小动物村', r'D:\creator\FFrame-zoo\资源生成\小动物村\v2-按尺子\source_sheets\_ref_v06.png'),
]


def match1to1(path):
    ref = Image.open(path).convert('RGB')
    t = np.asarray(ref, dtype=np.float32).mean(axis=2)
    th, tw = t.shape
    tg0 = t - t.mean()
    dt = np.sqrt((tg0 ** 2).sum())

    # 粗搜
    best = (-2, None)
    for y in range(0, MH - th + 1, 8):
        for x in range(0, MW - tw + 1, 8):
            win = Mg[y:y + th, x:x + tw]
            w0 = win - win.mean()
            d = np.sqrt((w0 ** 2).sum())
            if d < 1e-6: continue
            s = float((w0 * tg0).sum() / (d * dt))
            if s > best[0]:
                best = (s, (x, y))
    # 精修 ±8
    bx, by = best[1]
    for y in range(max(0, by - 8), min(MH - th, by + 8) + 1):
        for x in range(max(0, bx - 8), min(MW - tw, bx + 8) + 1):
            win = Mg[y:y + th, x:x + tw]
            w0 = win - win.mean()
            d = np.sqrt((w0 ** 2).sum())
            if d < 1e-6: continue
            s = float((w0 * tg0).sum() / (d * dt))
            if s > best[0]:
                best = (s, (x, y))
    return best, (tw, th)


for name, p in REFS:
    if not os.path.exists(p):
        print('缺', p); continue
    (sc, pos), (tw, th) = match1to1(p)
    print(f'{name}: ref {tw}x{th}  score={sc:.5f}  母图左上=({pos[0]},{pos[1]}) 右下=({pos[0]+tw},{pos[1]+th})')
