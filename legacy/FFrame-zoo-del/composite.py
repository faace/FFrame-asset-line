from PIL import Image
import json, os

RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
scenery = json.load(open(r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\scenery.json', encoding='utf-8'))

# cocos 画布 720x1280，y 向上。转成左上原点图像坐标：imgY = 1280 - cocosY
canvas = Image.new('RGBA', (720, 1280), (240, 224, 176, 255))

# 只合成火烈鸟区 + 小动物村，按 order 从小到大画（order 就是绘制顺序）
pieces = [p for p in scenery['pieces'] if p.get('cocos') and p['zone'] in ('火烈鸟', '小动物村')]
pieces.sort(key=lambda p: p['order'])

for p in pieces:
    f = os.path.join(os.path.dirname(RES), p['file'].replace('/', os.sep))
    if not os.path.exists(f):
        print('缺图', f); continue
    im = Image.open(f).convert('RGBA')
    w, h = im.size
    s = p['cocos']['scale']
    nw, nh = max(1, int(round(w * s))), max(1, int(round(h * s)))
    im = im.resize((nw, nh), Image.LANCZOS)

    ax, ay = p['anchor']
    # 节点在 cocos 的位置；图片锚点落在该点
    cx = p['cocos']['x']
    cy = p['cocos']['y']
    # 左上角（cocos 坐标）
    left = cx - nw * ax
    bottom = cy - nh * ay
    # 转图像坐标（左上原点）
    top_img = 1280 - (bottom + nh)
    canvas.alpha_composite(im, (int(round(left)), int(round(top_img))))

# 裁出这两块区域（cocos y 向上，图像 y 向下：imgY = 1280 - cocosY）
crop = canvas.crop((40, 700, 720, 1130))
crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
crop.save(r'D:\creator\FFrame-zoo\del\composite.png')
print('saved', crop.size)
