# -*- coding: utf-8 -*-
"""按颜色特征定位道具：
- 蓝色家具（伞/桌/椅）
- 黑色路灯
- 木色牌子/长椅
"""
from PIL import Image
import numpy as np
from scipy import ndimage

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
A = np.asarray(master, dtype=np.int16)
R, G, B = A[:, :, 0], A[:, :, 1], A[:, :, 2]

# 蓝色：B 明显高于 R
blue = (B > 120) & (B - R > 50) & (G < 190) & (B > G)
# 黑色/深色：全低
dark = (R < 90) & (G < 90) & (B < 90)

def clusters(mask, box, name, min_area=120):
    x0, y0, x1, y1 = box
    sub = np.zeros_like(mask)
    sub[y0:y1, x0:x1] = mask[y0:y1, x0:x1]
    lab, n = ndimage.label(sub)
    print(f'\n--- {name} 连通域 {n} ---')
    objs = ndimage.find_objects(lab)
    sizes = ndimage.sum(sub, lab, range(1, n + 1))
    rows = []
    for i, sl in enumerate(objs):
        if sl is None or sizes[i] < min_area:
            continue
        h = sl[0].stop - sl[0].start
        w = sl[1].stop - sl[1].start
        rows.append((int(sizes[i]), sl[1].start, sl[0].start, sl[1].stop, sl[0].stop, w, h))
    rows.sort(key=lambda r: -r[0])
    for area, ax0, ay0, ax1, ay1, w, h in rows[:25]:
        cxb = (ax0 + ax1) / 2
        print(f'  area={area:6d}  box=({ax0:4d},{ay0:4d})-({ax1:4d},{ay1:4d})  {w:3d}x{h:3d}  脚点≈({cxb:.0f},{ay1})')
    return rows

# 火烈鸟区整体
FL = (860, 1480, 1400, 2100)
print('======== 火烈鸟区 蓝色 ========')
clusters(blue, FL, '蓝色家具')
print('\n======== 火烈鸟区 深色（路灯）========')
clusters(dark, (1140, 1640, 1340, 1900), '深色路灯', min_area=60)
