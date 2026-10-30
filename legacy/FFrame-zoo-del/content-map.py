from PIL import Image
import numpy as np, json, os

BASE = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome'
scenery = json.load(open(os.path.join(BASE, 'scenery.json'), encoding='utf-8'))

W, H = 720, 1280
canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
pieces = [p for p in scenery['pieces'] if p.get('cocos')]
pieces.sort(key=lambda p: p['order'])
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
    left = p['cocos']['x'] - nw * ax
    bottom = p['cocos']['y'] - nh * ay
    canvas.alpha_composite(im, (int(round(left)), int(round(H - bottom - nh))))

a = np.asarray(canvas)[:, :, 3]
print('画布内容分布（按 8x8 网格统计不透明像素占比，图像坐标 y 向下）:')
print('       ' + ''.join(f'{int(i*720/8):>9}' for i in range(8)))
rows = 16
for r in range(rows):
    y0 = int(r * H / rows); y1 = int((r + 1) * H / rows)
    line = f'y{y0:>4} '
    for c in range(8):
        x0 = int(c * W / 8); x1 = int((c + 1) * W / 8)
        blk = a[y0:y1, x0:x1]
        pct = (blk > 8).mean() * 100
        line += f'{pct:>8.0f}%'
    print(line)

# 找最空的行带
print('\n各水平带内容占比:')
for r in range(rows):
    y0 = int(r * H / rows); y1 = int((r + 1) / rows * H)
    blk = a[y0:y1, :]
    print(f'  y {y0:>4}-{y1:>4}  {((blk > 8).mean()*100):>5.1f}%')
