from PIL import Image, ImageDraw, ImageFont
import json, os

BASE = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome'
SKIN = r'D:\creator\FFrame-zoo\assets\game\bundles\Skin'
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

# 按钮
BTNS = [
    ('进入合成', 0, -550, 380, 120, (60, 140, 220)),
    ('小镇', -140, -430, 260, 88, (150, 150, 150)),
    ('建设', 140, -430, 260, 88, (60, 140, 220)),
    ('签到', -210, 560, 260, 88, (150, 150, 150)),
    ('广告累计', -210, 460, 260, 88, (230, 160, 40)),
    ('设置', -210, 360, 260, 88, (150, 150, 150)),
]
try:
    f30 = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 30)
    f26 = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 26)
except Exception:
    f30 = f26 = ImageFont.load_default()

for text, x, y, bw, bh, color in BTNS:
    cx, cy = to_img(x, y)
    l, t = cx - bw / 2, cy - bh / 2
    d.rounded_rectangle([l, t, l + bw, t + bh], radius=16, fill=color + (235,), outline=(30, 30, 30, 255), width=3)
    bb = d.textbbox((0, 0), text, font=f30)
    d.text((cx - (bb[2]-bb[0]) / 2, cy - (bb[3]-bb[1]) / 2 - 9), text, font=f30, fill=(255, 255, 255, 255))

# HUD 顶部
TOP_Y = 600
SIDE = 24
energy_icon = Image.open(os.path.join(SKIN, 'icon_energy.png')).convert('RGBA').resize((48, 48), Image.LANCZOS)
ex, ey = to_img(-360 + SIDE + 24, TOP_Y)
canvas.alpha_composite(energy_icon, (int(ex - 24), int(ey - 24)))
bx, by = to_img(-360 + SIDE + 56, TOP_Y)
d.text((bx, by - 18), '100/100', font=f30, fill=(255, 255, 255, 255), stroke_width=3, stroke_fill=(62, 40, 18, 255))
cx2, cy2 = to_img(20, TOP_Y)
bb = d.textbbox((0, 0), '0%  ·  0/86', font=f30)
d.text((cx2 - (bb[2]-bb[0])/2, cy2 - 18), '0%  ·  0/86', font=f30, fill=(255, 255, 255, 255), stroke_width=3, stroke_fill=(62, 40, 18, 255))

# 隐藏UI按钮
hx, hy = to_img(360 - SIDE - 44, TOP_Y)
d.rounded_rectangle([hx-44, hy-44, hx+44, hy+44], radius=16, fill=(150,150,150,235), outline=(30,30,30,255), width=3)
help_icon = Image.open(os.path.join(SKIN, 'icon_help.png')).convert('RGBA').resize((56, 56), Image.LANCZOS)
canvas.alpha_composite(help_icon, (int(hx-28), int(hy-28)))

# 底部素材
mx, my = to_img(140, -365)
bb = d.textbbox((0, 0), '素材 0', font=f26)
d.text((mx - (bb[2]-bb[0])/2, my - 15), '素材 0', font=f26, fill=(255,255,255,255), stroke_width=3, stroke_fill=(62,40,18,255))

canvas.convert('RGB').save(r'D:\creator\FFrame-zoo\del\home-hud.png')
print('saved')
