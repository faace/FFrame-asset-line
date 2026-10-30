# -*- coding: utf-8 -*-
"""用 alpha 遮罩做模板匹配：只比对不透明像素，在指定区域里找贴纸位置。"""
from PIL import Image
import numpy as np
import os, sys, json

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'

master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
Mg = M.mean(axis=2)

# 区域在母图里的精确范围（已用 1:1 匹配确认 score=1.0）
ZONES = {
    'Flamingo': (860, 1480, 1400, 2200),
    'PetVillage': (100, 1470, 660, 2060),
}


def masked_search(png_path, zone, scales, step=1, topk=2):
    x0, y0, x1, y1 = zone
    sub = Mg[y0:y1, x0:x1]
    img = Image.open(png_path).convert('RGBA')
    arr = np.asarray(img, dtype=np.float32)
    alpha = arr[:, :, 3]

    results = []
    for s in scales:
        w = int(round(img.width * s))
        h = int(round(img.height * s))
        if w < 8 or h < 8 or w > sub.shape[1] or h > sub.shape[0]:
            continue
        t_img = img.resize((w, h), Image.LANCZOS)
        t_arr = np.asarray(t_img, dtype=np.float32)
        t_gray = t_arr[:, :, :3].mean(axis=2)
        mask = t_arr[:, :, 3] > 128
        n = int(mask.sum())
        if n < 100:
            continue
        tv = t_gray[mask]
        tv0 = tv - tv.mean()
        dt = np.sqrt((tv0 ** 2).sum())
        if dt < 1e-6:
            continue

        best = (-2.0, None)
        # 只在遮罩覆盖的包围盒范围内滑动
        for yy in range(0, sub.shape[0] - h + 1, step):
            for xx in range(0, sub.shape[1] - w + 1, step):
                win = sub[yy:yy + h, xx:xx + w]
                wv = win[mask]
                wv0 = wv - wv.mean()
                d = np.sqrt((wv0 ** 2).sum())
                if d < 1e-6:
                    continue
                score = float((wv0 * tv0).sum() / (d * dt))
                if score > best[0]:
                    best = (score, (x0 + xx, y0 + yy, w, h, s))
        if best[1]:
            results.append((best[0], best[1], (w, h, s, n)))
    results.sort(key=lambda r: -r[0])
    return results[:topk]


TARGETS = [
    ('Flamingo', 'Flamingo/umbrella_01'),
    ('Flamingo', 'Flamingo/table_01'),
    ('Flamingo', 'Flamingo/chair_left_01'),
    ('Flamingo', 'Flamingo/chair_right_01'),
    ('Flamingo', 'Flamingo/bench_01'),
    ('Flamingo', 'Flamingo/lamp_01'),
    ('Flamingo', 'Flamingo/shore_rock_01'),
    ('Flamingo', 'Flamingo/flamingo_sign_01'),
    ('PetVillage', 'PetVillage/basin_01'),
]

SCALES = [1.0, 0.95, 1.05, 0.9, 1.1, 0.85, 1.15, 1.2, 0.8]

if __name__ == '__main__':
    only = sys.argv[1] if len(sys.argv) > 1 else None
    out = {}
    for zone, rel in TARGETS:
        if only and only not in rel:
            continue
        p = os.path.join(RES, rel.replace('/', os.sep) + '.png')
        if not os.path.exists(p):
            print('缺图', p); continue
        r = masked_search(p, ZONES[zone], SCALES, step=1, topk=2)
        print('\n=== ' + rel + ' ===')
        for sc, info, extra in r:
            print(f'  score={sc:.4f} box=({info[0]},{info[1]}) size={info[2]}x{info[3]} scale={info[4]}')
        if r:
            out[rel] = r[0][1]
    if out:
        fp = r'D:\creator\FFrame-zoo\del\mask-match.json'
        prev = {}
        if os.path.exists(fp):
            prev = json.load(open(fp, encoding='utf-8'))
        prev.update({k: list(v) for k, v in out.items()})
        json.dump(prev, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
