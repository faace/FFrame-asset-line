# -*- coding: utf-8 -*-
"""决定性验证：已知 foot 的件，在母图正确位置处的相似度上限是多少。
如果连正确位置都只有 0.1-0.3，说明贴纸与母图像素不可比，自动测量不可行。
同时试边缘特征，看是否比灰度更稳。
"""
from PIL import Image, ImageFilter
import numpy as np, os, json

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'

master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)

def edge_map(arr):
    g = arr.mean(axis=2) if arr.ndim == 3 else arr
    gx = np.abs(np.diff(g, axis=1, prepend=g[:, :1]))
    gy = np.abs(np.diff(g, axis=0, prepend=g[:1, :]))
    return gx + gy

E = edge_map(M)
Mg = M.mean(axis=2)

j = json.load(open(r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\scenery.json', encoding='utf-8'))
byId = {p['id']: p for p in j['pieces']}

KNOWN = ['Flamingo/flamingo_top_01', 'Flamingo/flamingo_right_01',
         'Flamingo/flamingo_left_01', 'Flamingo/flamingo_low_01',
         'PetVillage/rabbit_01', 'PetVillage/lamp_01']

def ncc(a, b, mask=None):
    if mask is not None:
        a = a[mask]; b = b[mask]
    a0 = a - a.mean(); b0 = b - b.mean()
    da = np.sqrt((a0 ** 2).sum()); db = np.sqrt((b0 ** 2).sum())
    if da < 1e-6 or db < 1e-6: return -2.0
    return float((a0 * b0).sum() / (da * db))

print('件                            灰度NCC   边缘NCC')
for rel in KNOWN:
    p = byId[rel]
    png = os.path.join(RES, rel.replace('/', os.sep) + '.png')
    img = Image.open(png).convert('RGBA')
    s = p['scale']
    w = int(round(img.width * s)); h = int(round(img.height * s))
    t = np.asarray(img.resize((w, h), Image.LANCZOS), dtype=np.float32)
    mask = t[:, :, 3] > 128

    cl, ct, cr, cb = p['content']
    cx = (cl + cr) / 2.0
    left = int(round(p['foot'][0] - cx * s))
    top = int(round(p['foot'][1] - cb * s))
    if left < 0 or top < 0 or top + h > M.shape[0] or left + w > M.shape[1]:
        print(f'{rel:30s} 越界'); continue

    win = M[top:top+h, left:left+w]
    winE = E[top:top+h, left:left+w]
    tE = edge_map(t)

    g_score = ncc(t[:, :, :3].mean(axis=2), win.mean(axis=2), mask)
    e_score = ncc(tE, winE, mask)
    print(f'{rel:30s} {g_score:8.4f}  {e_score:8.4f}')

print('\n说明：若正确位置处仍低于 0.5，说明贴纸与母图不是同一像素来源（AI 重画），')
print('      任何自动模板匹配都不可靠，脚点只能人工在母图上标。')
