from PIL import Image, ImageDraw, ImageFont
import json, os

BASE = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome'
scenery = json.load(open(os.path.join(BASE, 'scenery.json'), encoding='utf-8'))
W, H = 720, 1280

canvas = Image.new('RGBA', (W, H), (240, 224, 176, 255))
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

d = ImageDraw.Draw(canvas, 'RGBA')

def to_img(x, y):
    return x + W / 2, H - (y + H / 2)

BTNS = [
    ('进入合成', 0, -550, 380, 120, (60, 140, 220)),
    ('小镇', -140, -430, 260, 88, (150, 150, 150)),
    ('建设', 140, -430, 260, 88, (60, 140, 220)),
    ('签到', -210, 560, 260, 88, (150, 150, 150)),
    ('广告累计', -210, 460, 260, 88, (230, 160, 40)),
    ('设置', -210, 360, 260, 88, (150, 150, 150)),
]

try:
    font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 30)
except Exception:
    font = ImageFont.load_default()

for text, x, y, bw, bh, color in BTNS:
    cx, cy = to_img(x, y)
    l, t = cx - bw / 2, cy - bh / 2
    d.rounded_rectangle([l, t, l + bw, t + bh], radius=16, fill=color + (235,), outline=(30, 30, 30, 255), width=3)
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text((cx - tw / 2, cy - th / 2 - 8), text, font=font, fill=(255, 255, 255, 255))

# 标出安全区（顶部 36px 供胶囊，底部 30px）
d.rectangle([0, 0, W, 36], outline=(255, 0, 0, 120), width=2)
canvas.convert('RGB').save(r'D:\creator\FFrame-zoo\del\home-layout.png')
print('saved')
