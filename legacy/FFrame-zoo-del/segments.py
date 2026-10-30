# -*- coding: utf-8 -*-
"""在火烈鸟区/小动物村区提取物件候选：用边缘+连通域，输出每个候选的包围盒。
目的：为缺脚点的 9 件找母图上的实际位置，供人工确认。
"""
from PIL import Image
import numpy as np
from scipy import ndimage

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
A = np.asarray(master, dtype=np.int16)


def dump_region(box, name):
    x0, y0, x1, y1 = box
    print(f'\n===== {name}  ({x0},{y0})-({x1},{y1}) =====')

    # 局部颜色方差图：道具与地面颜色不同，边缘处方差大
    sub = A[y0:y1, x0:x1].astype(np.float32)
    g = sub.mean(axis=2)
    gx = np.abs(np.diff(g, axis=1))
    gy = np.abs(np.diff(g, axis=0))
    edges = np.zeros_like(g)
    edges[:, :-1] += gx
    edges[:-1, :] += gy
    m = edges > 22
    print('边缘像素占比: %.2f%%' % (m.mean() * 100))

    # 连通域
    padded = ndimage.binary_dilation(m, iterations=1)
    lab, n = ndimage.label(padded)
    print('连通域数:', n)
    sizes = ndimage.sum(padded, lab, range(1, n + 1))
    objs = ndimage.find_objects(lab)
    rows = []
    for i, sl in enumerate(objs):
        if sl is None: continue
        if sizes[i] < 260: continue
        h = sl[0].stop - sl[0].start
        w = sl[1].stop - sl[1].start
        if h < 12 or w < 10: continue
        rows.append({
            'x0': sl[1].start + x0, 'y0': sl[0].start + y0,
            'x1': sl[1].stop + x0, 'y1': sl[0].stop + y0,
            'w': w, 'h': h,
            'cx': (sl[1].start + sl[1].stop) / 2 + x0,
            'cx_bottom': ((sl[1].start + sl[1].stop) / 2 + x0, sl[0].stop + y0),
            'area': int(sizes[i]),
        })
    rows.sort(key=lambda r: -r['area'])
    print(f'候选 {len(rows)} 个（按面积降序，前 40）:')
    for r in rows[:40]:
        print(f"  box=({r['x0']:4d},{r['y0']:4d})-({r['x1']:4d},{r['y1']:4d})  "
              f"{r['w']:3d}x{r['h']:3d}  脚点≈({r['cx_bottom'][0]:.0f},{r['cx_bottom'][1]:d})  area={r['area']}")
    return rows


dump_region((880, 1830, 1300, 2080), '火烈鸟 下部道具（牌子/伞/桌/椅/长椅）')
dump_region((1150, 1650, 1330, 1830), '火烈鸟 上部（路灯/岸石）')
dump_region((240, 1960, 430, 2080), '小动物村 水盆')
