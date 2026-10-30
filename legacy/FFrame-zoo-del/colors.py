# -*- coding: utf-8 -*-
"""在母图上直接找这些道具的脚点：
思路——道具都站在铺装地面/水面上，先按颜色分割出「物件轮廓」，
再用贴纸的宽高比和大致尺寸去筛，输出候选中心与底边。
"""
from PIL import Image
import numpy as np
import os, json

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')
A = np.asarray(master, dtype=np.int16)

# 火烈鸟区范围（1:1 匹配确认）
ZONE = (860, 1480, 1400, 2200)

def show_colors(box, name):
    x0, y0, x1, y1 = box
    sub = A[y0:y1, x0:x1]
    # 统计主要颜色
    flat = sub.reshape(-1, 3)
    # 量化到 16 级
    q = (flat // 16 * 16)
    uniq, counts = np.unique(q, axis=0, return_counts=True)
    order = np.argsort(-counts)[:15]
    print(f'--- {name} 主色 ---')
    for i in order:
        c = uniq[i]
        print(f'  RGB({c[0]:3d},{c[1]:3d},{c[2]:3d})  {counts[i]*100.0/len(flat):5.1f}%')

show_colors(ZONE, '火烈鸟区')
show_colors((240, 1960, 420, 2080), '小动物村水盆区')
