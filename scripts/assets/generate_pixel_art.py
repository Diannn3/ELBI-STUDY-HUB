from PIL import Image, ImageDraw
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets/source/libresprite/campus_day'
PROPS = ROOT / 'assets/source/libresprite/props'
UI = ROOT / 'assets/source/libresprite/ui'
EXPORTS = ROOT / 'assets/exports/sprites'
SCENE_EXPORTS = ROOT / 'assets/exports/scene'
PALETTES = ROOT / 'assets/source/palettes'
for p in (SRC, PROPS, UI, EXPORTS, SCENE_EXPORTS, PALETTES):
    p.mkdir(parents=True, exist_ok=True)

W, H = 640, 360
P = {
    'transparent': (0, 0, 0, 0),
    # UPLB / interface anchors
    'up_maroon': '#7B1113', 'maroon_deep': '#5C1016', 'maroon_light': '#9B111E',
    'up_green': '#014421', 'green_mid': '#146B3A', 'green_light': '#3F8D57',
    'up_gold': '#FFB81C', 'cream': '#FFF9F1', 'sand': '#F2E8DC', 'charcoal': '#292725',
    # sky / clouds — deliberately clustered, no smooth gradients
    'sky0': '#397FB8', 'sky1': '#55A3D9', 'sky2': '#7DB2E4', 'sky3': '#A1C1E7', 'sky4': '#CDE6F7',
    'cloud0': '#F4F2E9', 'cloud1': '#D7E6EF', 'cloud2': '#B8D2E5',
    # vegetation
    'leaf0': '#173B27', 'leaf1': '#245638', 'leaf2': '#347044', 'leaf3': '#4F8B48',
    'leaf4': '#6FA348', 'leaf5': '#93B956', 'grass0': '#3F6F2C', 'grass1': '#5B8A31', 'grass2': '#88AD45',
    'bark0': '#3A2A1F', 'bark1': '#5C3F2C', 'bark2': '#80593C',
    # CAS / roof / stone
    'cas_shadow': '#91A39A', 'cas_mid': '#B9C3B9', 'cas_light': '#E5E1D8', 'cas_high': '#FFF9F1',
    'roof0': '#0A4F4C', 'roof1': '#117064', 'roof2': '#20818D', 'roof_high': '#45A4A1',
    'glass0': '#496B79', 'glass1': '#7596A3', 'glass2': '#BBD0D4',
    'metal0': '#57625E', 'metal1': '#8A9690',
    'stone0': '#4B4943', 'stone1': '#6D685F', 'stone2': '#91897C', 'stone3': '#B8AD9A',
    'path0': '#A59484', 'path1': '#C6B8A9', 'path2': '#E0D1C1',
    'shadow_blue': '#5E7A7A', 'sun': '#FFE2A1', 'danger': '#B7463D'
}

# Manual authored palette only. No color quantization of the source photograph is used.
def rgba(c, a=255):
    if isinstance(c, tuple): return c
    h = P.get(c, c).lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (a,)

def layer():
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))

def rect(d, xy, c): d.rectangle(xy, fill=rgba(c))
def poly(d, pts, c): d.polygon(pts, fill=rgba(c))
def line(d, pts, c, width=1): d.line(pts, fill=rgba(c), width=width)

# Pixel cluster helpers -----------------------------------------------------
def cloud_cluster(d, x, y, s=1):
    blocks = [
        (0, 10, 50, 19, 'cloud1'), (10, 4, 42, 18, 'cloud0'), (21, 0, 34, 16, 'cloud0'),
        (38, 7, 58, 18, 'cloud0'), (5, 17, 52, 22, 'cloud2'), (18, 4, 25, 8, 'sky4')
    ]
    for x0,y0,x1,y1,c in blocks:
        rect(d, (x+x0*s, y+y0*s, x+x1*s, y+y1*s), c)

