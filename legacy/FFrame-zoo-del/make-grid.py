from PIL import Image, ImageDraw

master = Image.open(r'D:\creator\FFrame-zoo\资源生成\母图.v06.png').convert('RGBA')

def grid(box, name, step=50):
    x0, y0, x1, y1 = box
    crop = master.crop(box)
    # 放大 2 倍便于看清
    s = 2
    crop = crop.resize((crop.width * s, crop.height * s), Image.NEAREST)
    d = ImageDraw.Draw(crop)
    # 竖线
    x = (x0 // step + 1) * step
    while x < x1:
        px = (x - x0) * s
        d.line([(px, 0), (px, crop.height)], fill=(255, 0, 255, 255), width=1)
        d.text((px + 2, 2), str(x), fill=(255, 0, 255, 255))
        x += step
    y = (y0 // step + 1) * step
    while y < y1:
        py = (y - y0) * s
        d.line([(0, py), (crop.width, py)], fill=(255, 0, 255, 255), width=1)
        d.text((2, py + 1), str(y), fill=(255, 0, 255, 255))
        y += step
    out = rf'D:\creator\FFrame-zoo\del\{name}'
    crop.save(out)
    print(out, crop.size)

grid((950, 1680, 1300, 2000), 'grid-flamingo.png')
grid((150, 1620, 560, 2060), 'grid-petvillage.png')
