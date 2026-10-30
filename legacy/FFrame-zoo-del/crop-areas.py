from PIL import Image
import os

master = Image.open(r'D:\creator\FFrame-zoo\资源生成\母图.v06.png').convert('RGBA')
print('母图尺寸', master.size)

out = r'D:\creator\FFrame-zoo\del'
os.makedirs(out, exist_ok=True)

# 火烈鸟区：其他火烈鸟件 foot 集中在 x 1000-1220, y 1740-1960
crop = master.crop((880, 1620, 1400, 2060))
crop.save(os.path.join(out, 'crop-flamingo.png'))
print('火烈鸟裁图', crop.size)

# 小动物村区：其他件 foot x 200-505, y 1620-2020
crop2 = master.crop((100, 1580, 620, 2100))
crop2.save(os.path.join(out, 'crop-petvillage.png'))
print('小动物村裁图', crop2.size)
