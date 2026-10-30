# -*- coding: utf-8 -*-
"""校验：用已知 foot 的件，反推 png 应落在母图的哪个位置，再与实际像素比相似度。"""
from PIL import Image
import numpy as np, os, sys

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
Mg = M.mean(axis=2)

KNOWN = [
    ('Flamingo/flamingo_top_01',   (1125, 1742)),
    ('Flamingo/flamingo_right_01', (1219, 1800)),
    ('Flamingo/flamingo_left_01',  (1001, 1858)),
    ('Flamingo/flamingo_low_01',   (1050, 1955)),
    ('PetVillage/rabbit_01',       (206, 1728)),
    ('PetVillage/lamp_01',         (504, 1624)),
]

def predict(png_path, foot, scale, content):
    """按 content 与 foot 反推 png 左上角在母图的坐标，返回 png 覆盖矩形的整数边界。"""
    img = Image.open(png_path)
    W, H = img.size
    cl, ct, cr, cb = content
    cx = (cl + cr) / 2.0          # 不透明区中心 x（png 像素）
    left = foot[0] - cx * scale
    top = foot[1] - cb * scale
    right = left + W * scale
    bottom = top + H * scale
    return img, (left, top, right, bottom)

def compare(png_path, box, scale):
    img = Image.open(png_path).convert('RGBA')
    w = int(round(img.width * scale))
    h = int(round(img.height * scale))
    t = np.asarray(img.resize((w, h), Image.LANCZOS), dtype=np.float32)
    tg = t[:, :, :3].mean(axis=2)
    mask = t[:, :, 3] > 128
    if mask.sum() < 50:
        return None
    x0, y0 = int(round(box[0])), int(round(box[1]))
    if x0 < 0 or y0 < 0 or y0 + h > Mg.shape[0] or x0 + w > Mg.shape[1]:
        return None
    win = Mg[y0:y0+h, x0:x0+w]
    tv = tg[mask]; wv = win[mask]
    tv0 = tv - tv.mean(); wv0 = wv - wv.mean()
    dt = np.sqrt((tv0**2).sum()); d = np.sqrt((wv0**2).sum())
    if dt < 1e-6 or d < 1e-6:
        return None
    return float((wv0*tv0).sum()/(d*dt))

# 从 scenery.json 取 scale 与 content
import json
j = json.load(open(r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\scenery.json', encoding='utf-8'))
byId = {p['id']: p for p in j['pieces']}

print('=== 已知坐标件：按公式预测位置并比对相似度 ===')
for rel, foot in KNOWN:
    p = byId.get(rel)
    if not p:
        print('缺记录', rel); continue
    png = os.path.join(RES, rel.replace('/', os.sep) + '.png')
    if not os.path.exists(png):
        print('缺图', rel); continue
    scale = p['scale']
    content = p['content']
    _, box = predict(png, foot, scale, content)
    sc = compare(png, box, scale)
    print(f'{rel:30s} foot={foot} scale={scale:.3f} 预测框=({box[0]:.0f},{box[1]:.0f}) 相似度={sc if sc is None else round(sc,4)}')
