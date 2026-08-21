from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'

# Extend the existing hand/pixel-style campus scene vertically without resampling it.
src = Image.open(PUBLIC / '913789bf-3de1-4658-aace-282b8a6dc90b.jpg').convert('RGB')
w, h = src.size
new_h = 860
top = new_h - h
canvas = Image.new('RGB', (w, new_h), '#369CDD')
d = ImageDraw.Draw(canvas)
d.rectangle((0, 0, w, 31), fill='#389EDA')
d.rectangle((0, 32, w, 63), fill='#3A9FDC')
d.rectangle((0, 64, w, top - 1), fill='#3B9FDD')
canvas.paste(src, (0, top))
for y in range(top - 8, top):
    src_y = (y - (top - 8)) % 8
    canvas.paste(src.crop((0, src_y, w, src_y + 1)), (0, y))
canvas.save(PUBLIC / 'campus-reference-pixel.png', optimize=True)

# Small deterministic pixel tree mark used by the top-left lockup.
ui = PUBLIC / 'ui'
ui.mkdir(parents=True, exist_ok=True)
logo = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
d = ImageDraw.Draw(logo)
for rect, color in [
    ((14, 18, 17, 29), '#6B351B'),
    ((11, 26, 20, 29), '#5B2C17'),
    ((13, 16, 18, 22), '#7E4828'),
]:
    d.rectangle(rect, fill=color)
for rect in [(9, 15, 15, 18), (17, 14, 22, 17), (7, 13, 11, 16), (21, 12, 24, 15)]:
    d.rectangle(rect, fill='#6B351B')
for rect, color in [
    ((7, 7, 24, 16), '#014421'),
    ((5, 9, 11, 16), '#0C5C2E'),
    ((11, 5, 20, 12), '#0C5C2E'),
    ((18, 8, 27, 15), '#0C5C2E'),
    ((8, 6, 13, 10), '#2E7D42'),
    ((14, 3, 19, 8), '#3B914C'),
    ((20, 7, 25, 11), '#2E7D42'),
    ((10, 10, 16, 14), '#4AA35A'),
]:
    d.rectangle(rect, fill=color)
d.rectangle((27, 23, 28, 26), fill='#F5B335')
d.rectangle((25, 24, 30, 25), fill='#F5B335')
logo.save(ui / 'tree-logo.png')

print('built', PUBLIC / 'campus-reference-pixel.png')
print('built', ui / 'tree-logo.png')
