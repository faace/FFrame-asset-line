from PIL import Image
import os

# 现有素材 vs 新生成的测试图，并排对比
base = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
existing = Image.open(os.path.join(base, 'PetVillage', 'sign_01.png')).convert('RGBA')
gen = Image.open(r'C:\Users\admin\.cursor\projects\d-creator-FFrame-zoo\assets\test-sign.jpg').convert('RGBA')

print('现有牌子尺寸:', existing.size)
print('生成图尺寸:', gen.size)

# 裁掉生成图的粉色背景，取中心物件
import numpy as np
a = np.asarray(gen)
rgb = a[:, :, :3].astype(int)
# 品红: R高 B高 G低
magenta = (rgb[:, :, 0] > 180) & (rgb[:, :, 2] > 120) & (rgb[:, :, 1] < 120)
ys, xs = np.nonzero(~magenta)
if len(ys):
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    print('生成图物件框:', box, '尺寸', (box[2]-box[0], box[3]-box[1]))
    crop = gen.crop(box)
else:
    crop = gen

# 统一高度对比
H = 240
def fit(im, h):
    w = int(im.width * h / im.height)
    return im.resize((w, h), Image.LANCZOS)

a1 = fit(existing, H)
a2 = fit(crop, H)

pad = 30
out = Image.new('RGBA', (a1.width + a2.width + pad * 3, H + pad * 2 + 30), (245, 245, 245, 255))
out.alpha_composite(a1, (pad, pad + 30))
out.alpha_composite(a2, (pad * 2 + a1.width, pad + 30))

from PIL import ImageDraw, ImageFont
d = ImageDraw.Draw(out)
try:
    font = ImageFont.truetype('C:/Windows/Fonts/msyh.ttc', 20)
except Exception:
    font = ImageFont.load_default()
d.text((pad, 6), '现有素材 sign_01.png', font=font, fill=(0, 0, 0, 255))
d.text((pad * 2 + a1.width, 6), '新生成 test-sign', font=font, fill=(0, 0, 0, 255))

out.convert('RGB').save(r'D:\creator\FFrame-zoo\del\style-compare.png')
print('saved del/style-compare.png')
