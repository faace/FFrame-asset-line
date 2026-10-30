# -*- coding: utf-8 -*-
"""检验 foot 是否真的对应母图上物件位置：在 foot 附近找粉红色（火烈鸟）。"""
from PIL import Image
import numpy as np

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
A = np.asarray(master, dtype=np.int16)
R, G, B = A[:, :, 0], A[:, :, 1], A[:, :, 2]

# 粉红：R 高，G/B 中低
pink = (R > 180) & (G > 80) & (G < 190) & (B > 90) & (B < 200) & (R - G > 60)

KNOWN = [
    ('flamingo_top',   (1125, 1742)),
    ('flamingo_right', (1219, 1800)),
    ('flamingo_left',  (1001, 1858)),
    ('flamingo_low',   (1050, 1955)),
]

print('=== foot 附近 80 像素内是否有粉色像素 ===')
for name, (fx, fy) in KNOWN:
    r = 80
    sub = pink[max(0,fy-r):fy+r, max(0,fx-r):fx+r]
    n = int(sub.sum())
    ys, xs = np.nonzero(sub)
    if n:
        cy = ys.mean() + max(0,fy-r)
        cx = xs.mean() + max(0,fx-r)
        print(f'{name:16s} foot=({fx},{fy})  粉色像素={n:5d}  粉色重心=({cx:.0f},{cy:.0f})  偏差=({cx-fx:+.0f},{cy-fy:+.0f})')
    else:
        print(f'{name:16s} foot=({fx},{fy})  粉色像素=0  ← 附近没有火烈鸟')

print()
print('=== 全图粉色像素的聚落（找 4 只火烈鸟真实位置）===')
# 只在火烈鸟区找
x0, y0, x1, y1 = 860, 1480, 1400, 2200
sub = pink[y0:y1, x0:x1]
ys, xs = np.nonzero(sub)
print('区内粉色像素总数:', len(ys))
if len(ys):
    print('x 范围:', xs.min()+x0, '-', xs.max()+x0)
    print('y 范围:', ys.min()+y0, '-', ys.max()+y0)
    # 按 y 分行统计，找聚类
    hist, edges = np.histogram(ys, bins=30)
    print('\ny 直方图（每 24 像素一层）:')
    for i, h in enumerate(hist):
        yy = y0 + edges[i]
        bar = '#' * min(60, h // 5)
        print(f'  y={yy:4d}  {h:5d} {bar}')
