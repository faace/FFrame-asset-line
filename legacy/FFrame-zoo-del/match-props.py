# -*- coding: utf-8 -*-
"""在母图指定区域内，用切出来的 PNG 做多尺度模板匹配，估计物件位置。"""
from PIL import Image
import numpy as np
import sys, json, os

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'

master = Image.open(MASTER).convert('RGB')
M = np.asarray(master, dtype=np.float32)
MH, MW, _ = M.shape
Mg = M.mean(axis=2)
print('母图', master.size, file=sys.stderr)


def ncc_at(win, tg0, denom_t):
    w0 = win - win.mean()
    d = np.sqrt((w0 ** 2).sum())
    if d < 1e-6:
        return -2.0
    return float((w0 * tg0).sum() / (d * denom_t))


def search(png_path, box, scales, step=2, keep=3):
    """box=(x0,y0,x1,y1) 母图搜索范围。返回 top-keep 个候选。"""
    x0, y0, x1, y1 = box
    sub = Mg[y0:y1, x0:x1]
    tpl0 = Image.open(png_path).convert('RGB')
    results = []
    for s in scales:
        w = int(round(tpl0.width * s))
        h = int(round(tpl0.height * s))
        if w < 8 or h < 8 or w > sub.shape[1] or h > sub.shape[0]:
            continue
        t = np.asarray(tpl0.resize((w, h), Image.LANCZOS), dtype=np.float32).mean(axis=2)
        tg0 = t - t.mean()
        denom_t = np.sqrt((tg0 ** 2).sum())
        if denom_t < 1e-6:
            continue
        best = (-2.0, None)
        for yy in range(0, sub.shape[0] - h + 1, step):
            for xx in range(0, sub.shape[1] - w + 1, step):
                win = sub[yy:yy + h, xx:xx + w]
                sc = ncc_at(win, tg0, denom_t)
                if sc > best[0]:
                    best = (sc, (x0 + xx, y0 + yy, w, h, s))
        if best[1]:
            results.append(best)
    results.sort(key=lambda r: -r[0])
    return results[:keep]


TARGETS = [
    # 火烈鸟区：伞、桌、左右椅、长椅、路灯、岸石、牌子
    ('Flamingo/umbrella_01', (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/table_01',    (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/chair_left_01',  (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/chair_right_01', (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/bench_01',    (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/lamp_01',     (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
    ('Flamingo/shore_rock_01', (880, 1650, 1350, 2100), [0.6, 0.65, 0.7, 0.55]),
    ('Flamingo/flamingo_sign_01', (880, 1650, 1350, 2100), [0.85, 0.8, 0.9, 0.75]),
    # 小动物村：小水盆
    ('PetVillage/basin_01', (150, 1600, 600, 2100), [0.85, 0.8, 0.9, 0.75, 0.95]),
]

if __name__ == '__main__':
    out = {}
    for rel, box, scales in TARGETS:
        p = os.path.join(RES, rel.replace('/', os.sep) + '.png')
        if not os.path.exists(p):
            print('缺图', p); continue
        r = search(p, box, scales, step=2, keep=3)
        print('\n=== ' + rel + ' ===')
        for sc, info in r:
            print(f'  score={sc:.4f}  box={info}')
        if r:
            out[rel] = r[0]
    with open(r'D:\creator\FFrame-zoo\del\match-result.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
