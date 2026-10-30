from PIL import Image, ImageDraw
import json, os

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
rects = json.load(open(r'D:\creator\FFrame-zoo\del\pieces-master-rect.json', encoding='utf-8'))

master = Image.open(MASTER).convert('RGB')
# 火烈鸟区
box = (820, 1380, 1400, 2160)
crop = master.crop(box).convert('RGBA')
d = ImageDraw.Draw(crop)

colors = {
    'ground': (255, 0, 255),
    'building': (0, 0, 255),
    'animal': (255, 128, 0),
    'prop': (0, 200, 0),
    'person': (255, 0, 0),
}

for r in rects:
    if r['zone'] != '火烈鸟':
        continue
    x0, y0, x1, y1 = r['master']
    c = colors.get(r['layer'], (128, 128, 128))
    d.rectangle([x0 - box[0], y0 - box[1], x1 - box[0], y1 - box[1]], outline=c, width=2)
    d.text((x0 - box[0] + 2, y0 - box[1] + 2), r['id'].split('/')[1][:16], fill=c)

crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
crop.save(r'D:\creator\FFrame-zoo\del\overlay-flamingo.png')
print('saved', crop.size)
