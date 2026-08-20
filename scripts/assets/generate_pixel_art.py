from PIL import Image, ImageDraw
from pathlib import Path
import json, random

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets/source/libresprite/campus'
PROPS = ROOT / 'assets/source/libresprite/props'
EXPORTS = ROOT / 'assets/exports/sprites'
PALETTES = ROOT / 'assets/source/palettes'
for p in (SRC, PROPS, EXPORTS, PALETTES): p.mkdir(parents=True, exist_ok=True)

W,H=320,180
P = {
 'transparent': (0,0,0,0),
 'sky0':'#11192a','sky1':'#19243a','sky2':'#243552','cloud0':'#68768a','cloud1':'#8794a1',
 'mount0':'#182d2d','mount1':'#214039','mount2':'#2b5142',
 'leaf0':'#10251d','leaf1':'#173527','leaf2':'#225034','leaf3':'#387044','leaf4':'#578d50','leaf5':'#78a55b',
 'bark0':'#241a19','bark1':'#3b2821','bark2':'#5a3b29',
 'brick0':'#3a1a20','brick1':'#5a2528','brick2':'#75312f','brick3':'#93463c',
 'cream0':'#7f745e','cream1':'#b0a282','cream2':'#d6c59f','cream3':'#ead9b1',
 'roof0':'#1b1d27','roof1':'#292d39','roof2':'#424655',
 'glass0':'#243548','glass1':'#36506b','glass2':'#7b9cb0',
 'ground0':'#1a281f','ground1':'#253726','ground2':'#314932','path0':'#4a4840','path1':'#666157','path2':'#878071',
 'maroon':'#7b2837','gold':'#d9ab54','lamp':'#ffd97a','shadow':'#080b11','paper':'#edf1df',
 'rain':'#7da3ae','danger':'#c15c50'
}

def rgba(c, a=255):
    if isinstance(c, tuple): return c
    h=P.get(c,c).lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(a,)

def layer(name):
    return Image.new('RGBA',(W,H),(0,0,0,0))

def rect(d, xy, c): d.rectangle(xy, fill=rgba(c))
def poly(d, pts, c): d.polygon(pts, fill=rgba(c))

def cloud(d,x,y):
    rect(d,(x,y,x+25,y+3),'cloud0'); rect(d,(x+4,y-3,x+20,y+3),'cloud0'); rect(d,(x+9,y-6,x+16,y+2),'cloud1'); rect(d,(x+2,y+4,x+22,y+5),'sky2')

