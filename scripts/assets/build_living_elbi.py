#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw
import json, random, math, shutil
ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'assets/source/libresprite/campus-day'; OUT=ROOT/'assets/exports/scene_living'; SPR=ROOT/'assets/exports/living-sprites'; TILED=ROOT/'assets/source/tiled'; PUB=ROOT/'public/assets/living'
for p in (SRC,OUT,SPR,TILED,PUB): p.mkdir(parents=True,exist_ok=True)
W,H=768,480
# base world is a manually prepared source layer; generator derives dynamic plates without filtering it.
world=Image.open(SRC/'07_world_static.png').convert('RGBA')
if world.size!=(W,H): raise SystemExit(f'07_world_static must be {W}x{H}')
# Sky plate: clean gradient-free bands to keep pixel-art language and allow clouds to move independently.
sky=Image.new('RGBA',(W,H),(78,166,216,255)); d=ImageDraw.Draw(sky)
for y,c in [(0,(65,145,202,255)),(48,(73,158,213,255)),(105,(88,176,224,255)),(170,(122,194,228,255)),(230,(160,216,239,255))]:
    d.rectangle((0,y,W,min(H,y+70)),fill=c)
sky.save(SRC/'01_sky_base.png')
# haze band
haze=Image.new('RGBA',(W,H),(0,0,0,0)); hd=ImageDraw.Draw(haze)
hd.rectangle((0,220,W,300),fill=(213,239,250,30)); haze.save(SRC/'05_haze.png')
# Lighting overlays
for idx,alpha in [(1,26),(2,16)]:
    ov=Image.new('RGBA',(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    # sparse dapple blocks on lawn/architecture
    rnd=random.Random(930+idx)
    for _ in range(80):
        x=rnd.randrange(0,W); y=rnd.randrange(260,H); ww=rnd.randrange(3,14); hh=rnd.randrange(1,5)
        od.rectangle((x,y,x+ww,y+hh),fill=(255,234,167,alpha if idx==1 else max(8,alpha-4)))
    ov.save(SRC/f'21_sun_dapple_{idx}.png')
shadow=Image.new('RGBA',(W,H),(0,0,0,0)); sd=ImageDraw.Draw(shadow); sd.rectangle((0,280,260,H),fill=(54,91,105,22)); shadow.save(SRC/'22_cloud_shadow.png')
# cloud sprite helpers: logical pixels, hard clusters
def cloud(name,w,h,seed,band):
    im=Image.new('RGBA',(w,h),(0,0,0,0)); dr=ImageDraw.Draw(im); r=random.Random(seed)
    hi=(247,253,252,255); mid=(218,240,247,255); low=(174,216,236,255); shade=(147,199,226,220)
    base_y=int(h*.62)
    # stepped lower silhouette instead of one long rectangular shelf
    x0=max(2,w//12); x1=w-max(3,w//14)
    steps=[(x0,base_y-2),(x0+w//12,base_y-5),(x0+w//5,base_y-3),(x0+w//3,base_y-7),(x1-w//4,base_y-4),(x1-w//10,base_y-6),(x1,base_y-2),(x1,base_y+max(2,h//9)),(x0,base_y+max(2,h//9))]
    dr.polygon(steps,fill=mid)
    # clustered lobes. Hard scan-line ellipses preserve source pixels without antialiasing.
    count=7 if band=='far' else 9
    blobs=[]
    for j in range(count):
        bw=r.randrange(max(8,w//9),max(12,w//3)); bh=r.randrange(max(7,h//3),max(9,int(h*.72)))
        cx=r.randrange(max(bw//2+1,x0),max(bw//2+2,x1-bw//2))
        # central lobes climb higher, edge lobes remain lower
        center_bias=1-abs((cx/(w-1))-.5)*1.4
        cy=int(base_y-bh*.35-center_bias*bh*.18+r.randrange(-2,3))
        blobs.append((cx,cy,bw,bh))
    for cx,cy,bw,bh in sorted(blobs,key=lambda b:b[1],reverse=True):
        top=cy-bh//2
        for yy in range(bh):
            t=(yy+.5)/bh; radius=int((bw/2)*math.sqrt(max(0,1-(2*t-1)**2)))
            y=top+yy
            if y<0 or y>=h: continue
            col=hi if yy<bh*.42 else mid
            dr.line((max(0,cx-radius),y,min(w-1,cx+radius),y),fill=col)
    # underside broken shadow clusters
    for _ in range(max(2,w//55)):
        sw=r.randrange(max(5,w//14),max(7,w//6)); sx=r.randrange(x0,max(x0+1,x1-sw)); sy=base_y+r.randrange(2,max(3,h//9))
        dr.rectangle((sx,sy,min(w-1,sx+sw),min(h-1,sy+max(1,h//14))),fill=low)
    # a few internal blue notches stop large clouds reading as white blobs
    if band!='far':
        for _ in range(2):
            sw=r.randrange(4,max(5,w//12)); sx=r.randrange(x0,max(x0+1,x1-sw)); sy=base_y-r.randrange(0,max(2,h//7))
            dr.rectangle((sx,sy,min(w-1,sx+sw),min(h-1,sy+1)),fill=shade)
    im.save(SPR/f'{name}.png')
for i in range(3): cloud(f'cloud_far_{i+1:02d}',72+10*i,26+3*i,100+i,'far')
for i in range(4): cloud(f'cloud_mid_{i+1:02d}',108+12*i,38+4*i,200+i,'mid')
for i in range(2): cloud(f'cloud_near_{i+1:02d}',158+18*i,54+5*i,300+i,'near')
# small authored-frame approximations; aligned frames share same canvas.
def palm_frame(i):
    im=Image.new('RGBA',(48,64),(0,0,0,0)); dr=ImageDraw.Draw(im)
    dr.rectangle((23,21,25,63),fill=(86,69,45,255)); shift=[-2,-1,1,2][i]
    for dx,dy,l in [(-19,-3,20),(-13,-11,17),(-6,-16,15),(6,-16,15),(13,-11,17),(19,-3,20)]:
        x=24+dx+shift*(1 if dx>0 else -1); y=22+dy
        dr.line((24,22,x,y),fill=(17,82,43,255),width=2); dr.rectangle((x-2,y-1,x+2,y+1),fill=(54,124,64,255))
    im.save(SPR/f'palm_fronds_{i:02d}.png')
for i in range(4): palm_frame(i)
def canopy_frame(i):
    im=Image.new('RGBA',(64,42),(0,0,0,0)); dr=ImageDraw.Draw(im); sh=[0,1,0,-1][i]
    for x,y,r,c in [(10,18,10,(43,107,53,255)),(25,11,13,(67,131,61,255)),(42,15,14,(54,120,57,255)),(54,22,9,(92,149,68,255))]: dr.rectangle((x-r+sh,y-r//2,x+r+sh,y+r//2),fill=c)
    im.save(SPR/f'tree_canopy_{i:02d}.png')
for i in range(4): canopy_frame(i)
for i,shift in enumerate([0,1,-1]):
    im=Image.new('RGBA',(24,8),(0,0,0,0)); dr=ImageDraw.Draw(im)
    for x in range(2,23,5): dr.line((x,7,x+shift,2),fill=(91,143,55,255),width=1)
    im.save(SPR/f'grass_wind_{i:02d}.png')
# birds
for i in range(4):
    im=Image.new('RGBA',(16,8),(0,0,0,0)); dr=ImageDraw.Draw(im); dy=[-2,0,2,0][i]
    dr.line((1,4,7,4+dy),fill=(37,49,51,255),width=1); dr.line((8,4+dy,14,4),fill=(37,49,51,255),width=1); im.save(SPR/f'bird_{i:02d}.png')
# leaves, rain
for i,c in enumerate([(46,112,52,255),(93,150,67,255),(215,160,84,255)]):
    im=Image.new('RGBA',(5,5),(0,0,0,0)); dr=ImageDraw.Draw(im); dr.rectangle((1,1,3,2),fill=c); dr.point((2,3),fill=c); im.save(SPR/f'leaf_{i:02d}.png')
rain=Image.new('RGBA',(2,7),(0,0,0,0)); rd=ImageDraw.Draw(rain); rd.line((1,0,0,6),fill=(188,222,239,185),width=1); rain.save(SPR/'rain_streak.png')
# composite preview: sky+haze+world+sun dapple (clouds are dynamic and intentionally absent)
comp=Image.alpha_composite(sky,haze); comp=Image.alpha_composite(comp,world); comp=Image.alpha_composite(comp,Image.open(SRC/'21_sun_dapple_1.png'))
comp.save(OUT/'campus_living_composite.png')
# Tiled object map - runtime tuning as data, not decorative docs.
def prop(name,t,v): return {'name':name,'type':t,'value':v}
def obj(i,name,x,y,w,h,props): return {'id':i,'name':name,'type':'marker','x':x,'y':y,'width':w,'height':h,'rotation':0,'visible':True,'properties':props}
layers=[
 {'id':1,'name':'FX_MARKERS','type':'objectgroup','visible':True,'opacity':1,'objects':[
   obj(1,'CLOUD_FAR_BAND',0,30,W,95,[prop('speedMin','float',2.0),prop('speedMax','float',3.2),prop('parallax','float',0.025)]),
   obj(2,'CLOUD_MID_BAND',0,70,W,125,[prop('speedMin','float',3.0),prop('speedMax','float',4.8),prop('parallax','float',0.055)]),
   obj(3,'CLOUD_NEAR_BAND',0,105,W,135,[prop('speedMin','float',4.3),prop('speedMax','float',6.0),prop('parallax','float',0.09)]),
   obj(4,'LEAF_ZONE_LEFT',0,170,190,220,[prop('spawnMinMs','int',3000),prop('spawnMaxMs','int',7500),prop('maxParticles','int',4)]),
   obj(5,'LEAF_ZONE_RIGHT',580,170,188,220,[prop('spawnMinMs','int',3200),prop('spawnMaxMs','int',7800),prop('maxParticles','int',4)]),
   obj(6,'BIRD_PATH_HIGH',-40,45,W+80,90,[prop('spawnMinMs','int',25000),prop('spawnMaxMs','int',60000),prop('durationMinMs','int',10000),prop('durationMaxMs','int',18000)]),
   obj(7,'RAIN_AREA',0,0,W,H,[prop('desktopMax','int',90),prop('mobileMax','int',40)])]},
 {'id':2,'name':'VEGETATION_MARKERS','type':'objectgroup','visible':True,'opacity':1,'objects':[
   obj(20,'PALM_LEFT',125,246,48,64,[prop('kind','string','palm')]),obj(21,'PALM_RIGHT',608,245,48,64,[prop('kind','string','palm')]),
   obj(22,'TREE_LEFT',8,150,64,42,[prop('kind','string','tree')]),obj(23,'TREE_RIGHT',696,150,64,42,[prop('kind','string','tree')]),
   obj(24,'GRASS_FRONT',350,420,24,8,[prop('kind','string','grass')])]},
 {'id':3,'name':'UI_SAFE_ZONES','type':'objectgroup','visible':False,'opacity':1,'objects':[obj(30,'UI_SAFE_RIGHT',575,70,175,285,[]),obj(31,'UI_SAFE_TOP',20,10,728,62,[]),obj(32,'ANCHOR_OBLATION',382,205,4,4,[])]}
]
mapdata={'compressionlevel':-1,'height':30,'infinite':False,'layers':layers,'nextlayerid':4,'nextobjectid':33,'orientation':'orthogonal','renderorder':'right-down','tiledversion':'1.11.2','tileheight':16,'tilewidth':16,'type':'map','version':'1.10','width':48}
(TILED/'scene_living.tmj').write_text(json.dumps(mapdata,indent=2)+'\n')
# Copy runtime assets
for p in [SRC/'01_sky_base.png',SRC/'05_haze.png',SRC/'07_world_static.png',SRC/'21_sun_dapple_1.png',SRC/'21_sun_dapple_2.png',SRC/'22_cloud_shadow.png',OUT/'campus_living_composite.png',TILED/'scene_living.tmj']:
    shutil.copy2(p,PUB/(p.stem+'.json' if p.suffix=='.tmj' else p.name))
for p in SPR.glob('*.png'): shutil.copy2(p,PUB/p.name)
manifest={'sceneSize':[W,H],'sceneMap':'scene_living.json','plates':['01_sky_base.png','05_haze.png','07_world_static.png','21_sun_dapple_1.png','21_sun_dapple_2.png','22_cloud_shadow.png'],'spriteCount':len(list(SPR.glob('*.png')))}
(PUB/'living-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Living Elbi built:',manifest)
