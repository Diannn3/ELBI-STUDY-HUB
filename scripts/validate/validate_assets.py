#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import json, sys
ROOT=Path(__file__).resolve().parents[2]
errors=[]; warnings=[]
hero=ROOT/'assets/exports/sprites/campus_hero.png'
if not hero.exists(): errors.append('missing campus_hero.png')
else:
    im=Image.open(hero).convert('RGBA')
    if im.size!=(640,360): errors.append(f'hero size {im.size}, expected 640x360')
    colors=im.getcolors(maxcolors=10000)
    if colors is None: errors.append('hero has >10,000 colors; pixel palette discipline broken')
    elif len(colors)>48: errors.append(f'hero has {len(colors)} colors; environment target max is 48')

layers=sorted((ROOT/'assets/source/libresprite/campus_day').glob('*.png'))
expected=['01_sky','02_clouds','03_far_trees','04_cas','05_oblation','06_ground','07_mid_trees','08_props','09_foreground','10_lighting']
if [p.stem for p in layers] != expected: errors.append('LibreSprite campus_day layer set/names do not match v2 design contract')
for p in layers:
    if Image.open(p).size!=(640,360): errors.append(f'{p.name}: expected 640x360')

pal=ROOT/'assets/source/palettes/elbi-up-day.json'
if pal.exists():
    p=json.loads(pal.read_text())
    if len(p.get('colors',[]))>56: errors.append('combined scene/UI palette exceeds 56 colors')
else: errors.append('missing elbi-up-day palette')

scene=ROOT/'assets/source/tiled/scene_home.tmj'
if not scene.exists(): errors.append('missing Tiled source')
else:
    data=json.loads(scene.read_text())
    if any('source' in ts for ts in data.get('tilesets',[])): errors.append('runtime-incompatible external Tiled tileset source found')
    names={x.get('name') for x in data.get('layers',[])}
    for name in ['BACKGROUND','CLOUDS','FAR_WORLD','ARCHITECTURE','OBLATION','GROUND','PROPS_BACK','PROPS_FRONT','FOREGROUND','LIGHTING','FX_MARKERS','INTERACTION_MARKERS']:
        if name not in names: errors.append(f'Tiled layer missing: {name}')
    markers=next((x for x in data.get('layers',[]) if x.get('name')=='INTERACTION_MARKERS'),{}).get('objects',[])
    marker_names={m.get('name') for m in markers}
    for name in ['UI_SAFE_RIGHT','UI_SAFE_TOP','ANCHOR_OBLATION','PARALLAX_SKY','PARALLAX_FAR','PARALLAX_WORLD','PARALLAX_FOREGROUND']:
        if name not in marker_names: errors.append(f'Tiled marker missing: {name}')

fps=ROOT/'assets/source/atlas.fpsheet'
if not fps.exists(): errors.append('missing FastPack project')
else:
    s=fps.read_text()
    for required in ['data_format = "phaser3"','allow_rotation = false','trim_mode = "trim"','extrude = 1','detect_aliases = true']:
        if required not in s: errors.append(f'FastPack config missing locked option: {required}')

for p in (ROOT/'assets/exports/sprites').glob('*.png'):
    im=Image.open(p)
    if im.mode not in ('RGBA','LA','P'):
        warnings.append(f'{p.name}: mode {im.mode}; transparent pixel assets should usually be RGBA')

if errors:
    print('ASSET VALIDATION FAILED')
    for e in errors: print('ERROR:',e)
    for w in warnings: print('WARN:',w)
    sys.exit(1)
print(f'ASSET VALIDATION OK — {len(layers)} 640x360 scene layers, {len(list((ROOT/"assets/exports/sprites").glob("*.png")))} runtime PNGs')
for w in warnings: print('WARN:',w)
