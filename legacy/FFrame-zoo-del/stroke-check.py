from PIL import Image
import json, os

RES = r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\res'
scenery = json.load(open(r'D:\creator\FFrame-zoo\assets\game\bundles\ZooHome\scenery.json', encoding='utf-8'))

print('=== 各件 scale 与 png 尺寸的关系 ===')
print('（png 是按母图像素画的 → 正常 scale 应该接近 0.5）\n')
rows = []
for p in scenery['pieces']:
    if p['zone'] != '火烈鸟' or not p.get('cocos'):
        continue
    w, h = p['png']
    s = p['cocos']['scale']
    disp_w, disp_h = w * s, h * s
    rows.append((s, p['id'], w, h, disp_w, disp_h))
rows.sort()
for s, pid, w, h, dw, dh in rows:
    flag = ''
    if s < 0.3:
        flag = '  ← png 画得过大，缩到 1/' + str(round(0.5 / s)) + ' 才放得下'
    print(f'  {pid.replace("Flamingo/",""):<20} png={w}x{h}  scale={s:<7} 显示={dw:.0f}x{dh:.0f}{flag}')

# 把火烈鸟区按实际渲染合成，放大看描边
canvas = Image.new('RGBA', (720, 1280), (240, 224, 176, 255))
pieces = [p for p in scenery['pieces'] if p.get('cocos') and p['zone'] == '火烈鸟']
pieces.sort(key=lambda p: p['order'])
for p in pieces:
    f = os.path.join(os.path.dirname(RES), p['file'].replace('/', os.sep))
    im = Image.open(f).convert('RGBA')
    w, h = im.size
    s = p['cocos']['scale']
    nw, nh = max(1, int(round(w * s))), max(1, int(round(h * s)))
    im = im.resize((nw, nh), Image.LANCZOS)
    ax, ay = p['anchor']
    left = p['cocos']['x'] - nw * ax
    bottom = p['cocos']['y'] - nh * ay
    canvas.alpha_composite(im, (int(round(left)), int(round(1280 - bottom - nh))))

# 火烈鸟区在 cocos 的 x 430-700, y 180-540  → 图像 y = 1280-540 .. 1280-180
crop = canvas.crop((425, 735, 700, 1105))
crop = crop.resize((crop.width * 4, crop.height * 4), Image.NEAREST)
crop.save(r'D:\creator\FFrame-zoo\del\flamingo-zoom.png')
print('\n放大图 saved', crop.size)
