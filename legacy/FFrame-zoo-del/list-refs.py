from PIL import Image
import os

base = r'D:\creator\FFrame-zoo\资源生成\火烈鸟\v2-按尺子\source_sheets'
for f in ['_ref_v06.png', '_ref_pool.png', 'sheet_prop.png', 'sheet_lamp.png', 'sheet_rock.png']:
    p = os.path.join(base, f)
    if os.path.exists(p):
        im = Image.open(p)
        print(f, im.size, im.mode)

# 小动物村
base2 = r'D:\creator\FFrame-zoo\资源生成\小动物村\v2-按尺子'
print('\n--- 小动物村 ---')
for root, dirs, files in os.walk(base2):
    for f in files:
        if f.endswith('.png') and ('ref' in f.lower() or 'sheet' in f.lower()):
            p = os.path.join(root, f)
            im = Image.open(p)
            print(os.path.relpath(p, base2), im.size, im.mode)
