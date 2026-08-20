from PIL import Image
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
im=Image.open(ROOT/'assets/exports/sprites/campus_hero.png').convert('RGBA')
out=ROOT/'assets/source/libresprite/scripts/rebuild_campus_hero.js'
out.parent.mkdir(parents=True,exist_ok=True)
# Compact run-length encoding that reconstructs the exact authored pixels through LibreSprite's pixel API.
colors=[]; idx={}; runs=[]
for y in range(im.height):
    row=[]; x=0
    while x<im.width:
        c=im.getpixel((x,y))
        if c not in idx: idx[c]=len(colors); colors.append(c)
        ci=idx[c]
        x2=x+1
        while x2<im.width and im.getpixel((x2,y))==c: x2+=1
        row.append((x,x2-x,ci)); x=x2
    runs.append(row)
js=[]
js.append('// Generated for LibreSprite. Rebuilds the authored 640x360 campus composite with Image.putPixel().')
js.append('// The separated editable source layers remain in assets/source/libresprite/campus_day/.')
js.append(f"try {{ app.command.NewFile({{ width: {im.width}, height: {im.height}, colorMode: 'rgb' }}); }} catch (e) {{ console.log('Open/create a {im.width}x{im.height} RGBA sprite first: '+e); }}")
js.append('const img = app.activeImage; const pc = app.pixelColor;')
js.append(f"if (!img || img.width !== {im.width} || img.height !== {im.height}) throw new Error('Expected active {im.width}x{im.height} image');")
js.append('const C = '+json.dumps(colors)+';')
js.append('const R = '+json.dumps(runs,separators=(',',':'))+';')
js.append('for (let y=0; y<R.length; y++) { for (const run of R[y]) { const [x0,n,ci]=run; const c=C[ci]; const packed=pc.rgba(c[0],c[1],c[2],c[3]); for (let x=x0;x<x0+n;x++) img.putPixel(x,y,packed); } }')
js.append("console.log('Elbi campus day scene rebuilt pixel-by-pixel. Save as campus_day.libresprite.');")
out.write_text('\n'.join(js),encoding='utf-8')
print('wrote',out,'colors',len(colors),'chars',out.stat().st_size)
