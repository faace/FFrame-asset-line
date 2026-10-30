# -*- coding: utf-8 -*-
import os
from PIL import Image

base = r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets'
for f in sorted(os.listdir(base)):
    if f.startswith('ref_') or f.startswith('_ref'):
        p = os.path.join(base, f)
        im = Image.open(p)
        print(f, im.size, im.mode)

print('\n--- 小动物村 ---')
base2 = r'D:\creator\FFrame-zoo\资源生成\小动物村\v2-按尺子\source_sheets'
for f in sorted(os.listdir(base2)):
    if f.startswith('ref_') or f.startswith('_ref'):
        p = os.path.join(base2, f)
        im = Image.open(p)
        print(f, im.size, im.mode)
