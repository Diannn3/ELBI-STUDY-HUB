#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import subprocess, shutil, json, sys
ROOT=Path(__file__).resolve().parents[2]
EXPORTS=ROOT/'assets/exports/sprites'; SCENE_EXPORTS=ROOT/'assets/exports/scene'; GENERATED=ROOT/'assets/generated/atlases'; PUBLIC=ROOT/'public/assets'
GENERATED.mkdir(parents=True,exist_ok=True); PUBLIC.mkdir(parents=True,exist_ok=True)

def run(cmd):
    print('+',' '.join(map(str,cmd))); return subprocess.run(cmd,cwd=ROOT,check=True)

def fallback_pack():
    print('FastPack binary unavailable: using deterministic development fallback atlas. Locked .fpsheet remains production config.')
    # The large 640x360 scene layers are intentionally NOT atlas-packed.
    files=sorted(p for p in EXPORTS.glob('*.png') if p.name!='campus_hero.png')
    entries=[]; seen={}; sprites=[]
    for p in files:
        im=Image.open(p).convert('RGBA')
        bbox=im.getbbox() or (0,0,1,1)
        trimmed=im.crop(bbox)
        key=(trimmed.size,trimmed.tobytes())
        if key in seen:
            entries.append(('alias',p.stem,seen[key],im.size,bbox,None)); continue
        seen[key]=p.stem; sprites.append((p,im,trimmed,bbox))
    maxw=512; x=y=3; rowh=0; placed={}
    for p,orig,im,bbox in sprites:
        w,h=im.size; slotw=w+4; sloth=h+4
        if x+slotw>maxw: x=3; y+=rowh; rowh=0
        placed[p.stem]=(x+1,y+1,w,h,orig.size,bbox,im)
        x+=slotw; rowh=max(rowh,sloth)
    height=max(8,y+rowh+3)
    atlas=Image.new('RGBA',(maxw,height),(0,0,0,0))
    for name,(px,py,w,h,orig_size,bbox,im) in placed.items():
        atlas.alpha_composite(im,(px,py))
        if w and h:
            atlas.paste(im.crop((0,0,w,1)),(px,py-1)); atlas.paste(im.crop((0,h-1,w,h)),(px,py+h))
            atlas.paste(im.crop((0,0,1,h)),(px-1,py)); atlas.paste(im.crop((w-1,0,w,h)),(px+w,py))
    outpng=GENERATED/'campus-atlas.png'; atlas.save(outpng,optimize=True,compress_level=9)
    frames=[]
    for name,(px,py,w,h,orig_size,bbox,im) in placed.items():
        ox,oy=bbox[0],bbox[1]
        frames.append({'filename':name,'rotated':False,'trimmed':bbox!=(0,0,orig_size[0],orig_size[1]),
          'sourceSize':{'w':orig_size[0],'h':orig_size[1]},
          'spriteSourceSize':{'x':ox,'y':oy,'w':w,'h':h},
          'frame':{'x':px,'y':py,'w':w,'h':h}})
    for _,name,target,_,_,_ in entries:
        base=next(f for f in frames if f['filename']==target).copy(); base['filename']=name; frames.append(base)
    meta={'app':'FastPack-compatible fallback','version':'pass1.5','image':'campus-atlas.png','format':'RGBA8888','size':{'w':atlas.width,'h':atlas.height},'scale':1}
    data={'textures':[{'image':'campus-atlas.png','format':'RGBA8888','size':{'w':atlas.width,'h':atlas.height},'scale':1,'frames':frames}], 'meta':meta}
    (GENERATED/'campus-atlas.json').write_text(json.dumps(data,indent=2))

run([sys.executable,'scripts/assets/generate_pixel_art.py'])
run([sys.executable,'scripts/assets/generate_libresprite_script.py'])
run([sys.executable,'scripts/assets/generate_ambience.py'])
run([sys.executable,'scripts/validate/validate_assets.py'])

fastpack=shutil.which('fastpack')
if fastpack:
    run([fastpack,'pack','--project','assets/source/atlas.fpsheet'])
else:
    fallback_pack()

oxipng=shutil.which('oxipng')
if oxipng:
    run([oxipng,'-o','4','--strip','safe',str(GENERATED/'campus-atlas.png')])
    for p in SCENE_EXPORTS.glob('*.png'): run([oxipng,'-o','3','--strip','safe',str(p)])
else:
    p=GENERATED/'campus-atlas.png'; Image.open(p).save(p,optimize=True,compress_level=9)
    for p in SCENE_EXPORTS.glob('*.png'): Image.open(p).save(p,optimize=True,compress_level=9)
    print('OxiPNG binary unavailable: used Pillow lossless PNG optimization fallback.')

# Runtime output -----------------------------------------------------------------
for old in PUBLIC.glob('scene_*.png'): old.unlink()
UI_PUBLIC=PUBLIC/'ui'; UI_PUBLIC.mkdir(parents=True,exist_ok=True)
for old in UI_PUBLIC.glob('*.png'): old.unlink()
for src,dst in [
    (EXPORTS/'campus_hero.png',PUBLIC/'campus_hero.png'),
    (GENERATED/'campus-atlas.png',PUBLIC/'campus-atlas.png'),
    (GENERATED/'campus-atlas.json',PUBLIC/'campus-atlas.json'),
    (ROOT/'assets/source/tiled/scene_home.tmj',PUBLIC/'scene_home.json'),
]: shutil.copy2(src,dst)
for src in sorted(SCENE_EXPORTS.glob('*.png')):
    shutil.copy2(src, PUBLIC/f'scene_{src.name}')
for src in sorted((ROOT/'assets/source/libresprite/ui').glob('*.png')):
    shutil.copy2(src, UI_PUBLIC/src.name)

scene_layers={p.stem: f'scene_{p.name}' for p in sorted(SCENE_EXPORTS.glob('[0-9][0-9]_*.png'))}
manifest={'hero':'campus_hero.png','sceneLayers':scene_layers,'atlasImage':'campus-atlas.png','atlasData':'campus-atlas.json','tiledMap':'scene_home.json','sceneVersion':'pass1.5-up-day','uiIcons':'ui/'}
(PUBLIC/'asset-manifest.json').write_text(json.dumps(manifest,indent=2))
PREVIEW=ROOT/'preview/assets'; PREVIEW.mkdir(parents=True,exist_ok=True)
for src in [PUBLIC/'campus_hero.png', PUBLIC/'campus-atlas.png', PUBLIC/'campus-atlas.json', PUBLIC/'scene_home.json', PUBLIC/'asset-manifest.json'] + sorted(PUBLIC.glob('scene_*.png')):
    if src.exists(): shutil.copy2(src, PREVIEW/src.name)
PREVIEW_UI=PREVIEW/'ui'; PREVIEW_UI.mkdir(parents=True,exist_ok=True)
for src in sorted(UI_PUBLIC.glob('*.png')): shutil.copy2(src, PREVIEW_UI/src.name)
print('Assets ready:',PUBLIC)
