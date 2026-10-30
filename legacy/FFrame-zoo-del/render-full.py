from PIL import Image
import json, os

RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
BASE = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome'
scenery = json.load(open(os.path.join(BASE, 'scenery.json'), encoding='utf-8'))

canvas = Image.new('RGBA', (720, 1280), (240, 224, 176, 255))
pieces = [p for p in scenery['pieces'] if p.get('cocos')]
pieces.sort(key=lambda p: p['order'])

for p in pieces:
    f = os.path.join(BASE, p['file'].replace('/', os.sep))
    if not os.path.exists(f):
        print('缺图', f); continue
    im = Image.open(f).convert('RGBA')
    w, h = im.size
    s = p['cocos']['scale']
    nw, nh = max(1, int(round(w * s))), max(1, int(round(h * s)))
    im = im.resize((nw, nh), Image.LANCZOS)
    ax, ay = p['anchor']
    left = p['cocos']['x'] - nw * ax
    bottom = p['cocos']['y'] - nh * ay
    canvas.alpha_composite(im, (int(round(left)), int(round(1280 - bottom - nh))))

out = r'D:\creator\FFrame-zoo\del\full-yard.png'
canvas.convert('RGB').save(out, quality=92)
print('saved', out, canvas.size)
