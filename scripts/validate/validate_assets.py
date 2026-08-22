#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import json, sys, re
ROOT=Path(__file__).resolve().parents[2]
errors=[]; warnings=[]
hero=ROOT/'assets/exports/sprites/campus_hero.png'
if not hero.exists(): errors.append('missing campus_hero.png')
else:
    im=Image.open(hero).convert('RGBA')
    if im.size!=(320,180): errors.append(f'hero size {im.size}, expected 320x180')
    colors=im.getcolors(maxcolors=10000)
    if colors is None: errors.append('hero has >10,000 colors; pixel palette discipline broken')
    elif len(colors)>48: errors.append(f'hero has {len(colors)} colors; max is 48')

layers=sorted((ROOT/'assets/source/libresprite/campus').glob('*.png'))
expected=['01_sky','02_far_vegetation','03_architecture','04_ground','05_mid_vegetation','06_props','07_foreground','08_lighting']
if [p.stem for p in layers] != expected: errors.append('LibreSprite layer set/names do not match design contract')
for p in layers:
    if Image.open(p).size!=(320,180): errors.append(f'{p.name}: expected 320x180')

pal=ROOT/'assets/source/palettes/elbi-pass1.json'
if pal.exists():
    p=json.loads(pal.read_text())
    if len(p.get('colors',[]))>48: errors.append('palette exceeds 48 colors')
else: errors.append('missing palette')

scene=ROOT/'assets/source/tiled/scene_home.tmj'
if not scene.exists(): errors.append('missing Tiled source')
else:
    data=json.loads(scene.read_text())
    if any('source' in ts for ts in data.get('tilesets',[])): errors.append('runtime-incompatible external Tiled tileset source found')
    names={x.get('name') for x in data.get('layers',[])}
    for name in ['BACKGROUND','FAR_WORLD','GROUND','ARCHITECTURE','PROPS_BACK','PROPS_FRONT','FOREGROUND','FX_MARKERS','INTERACTION_MARKERS']:
        if name not in names: errors.append(f'Tiled layer missing: {name}')

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


# Pass 1.7 Living Elbi is the canonical home world; legacy 320x180 assets remain only as compatibility/fallback inputs.
living=ROOT/'assets/exports/scene_living/campus_living_composite.png'
if not living.exists(): errors.append('missing Living Elbi composite')
else:
    lim=Image.open(living).convert('RGBA')
    if lim.size!=(768,480): errors.append(f'Living Elbi size {lim.size}, expected 768x480')
living_scene=ROOT/'assets/source/tiled/scene_living.tmj'
if not living_scene.exists(): errors.append('missing Living Elbi Tiled source')

if errors:
    print('ASSET VALIDATION FAILED')
    for e in errors: print('ERROR:',e)
    for w in warnings: print('WARN:',w)
    sys.exit(1)
print(f'ASSET VALIDATION OK — {len(layers)} hero layers, {len(list((ROOT/"assets/exports/sprites").glob("*.png")))} runtime PNGs')
for w in warnings: print('WARN:',w)
