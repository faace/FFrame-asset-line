# -*- coding: utf-8 -*-
"""用 ref_sign.png 在火烈鸟区的 _ref_v06.png 里定位，确认标牌在母图的坐标。"""
from PIL import Image
import numpy as np

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
A = np.asarray(master, dtype=np.float32)
Ag = A.mean(axis=2)

def find(tpl_path, region, name):
    x0, y0, x1, y1 = region
    sub = Ag[y0:y1, x0:x1]
    t = Image.open(tpl_path).convert('RGB')
    # 去掉全透明边
    t_full = Image.open(tpl_path).convert('RGBA')
    ta = np.asarray(t_full)[:, :, 3]
    ys, xs = np.nonzero(ta > 8)
    t = t.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    tw, th = t.size
    tg = np.asarray(t, dtype=np.float32).mean(axis=2)
    tg0 = tg - tg.mean()
    dt = np.sqrt((tg0 ** 2).sum())
    if th > sub.shape[0] or tw > sub.shape[1]:
        print(name, '模板过大'); return None
    best = (-2, None)
    for yy in range(0, sub.shape[0] - th + 1):
        for xx in range(0, sub.shape[1] - tw + 1):
            win = sub[yy:yy + th, xx:xx + tw]
            w0 = win - win.mean()
            d = np.sqrt((w0 ** 2).sum())
            if d < 1e-6: continue
            s = float((w0 * tg0).sum() / (d * dt))
            if s > best[0]:
                best = (s, (x0 + xx, y0 + yy))
    print(f'{name}: 尺寸{tw}x{th} score={best[0]:.4f} 母图左上={best[1]} 底边中点≈({best[1][0]+tw/2:.0f},{best[1][1]+th})')
    return best

find(r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets\ref_sign.png',
     (880, 1880, 1120, 2060), '火烈鸟标牌')
