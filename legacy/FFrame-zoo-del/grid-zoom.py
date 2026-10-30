# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

MASTER = r'D:\creator\FFrame-zoo\资源生成\母图.v06.png'
master = Image.open(MASTER).convert('RGB')

def grid(box, name, zoom=2, step=20):
    x0, y0, x1, y1 = box
    crop = master.crop(box)
    crop = crop.resize((crop.width * zoom, crop.height * zoom), Image.LANCZOS)
    d = ImageDraw.Draw(crop)
    try:
        font = ImageFont.truetype('arial.ttf', 14)
    except Exception:
        font = ImageFont.load_default()

    x = ((x0 + step - 1) // step) * step
    while x < x1:
        px = (x - x0) * zoom
        col = (255, 0, 255) if x % 100 == 0 else (255, 150, 255)
        d.line([(px, 0), (px, crop.height)], fill=col, width=1)
        if x % 100 == 0:
            d.text((px + 2, 2), str(x), fill=(200, 0, 200), font=font)
        x += step
    y = ((y0 + step - 1) // step) * step
    while y < y1:
        py = (y - y0) * zoom
        col = (255, 0, 255) if y % 100 == 0 else (255, 150, 255)
        d.line([(0, py), (crop.width, py)], fill=col, width=1)
        if y % 100 == 0:
            d.text((2, py + 1), str(y), fill=(200, 0, 200), font=font)
        y += step
    out = rf'D:\creator\FFrame-zoo\del\{name}'
    crop.save(out)
    print(out, crop.size)

# 火烈鸟下部：牌子、伞、桌椅、长椅
grid((880, 1830, 1300, 2080), 'g-flamingo-props.png', zoom=3, step=20)
# 火烈鸟上部：岸石、路灯
grid((1150, 1650, 1330, 1830), 'g-flamingo-upper.png', zoom=4, step=20)
# 小动物村水盆
grid((240, 1960, 420, 2080), 'g-basin.png', zoom=5, step=20)