def broadleaf(d, x, base_y, scale=1, variant=0):
    # trunk and asymmetric branches
    tw = max(3, 4*scale)
    rect(d, (x-tw//2, base_y-68*scale, x+tw//2, base_y), 'bark0')
    rect(d, (x-tw//2+2*scale, base_y-65*scale, x+tw//2, base_y), 'bark1')
    line(d, [(x,base_y-53*scale),(x-27*scale,base_y-82*scale)], 'bark1', 3*scale)
    line(d, [(x+1*scale,base_y-56*scale),(x+31*scale,base_y-86*scale)], 'bark1', 3*scale)
    clusters = [(-45,-101,35,19),(-23,-117,40,21),(5,-122,43,23),(34,-108,38,20),
                (-57,-82,32,18),(-13,-91,48,23),(30,-86,42,19),(56,-90,26,15)]
    if variant % 2:
        clusters = [(dx+(3 if i%2 else -4),dy,rw,rh) for i,(dx,dy,rw,rh) in enumerate(clusters)]
    for i,(dx,dy,rw,rh) in enumerate(clusters):
        c = ['leaf0','leaf1','leaf2','leaf2','leaf3'][i%5]
        x0=x+(dx-rw//2)*scale; y0=base_y+(dy-rh//2)*scale
        x1=x+(dx+rw//2)*scale; y1=base_y+(dy+rh//2)*scale
        rect(d,(x0,y0,x1,y1),c)
        if i % 2 == 0:
            rect(d,(x0+5*scale,y0+3*scale,x1-5*scale,y0+6*scale),'leaf4')
        if i % 3 == 0:
            rect(d,(x0+10*scale,y0+7*scale,x1-10*scale,y0+9*scale),'leaf5')

def palm(d, x, base_y, scale=1):
    # slightly leaning segmented trunk
    for i in range(0,60,5):
        xx = x + i//18
        rect(d,(xx-2*scale,base_y-(i+5)*scale,xx+2*scale,base_y-i*scale),'bark1' if (i//5)%2 else 'bark2')
    crown_y=base_y-62*scale
    # fronds as stair-stepped pixel lines
    fronds=[(-33,-8),(-27,-18),(-14,-24),(0,-27),(16,-24),(29,-17),(34,-5),(-22,1),(24,2)]
    for dx,dy in fronds:
        line(d,[(x,crown_y),(x+dx*scale,crown_y+dy*scale)],'leaf1',2*scale)
        ex=x+dx*scale; ey=crown_y+dy*scale
        rect(d,(ex-3*scale,ey-2*scale,ex+3*scale,ey+2*scale),'leaf3')
    rect(d,(x-5*scale,crown_y-5*scale,x+5*scale,crown_y+4*scale),'leaf2')
    rect(d,(x-2*scale,crown_y-3*scale,x+4*scale,crown_y),'leaf5')

def cas_building(d):
    # Based on the supplied CAS/Oblation frontal photograph: low symmetrical white academic building.
    # Rear shadow
    rect(d,(46,190,594,295),'cas_shadow')
    # central wing
    rect(d,(174,188,466,294),'cas_mid')
    rect(d,(178,194,462,289),'cas_light')
    # left/right two-storey wings
    for x0,x1 in [(52,185),(455,588)]:
        rect(d,(x0,176,x1,294),'cas_mid')
        rect(d,(x0+4,181,x1-4,288),'cas_light')
        # floor division & eaves
        rect(d,(x0+3,235,x1-3,240),'cas_shadow')
        rect(d,(x0+4,238,x1-4,241),'cas_high')
    # green roofs: center shallow roof + two gables
    poly(d,[(160,190),(192,168),(448,168),(480,190)],'roof0')
    poly(d,[(166,187),(195,171),(445,171),(474,187)],'roof2')
    rect(d,(176,186,464,193),'roof1')
    # left and right gable caps
    for cx,x0,x1 in [(119,45,192),(521,448,595)]:
        poly(d,[(x0,181),(cx,150),(x1,181)],'roof0')
        poly(d,[(x0+8,178),(cx,156),(x1-8,178)],'roof2')
        rect(d,(x0+5,177,x1-5,184),'roof1')
        # little highlight edge
        line(d,[(x0+12,175),(cx,158),(x1-12,175)],'roof_high',2)
    # center roof highlight
    rect(d,(196,171,444,174),'roof_high')
    # central entry / stair shadow
    rect(d,(256,238,384,289),'cas_shadow')
    rect(d,(263,242,377,287),'charcoal')
    # central gated doors / columns
    for x in (270,282,358,370): rect(d,(x,240,x+4,287),'cas_high')
    for x in range(290,351,10):
        rect(d,(x,245,x+5,285),'metal0')
        rect(d,(x+1,247,x+3,283),'metal1')
    # repeating windows, hand-pixel modules
    def window(x,y,w=17,h=18):
        rect(d,(x,y,x+w,y+h),'cas_shadow')
        rect(d,(x+2,y+2,x+w-2,y+h-2),'glass0')
        rect(d,(x+3,y+3,x+w-3,y+7),'glass2')
        line(d,[(x+w//2,y+2),(x+w//2,y+h-2)],'cas_light',1)
        line(d,[(x+2,y+9),(x+w-2,y+9)],'cas_light',1)
    # wing windows top/bottom
    for x in [65,88,111,134,157,468,491,514,537,560]:
        window(x,193,17,19); window(x,251,17,20)
    # central wing top windows
    for x in [192,218,404,430]: window(x,205,18,16)
    # center small windows above entrance
    for x in [246,270,294,318,342,366,390]: window(x,203,15,16)
    # eaves / base / columns
    rect(d,(46,289,594,296),'cas_high')
    rect(d,(46,296,594,300),'cas_shadow')
    for x in (54,181,459,586): rect(d,(x,184,x+4,289),'cas_high')
    # AC units / vents as small recognizable campus texture
    for x,y in [(70,224),(145,225),(196,263),(439,262),(478,224),(551,226),(507,273)]:
        rect(d,(x,y,x+13,y+10),'metal0'); rect(d,(x+2,y+2,x+11,y+8),'metal1'); rect(d,(x+5,y+3,x+8,y+6),'cas_shadow')
    # front steps behind monument
    for i,(x0,x1,y) in enumerate([(250,390,286),(242,398,292),(233,407,298),(224,416,304)]):
        rect(d,(x0,y,x1,y+4),'path2' if i%2==0 else 'path1')

def oblation(d):
    # Stylized study-scene silhouette, built from pixel clusters; not used as a product logo/icon.
    cx=320
    # stone pedestal: tapered river-stone mass
    poly(d,[(297,188),(343,188),(356,301),(284,301)],'stone0')
    poly(d,[(301,192),(339,192),(349,296),(291,296)],'stone1')
    # irregular stones
    stones=[(304,198,11,8,'stone3'),(319,195,10,9,'stone2'),(332,202,9,7,'stone3'),
            (297,210,12,9,'stone2'),(314,211,13,8,'stone0'),(330,215,14,10,'stone2'),
            (302,225,10,9,'stone3'),(316,225,13,10,'stone2'),(336,231,10,8,'stone0'),
            (294,240,13,11,'stone2'),(312,242,12,9,'stone3'),(328,245,15,10,'stone2'),
            (300,258,12,10,'stone0'),(317,258,11,11,'stone2'),(333,265,12,10,'stone3'),
            (293,278,14,11,'stone3'),(311,280,13,10,'stone0'),(330,283,14,9,'stone2')]
    for x,y,w,h,c in stones:
        rect(d,(x,y,x+w,y+h),c)
        rect(d,(x+2,y+1,x+w-2,y+2),'stone3' if c!='stone3' else 'stone2')
    # statue silhouette. Intentionally low detail; recognition is pose + pedestal.
    body='charcoal'; hi='metal0'
    rect(d,(316,123,324,152),body)               # torso
    rect(d,(317,111,323,121),body)               # neck
    rect(d,(315,103,325,112),body)               # head/hair mass
    rect(d,(317,101,323,103),hi)
    # arms: long horizontal pixel stair lines
    line(d,[(318,128),(291,136),(264,133)],body,5)
    line(d,[(322,128),(349,136),(376,133)],body,5)
    rect(d,(258,131,267,135),body); rect(d,(373,131,382,135),body)
    # chest highlight and legs
    rect(d,(318,124,320,144),hi)
    poly(d,[(317,150),(321,150),(318,181),(313,188),(309,187),(314,155)],body)
    poly(d,[(321,150),(325,153),(330,184),(326,189),(322,184),(320,156)],body)
    # tiny foot/platform
    rect(d,(307,186,333,191),'stone0')

def ground_scene(d):
    # lawn base and broad central walkway/platform, kept bright like the supplied photograph
    rect(d,(0,286,639,359),'grass1')
    rect(d,(0,302,639,359),'grass2')
    # large lawn patches / cut stripes
    for y,c in [(306,'grass1'),(320,'grass2'),(334,'grass1'),(348,'grass2')]:
        rect(d,(0,y,639,y+6),c)
    # central path widens toward foreground
    poly(d,[(285,286),(355,286),(430,360),(210,360)],'path0')
    poly(d,[(293,286),(347,286),(411,360),(229,360)],'path1')
    # stepped platform in front of pedestal
    rect(d,(242,297,398,307),'stone2'); rect(d,(228,308,412,317),'stone3')
    rect(d,(211,318,429,328),'stone1'); rect(d,(194,329,446,341),'stone2')
    rect(d,(176,342,464,354),'stone3')
    # small concrete borders
    rect(d,(0,282,639,286),'grass0')
    rect(d,(58,290,170,296),'cas_light'); rect(d,(470,290,582,296),'cas_light')

def shrub(d,x,y,w=24,h=12):
    rect(d,(x,y+h//2,x+w,y+h),'leaf1'); rect(d,(x+3,y+2,x+w-3,y+h-2),'leaf3'); rect(d,(x+7,y,x+w-8,y+5),'leaf5')

def bench(d,x,y):
    rect(d,(x,y,x+26,y+4),'bark2'); rect(d,(x+2,y-8,x+24,y-4),'bark1'); rect(d,(x+4,y+5,x+7,y+12),'metal0'); rect(d,(x+20,y+5,x+23,y+12),'metal0')

def lamp(d,x,y):
    rect(d,(x,y-30,x+2,y),'metal0'); rect(d,(x-4,y-35,x+6,y-29),'charcoal'); rect(d,(x-2,y-33,x+4,y-30),'sun')

def student(d,x,y,shirt='up_maroon'):
    rect(d,(x+3,y,x+7,y+4),'bark1'); rect(d,(x+2,y+5,x+8,y+12),shirt); rect(d,(x+2,y+13,x+4,y+21),'charcoal'); rect(d,(x+7,y+13,x+9,y+21),'charcoal')

layers={}
# 01 sky
im=layer(); d=ImageDraw.Draw(im)
rect(d,(0,0,W-1,H-1),'sky2'); rect(d,(0,0,W-1,70),'sky3'); rect(d,(0,71,W-1,135),'sky2'); rect(d,(0,136,W-1,184),'sky1')
# sky patches give painterly pixel clusters without gradients
poly(d,[(0,22),(210,0),(350,0),(260,30),(110,47),(0,50)],'sky4')
poly(d,[(310,18),(639,0),(639,65),(500,54),(406,43)],'sky3')
layers['01_sky']=im
# 02 clouds
im=layer(); d=ImageDraw.Draw(im)
cloud_cluster(d,18,34,2); cloud_cluster(d,185,72,1); cloud_cluster(d,410,32,2); cloud_cluster(d,520,108,1)
# long wisps as blocky connected strips
rect(d,(42,102,176,108),'cloud2'); rect(d,(71,96,150,103),'cloud1'); rect(d,(450,82,591,88),'cloud2'); rect(d,(480,76,554,83),'cloud1')
layers['02_clouds']=im
# 03 far trees
im=layer(); d=ImageDraw.Draw(im)
# Layered, irregular canopy clusters behind CAS. Keep the central sky clear so the Oblation silhouette reads cleanly.
def far_canopy(x,y,w,h,base='leaf1'):
    rect(d,(x,y+h//3,x+w,y+h),base)
    rect(d,(x+6,y+5,x+w-10,y+h-5),'leaf2')
    rect(d,(x+16,y,x+w-18,y+h//2),'leaf3')
    if w>54:
        rect(d,(x-8,y+h//3,x+18,y+h-4),'leaf0')
        rect(d,(x+w-22,y+h//4,x+w+7,y+h-6),'leaf1')
    rect(d,(x+12,y+8,x+26,y+12),'leaf4')
far_canopy(-8,126,84,66,'leaf0')
far_canopy(48,112,92,80,'leaf1')
far_canopy(126,128,70,64,'leaf0')
far_canopy(188,140,60,52,'leaf1')
far_canopy(245,144,56,48,'leaf0')
far_canopy(339,144,58,48,'leaf1')
far_canopy(392,134,70,58,'leaf0')
far_canopy(454,118,86,74,'leaf1')
far_canopy(526,108,116,84,'leaf0')
# sparse bare twigs sit off-axis, echoing the reference photo without merging into the statue
for base_x, direction in [(278,-1),(362,1)]:
    line(d,[(base_x,185),(base_x+direction*18,153)],'bark0',1)
    line(d,[(base_x+direction*10,166),(base_x+direction*27,151)],'bark0',1)
layers['03_far_trees']=im
# 04 CAS
im=layer(); d=ImageDraw.Draw(im); cas_building(d); layers['04_cas']=im
# 05 Oblation
im=layer(); d=ImageDraw.Draw(im); oblation(d); layers['05_oblation']=im
# 06 ground
im=layer(); d=ImageDraw.Draw(im); ground_scene(d); layers['06_ground']=im
# 07 mid trees / palms / shrubs
im=layer(); d=ImageDraw.Draw(im)
# dominant side framing trees, intentionally push detail toward edges/UI frame
broadleaf(d,32,290,1,0); broadleaf(d,603,286,1,1)
palm(d,111,290,1); palm(d,184,290,1); palm(d,486,291,1)
for x in [72,150,205,430,505,552]: shrub(d,x,279,28,13)
layers['07_mid_trees']=im
# 08 props
im=layer(); d=ImageDraw.Draw(im)
bench(d,85,310); bench(d,526,309); lamp(d,247,304); lamp(d,393,304)
student(d,224,286,'up_maroon'); student(d,448,286,'green_mid')
# small campus sign on right as abstract non-logo sign
rect(d,(503,263,535,282),'maroon_deep'); rect(d,(506,266,532,279),'cream'); rect(d,(509,269,529,271),'up_maroon'); rect(d,(509,274,525,275),'up_green')
layers['08_props']=im
# 09 foreground
im=layer(); d=ImageDraw.Draw(im)
# edge shrubs that visually frame bottom corners
for x in range(0,150,30): shrub(d,x,335,34,18)
for x in range(500,640,28): shrub(d,x,334,35,19)
# crisp blades only at foreground edge, not noisy across whole lawn
for x in range(0,640,13):
    c=['grass0','leaf2','grass1'][x%3]
    rect(d,(x,354-(x%4),x+2,359),c)
layers['09_foreground']=im
# 10 lighting
im=layer(); d=ImageDraw.Draw(im)
# warm sun hits: eaves, path, grass strips. Intentionally sparse.
rect(d,(56,182,183,184),'sun'); rect(d,(457,182,586,184),'sun'); rect(d,(198,174,442,176),'sun')
for x,y in [(245,270),(395,270),(96,272),(544,272)]: rect(d,(x,y,x+2,y+2),'sun')
layers['10_lighting']=im

# write authoritative layers and a legacy mirror for tools that still reference old location
for name, im in layers.items():
    im.save(SRC / f'{name}.png', optimize=True, compress_level=9)

composite=Image.new('RGBA',(W,H),(0,0,0,0))
for name in sorted(layers): composite.alpha_composite(layers[name])
composite.save(EXPORTS/'campus_hero.png', optimize=True, compress_level=9)
composite.save(SCENE_EXPORTS/'campus_day_composite.png', optimize=True, compress_level=9)

# Runtime scene layers are individual images; preserve source hierarchy.
for name,im in layers.items():
    im.save(SCENE_EXPORTS/f'{name}.png', optimize=True, compress_level=9)

# Reusable scene sprites on transparent canvases --------------------------------
def render_asset(size, painter):
    im=Image.new('RGBA',size,(0,0,0,0)); dd=ImageDraw.Draw(im); painter(dd); return im

scene_props = {
    'tree_broadleaf_01': ((128,150), lambda d: broadleaf(d,64,145,1,0)),
    'tree_broadleaf_02': ((128,150), lambda d: broadleaf(d,64,145,1,1)),
    'palm_01': ((80,90), lambda d: palm(d,40,88,1)),
    'bench_01': ((36,28), lambda d: bench(d,4,12)),
    'lamp_01': ((22,42), lambda d: lamp(d,10,40)),
    'student_01': ((18,28), lambda d: student(d,4,3,'up_maroon')),
    'student_02': ((18,28), lambda d: student(d,4,3,'green_mid')),
}
for name,(size,painter) in scene_props.items():
    im=render_asset(size,painter); im.save(PROPS/f'{name}.png',optimize=True); im.save(EXPORTS/f'{name}.png',optimize=True)

for name,size in [('bush_01',(24,16)),('grass_cluster_01',(16,12)),('bird_01',(14,8)),('leaf_particle',(6,5))]:
    im=Image.new('RGBA',size,(0,0,0,0)); d=ImageDraw.Draw(im)
    if name=='bush_01': shrub(d,1,2,22,13)
    elif name=='grass_cluster_01':
        for x,h,c in [(2,8,'grass0'),(5,11,'leaf2'),(8,7,'grass1'),(11,10,'leaf3'),(14,6,'grass0')]: rect(d,(x,12-h,x+1,11),c)
    elif name=='bird_01':
        line(d,[(1,5),(5,2),(7,4),(9,2),(13,5)],'charcoal',1)
    else:
        poly(d,[(1,1),(5,2),(3,4),(0,3)],'leaf4')
    im.save(PROPS/f'{name}.png',optimize=True); im.save(EXPORTS/f'{name}.png',optimize=True)

# Pixel UI icons ----------------------------------------------------------------
def save_ui(name, painter):
    im=Image.new('RGBA',(16,16),(0,0,0,0)); d=ImageDraw.Draw(im); painter(d); im.save(UI/f'{name}.png',optimize=True); im.save(EXPORTS/f'ui_{name}.png',optimize=True)

def icon_settings(d):
    rect(d,(6,1,9,3),'charcoal'); rect(d,(6,12,9,14),'charcoal'); rect(d,(1,6,3,9),'charcoal'); rect(d,(12,6,14,9),'charcoal')
    rect(d,(4,4,11,11),'charcoal'); rect(d,(6,6,9,9),'cream')
def icon_music(d):
    rect(d,(9,2,11,11),'charcoal'); rect(d,(5,3,11,5),'charcoal'); rect(d,(3,10,7,13),'charcoal'); rect(d,(8,9,12,12),'charcoal')
def icon_focus(d):
    rect(d,(2,2,5,3),'up_maroon'); rect(d,(2,2,3,5),'up_maroon'); rect(d,(10,2,13,3),'up_maroon'); rect(d,(12,2,13,5),'up_maroon')
    rect(d,(2,12,5,13),'up_maroon'); rect(d,(2,10,3,13),'up_maroon'); rect(d,(10,12,13,13),'up_maroon'); rect(d,(12,10,13,13),'up_maroon'); rect(d,(7,7,8,8),'up_gold')
def icon_task(d):
    rect(d,(3,2,12,13),'cream'); rect(d,(3,2,12,3),'up_maroon'); rect(d,(5,6,6,7),'up_green'); rect(d,(8,6,11,7),'charcoal'); rect(d,(5,10,6,11),'up_green'); rect(d,(8,10,11,11),'charcoal')
def icon_stats(d):
    rect(d,(2,10,4,13),'up_green'); rect(d,(6,7,8,13),'up_green'); rect(d,(10,3,12,13),'up_maroon'); rect(d,(1,14,13,14),'charcoal')
def checkbox_empty(d): rect(d,(3,3,12,12),'charcoal'); rect(d,(5,5,10,10),'cream')
def checkbox_doing(d): rect(d,(3,3,12,12),'up_gold'); rect(d,(5,5,10,10),'cream')
def checkbox_done(d):
    rect(d,(3,3,12,12),'up_green'); line(d,[(5,8),(7,10),(11,5)],'cream',2)
def priority_high(d):
    poly(d,[(8,2),(13,8),(8,13),(3,8)],'up_maroon'); rect(d,(7,5,8,9),'cream')
def priority_medium(d):
    poly(d,[(8,2),(13,8),(8,13),(3,8)],'up_gold'); rect(d,(7,7,8,8),'charcoal')
def priority_low(d):
    poly(d,[(8,2),(13,8),(8,13),(3,8)],'up_green'); rect(d,(7,7,8,8),'cream')

for n,f in [('settings',icon_settings),('music',icon_music),('focus',icon_focus),('task',icon_task),('stats',icon_stats),
            ('checkbox_empty',checkbox_empty),('checkbox_doing',checkbox_doing),('checkbox_done',checkbox_done),
            ('priority_high',priority_high),('priority_medium',priority_medium),('priority_low',priority_low)]: save_ui(n,f)

# Palette output -----------------------------------------------------------------
colors=[]
for key,val in P.items():
    if key=='transparent': continue
    if val not in colors: colors.append(val)
(PALETTES/'elbi-up-day.json').write_text(json.dumps({'name':'Elbi UP Day v2','colors':colors},indent=2))
with (PALETTES/'elbi-up-day.gpl').open('w') as f:
    f.write('GIMP Palette\nName: Elbi UP Day v2\nColumns: 8\n#\n')
    for key,val in P.items():
        if key=='transparent': continue
        h=val.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4)); f.write(f'{r:3d} {g:3d} {b:3d}\t{key}\n')

# Keep pass1 aliases for existing docs/tooling while promoting v2 palette.
(PALETTES/'elbi-pass1.json').write_text(json.dumps({'name':'Elbi UP Day v2','colors':colors},indent=2))
(PALETTES/'elbi-pass1.gpl').write_text((PALETTES/'elbi-up-day.gpl').read_text())


# Tiled scene source --------------------------------------------------------------
TILED = ROOT / 'assets/source/tiled'
TILED.mkdir(parents=True, exist_ok=True)
image_layers = [
    ('BACKGROUND', '../libresprite/campus_day/01_sky.png'),
    ('CLOUDS', '../libresprite/campus_day/02_clouds.png'),
    ('FAR_WORLD', '../libresprite/campus_day/03_far_trees.png'),
    ('ARCHITECTURE', '../libresprite/campus_day/04_cas.png'),
    ('OBLATION', '../libresprite/campus_day/05_oblation.png'),
    ('GROUND', '../libresprite/campus_day/06_ground.png'),
    ('PROPS_BACK', '../libresprite/campus_day/07_mid_trees.png'),
    ('PROPS_FRONT', '../libresprite/campus_day/08_props.png'),
    ('FOREGROUND', '../libresprite/campus_day/09_foreground.png'),
    ('LIGHTING', '../libresprite/campus_day/10_lighting.png'),
]
tiled_layers=[]
for idx,(name,imgpath) in enumerate(image_layers,1):
    tiled_layers.append({
        'id': idx, 'name': name, 'type': 'imagelayer', 'visible': True, 'opacity': 1,
        'offsetx': 0, 'offsety': 0, 'image': imgpath
    })
fx_objects = [
    {'id': 101,'name':'cloud-west','type':'cloud','x':125,'y':55,'point':True},
    {'id': 102,'name':'cloud-east','type':'cloud','x':490,'y':62,'point':True},
    {'id': 103,'name':'bird-path','type':'bird','x':418,'y':96,'point':True},
    {'id': 104,'name':'leaf-west','type':'leaf','x':78,'y':208,'point':True},
    {'id': 105,'name':'leaf-east','type':'leaf','x':560,'y':214,'point':True},
]
tiled_layers.append({'id':20,'name':'FX_MARKERS','type':'objectgroup','visible':True,'opacity':1,'objects':fx_objects,'draworder':'topdown'})
interaction_objects = [
    {'id':201,'name':'UI_SAFE_RIGHT','type':'ui-safe','x':466,'y':58,'width':154,'height':224,'rotation':0,'visible':True},
    {'id':202,'name':'UI_SAFE_TOP','type':'ui-safe','x':18,'y':12,'width':604,'height':48,'rotation':0,'visible':True},
    {'id':203,'name':'ANCHOR_OBLATION','type':'anchor','x':320,'y':188,'point':True},
    {'id':204,'name':'PARALLAX_SKY','type':'parallax','x':120,'y':36,'point':True},
    {'id':205,'name':'PARALLAX_FAR','type':'parallax','x':180,'y':152,'point':True},
    {'id':206,'name':'PARALLAX_WORLD','type':'parallax','x':320,'y':220,'point':True},
    {'id':207,'name':'PARALLAX_FOREGROUND','type':'parallax','x':520,'y':330,'point':True},
]
tiled_layers.append({'id':21,'name':'INTERACTION_MARKERS','type':'objectgroup','visible':True,'opacity':1,'objects':interaction_objects,'draworder':'topdown'})
scene_data = {
    'compressionlevel': -1, 'height': 23, 'width': 40, 'infinite': False,
    'tilewidth': 16, 'tileheight': 16, 'orientation': 'orthogonal', 'renderorder': 'right-down',
    'nextlayerid': 22, 'nextobjectid': 208, 'layers': tiled_layers, 'tilesets': [],
    'type': 'map', 'version': '1.10', 'tiledversion': '1.12.0'
}
(TILED/'scene_home.tmj').write_text(json.dumps(scene_data,indent=2))
(TILED/'elbi-study.tiled-project').write_text(json.dumps({
    'automappingRulesFile':'','commands':[],'extensionsPath':'','folders':['.'],
    'objectTypesFile':'','propertyTypes':[]
},indent=2))

# Color count report
used = composite.getcolors(maxcolors=10000) or []
print(f'generated {len(layers)} 640x360 authored scene layers + {len(scene_props)} reusable props + UI icons; palette colors={len(colors)}, hero colors={len(used)}')
