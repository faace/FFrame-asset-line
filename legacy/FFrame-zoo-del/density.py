from PIL import Image
import numpy as np, json, os

BASE = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome'
scenery = json.load(open(os.path.join(BASE, 'scenery.json'), encoding='utf-8'))

W, H = 720, 1280
# 只叠加非背景件，看"元素密度"
pieces = [p for p in scenery['pieces'] if p.get('cocos') and p['layer'] != 'background']
alpha = np.zeros((H, W), dtype=np.float32)

for p in pieces:
    f = os.path.join(BASE, p['file'].replace('/', os.sep))
    if not os.path.exists(f):
        continue
    im = Image.open(f).convert('RGBA')
    w, h = im.size
    s = p['cocos']['scale']
    nw, nh = max(1, int(round(w * s))), max(1, int(round(h * s)))
    im = im.resize((nw, nh), Image.LANCZOS)
    ax, ay = p['anchor']
    left = int(round(p['cocos']['x'] - nw * ax))
    top = int(round(H - (p['cocos']['y'] - nh * ay + nh)))
    a = np.asarray(im)[:, :, 3].astype(np.float32) / 255.0
    x0, y0 = max(0, left), max(0, top)
    x1, y1 = min(W, left + nw), min(H, top + nh)
    if x1 <= x0 or y1 <= y0:
        continue
    sub = a[y0 - top:y1 - top, x0 - left:x1 - left]
    alpha[y0:y1, x0:x1] = np.maximum(alpha[y0:y1, x0:x1], sub)

print('非背景元素覆盖密度（8 列 × 16 行）:')
print('        ' + ''.join(f'{int(c*W/8):>8}' for c in range(8)))
rows, cols = 16, 8
for r in range(rows):
    y0 = int(r * H / rows); y1 = int((r + 1) * H / rows)
    line = f'y{y0:>4}  '
    for c in range(cols):
        x0 = int(c * W / cols); x1 = int((c + 1) * W / cols)
        pct = alpha[y0:y1, x0:x1].mean() * 100
        line += f'{pct:>7.0f}%'
    print(line)

print('\n最空的三行（元素面积占比最低）:')
scores = []
for r in range(rows):
    y0 = int(r * H / rows); y1 = int((r + 1) * H / rows)
    scores.append((alpha[y0:y1, :].mean() * 100, y0, y1))
for pct, y0, y1 in sorted(scores)[:5]:
    print(f'  y {y0:>4}-{y1:>4}  {pct:.1f}%')