def tree(d,x,y,scale=1,variant=0):
    # chunky rain-tree silhouette, hand-placed rectangles at pixel scale
    trunk_w=3*scale
    rect(d,(x-trunk_w//2,y-22*scale,x+trunk_w//2,y),'bark0')
    rect(d,(x-trunk_w//2+1,y-20*scale,x+trunk_w//2+1,y),'bark1')
    # branches
    rect(d,(x-7*scale,y-18*scale,x+6*scale,y-16*scale),'bark1')
    rect(d,(x-10*scale,y-17*scale,x-6*scale,y-15*scale),'bark1')
    clusters=[(-12,-27,10,7),(-4,-31,12,8),(7,-28,11,7),(-18,-23,10,6),(15,-22,9,6)]
    if variant%2: clusters.append((0,-25,13,8))
    for i,(dx,dy,rw,rh) in enumerate(clusters):
        c=['leaf1','leaf2','leaf3'][i%3]
        rect(d,(x+(dx-rw//2)*scale,y+(dy-rh//2)*scale,x+(dx+rw//2)*scale,y+(dy+rh//2)*scale),c)
        if i%2==0: rect(d,(x+(dx-rw//2+2)*scale,y+(dy-rh//2+1)*scale,x+(dx+rw//2-1)*scale,y+(dy-rh//2+2)*scale),'leaf4')

def campus_building(d):
    # CAS-inspired academic building: centered low red-brick facade with clock-like tower but no official marks.
    # shadow base
    rect(d,(91,70,229,129),'brick0')
    rect(d,(95,73,225,126),'brick2')
    # wings
    rect(d,(66,88,112,128),'brick1'); rect(d,(208,88,254,128),'brick1')
    rect(d,(69,92,109,126),'brick3'); rect(d,(211,92,251,126),'brick3')
    # cream horizontal bands
    rect(d,(67,99,111,102),'cream1'); rect(d,(209,99,253,102),'cream1')
    rect(d,(96,95,224,98),'cream1')
    # tower
    rect(d,(139,48,181,112),'brick1'); rect(d,(143,51,177,112),'brick3')
    rect(d,(137,63,183,68),'cream2'); rect(d,(144,79,176,82),'cream1')
    # roof/tower roof
    poly(d,[(134,49),(160,31),(186,49)],'roof0'); poly(d,[(141,47),(160,35),(179,47)],'roof2')
    rect(d,(158,25,162,35),'roof1'); rect(d,(159,20,161,27),'cream2')
    # clock-ish academic round feature, generic
    rect(d,(154,54,166,66),'cream0'); rect(d,(155,55,165,65),'cream3'); rect(d,(159,57,161,62),'roof0'); rect(d,(160,60,164,61),'roof0')
    # entrance
    rect(d,(151,88,169,126),'roof0'); rect(d,(154,91,166,126),'shadow'); rect(d,(157,93,163,126),'glass1')
    # cream columns
    for x in (146,150,170,174): rect(d,(x,84,x+2,126),'cream2')
    # windows
    for x in range(101,134,11):
        for y in (80,105): rect(d,(x,y,x+5,y+7),'glass0'); rect(d,(x+1,y+1,x+4,y+5),'glass2')
    for x in range(187,220,11):
        for y in (80,105): rect(d,(x,y,x+5,y+7),'glass0'); rect(d,(x+1,y+1,x+4,y+5),'glass2')
    for x0 in (74,86,98,216,228,240):
        rect(d,(x0,107,x0+5,116),'glass0'); rect(d,(x0+1,108,x0+4,114),'glass2')
    # roof wings
    poly(d,[(62,88),(89,76),(116,88)],'roof0'); poly(d,[(204,88),(231,76),(258,88)],'roof0')
    rect(d,(65,86,113,90),'roof1'); rect(d,(207,86,255,90),'roof1')

def monument(d):
    # abstracted central campus monument silhouette, intentionally not a logo/icon copy
    rect(d,(156,120,164,133),'cream1'); rect(d,(152,133,168,135),'cream2'); rect(d,(147,136,173,138),'cream0')
    rect(d,(159,105,161,120),'roof0'); rect(d,(156,108,164,110),'roof0'); rect(d,(157,103,163,107),'cream1')
    rect(d,(159,99,161,104),'cream2'); rect(d,(157,100,159,102),'cream2'); rect(d,(161,100,163,102),'cream2')

def lamp(d,x,y):
    rect(d,(x,y-15,x+1,y),'roof0'); rect(d,(x-2,y-16,x+3,y-13),'roof1'); rect(d,(x-1,y-15,x+2,y-14),'lamp')

def bench(d,x,y):
    rect(d,(x,y-4,x+15,y-2),'bark2'); rect(d,(x+1,y-8,x+14,y-6),'bark1'); rect(d,(x+2,y-2,x+3,y+2),'roof0'); rect(d,(x+12,y-2,x+13,y+2),'roof0')

def student(d,x,y):
    rect(d,(x+2,y,x+5,y+3),'bark1'); rect(d,(x+1,y+4,x+6,y+9),'maroon'); rect(d,(x+2,y+10,x+3,y+14),'roof0'); rect(d,(x+5,y+10,x+6,y+14),'roof0')

layers={}
# sky
im=layer('sky'); d=ImageDraw.Draw(im); rect(d,(0,0,W,H),'sky1'); rect(d,(0,0,W,46),'sky0'); rect(d,(0,46,W,83),'sky2'); cloud(d,28,28); cloud(d,244,20); layers['01_sky']=im
# far vegetation/mountains
im=layer('far'); d=ImageDraw.Draw(im); poly(d,[(0,86),(35,57),(60,72),(97,54),(130,80),(160,58),(206,72),(245,50),(285,70),(320,54),(320,115),(0,115)],'mount0'); poly(d,[(0,93),(42,72),(80,88),(122,67),(165,89),(211,68),(258,81),(320,69),(320,117),(0,117)],'mount1'); layers['02_far_vegetation']=im
# architecture
im=layer('architecture'); d=ImageDraw.Draw(im); campus_building(d); layers['03_architecture']=im
# ground
im=layer('ground'); d=ImageDraw.Draw(im); rect(d,(0,118,319,179),'ground1'); poly(d,[(128,118),(192,118),(232,180),(88,180)],'path0'); poly(d,[(139,118),(181,118),(209,180),(111,180)],'path1'); rect(d,(0,142,319,145),'ground2'); # path pixels
for y in range(125,178,9):
    x0=int(145-(y-118)*.35); x1=int(175+(y-118)*.35)
    for x in range(x0,x1,13): rect(d,(x,y,x+4,y+1),'path2')
layers['04_ground']=im
# mid veg
im=layer('mid'); d=ImageDraw.Draw(im)
for x,v in [(24,0),(55,1),(274,0),(298,1),(83,1),(236,0)]: tree(d,x,130,1,v)
for x in range(4,320,17): rect(d,(x,139+(x%4),x+3,143+(x%4)),'leaf3')
layers['05_mid_vegetation']=im
# props
im=layer('props'); d=ImageDraw.Draw(im); monument(d); lamp(d,111,149); lamp(d,207,149); bench(d,49,158); bench(d,251,158); student(d,75,148); student(d,230,149); layers['06_props']=im
# foreground
im=layer('foreground'); d=ImageDraw.Draw(im); tree(d,3,183,2,1); tree(d,317,183,2,0); rect(d,(0,173,319,179),'leaf0');
for x in range(8,318,14): rect(d,(x,167+(x%3),x+2,172+(x%3)),'leaf2')
layers['07_foreground']=im
# lighting
im=layer('lighting'); d=ImageDraw.Draw(im); # intentional 1px warm windows / lamps
for x,y in [(111,133),(208,133),(159,60),(80,110),(104,110),(216,110),(240,110)]: rect(d,(x,y,x+1,y+1),'lamp')
layers['08_lighting']=im

for name,im in layers.items(): im.save(SRC/f'{name}.png', optimize=True)

composite=Image.new('RGBA',(W,H),(0,0,0,0))
for name in sorted(layers): composite.alpha_composite(layers[name])
composite.save(EXPORTS/'campus_hero.png', optimize=True)

# reusable props on transparent canvases
for name, fn, size in [
 ('tree_acacia_01', lambda d: tree(d,24,56,1,0),(48,60)),
 ('tree_acacia_02', lambda d: tree(d,24,56,1,1),(48,60)),
 ('bench_01', lambda d: bench(d,4,15),(24,20)),
 ('lamp_01', lambda d: lamp(d,8,20),(18,24)),
 ('student_01', lambda d: student(d,5,3),(16,20)),
]:
    # draw in 320 helper coordinates, crop declared size
    tmp=Image.new('RGBA',(max(size[0],64),max(size[1],64)),(0,0,0,0)); dd=ImageDraw.Draw(tmp); fn(dd); crop=tmp.crop((0,0,size[0],size[1])); crop.save(PROPS/f'{name}.png', optimize=True); crop.save(EXPORTS/f'{name}.png', optimize=True)

# simple bushes and grass
for name,size in [('bush_01',(16,10)),('grass_cluster_01',(12,8)),('radio_01',(14,11))]:
    im=Image.new('RGBA',size,(0,0,0,0)); d=ImageDraw.Draw(im)
    if name.startswith('bush'):
        rect(d,(1,4,14,9),'leaf1'); rect(d,(4,1,11,8),'leaf3'); rect(d,(6,2,9,4),'leaf5')
    elif name.startswith('grass'):
        rect(d,(1,5,2,7),'leaf3'); rect(d,(4,2,5,7),'leaf4'); rect(d,(7,4,8,7),'leaf2'); rect(d,(10,1,10,7),'leaf5')
    else:
        rect(d,(1,2,12,10),'roof0'); rect(d,(2,3,11,9),'roof2'); rect(d,(3,4,8,8),'glass0'); rect(d,(4,5,7,7),'rain'); rect(d,(10,4,10,5),'lamp')
    im.save(PROPS/f'{name}.png', optimize=True); im.save(EXPORTS/f'{name}.png', optimize=True)

# palette formats
colors=[]
for key,val in P.items():
    if key=='transparent': continue
    h=val.lstrip('#')
    if val not in colors: colors.append(val)
(PALETTES/'elbi-pass1.json').write_text(json.dumps({'name':'Elbi Pass 1','colors':colors},indent=2))
with (PALETTES/'elbi-pass1.gpl').open('w') as f:
    f.write('GIMP Palette\nName: Elbi Pass 1\nColumns: 8\n#\n')
    for key,val in P.items():
        if key=='transparent': continue
        h=val.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4)); f.write(f'{r:3d} {g:3d} {b:3d}\t{key}\n')

print(f'generated {len(layers)} source layers + composite + reusable props; palette colors={len(colors)}')
