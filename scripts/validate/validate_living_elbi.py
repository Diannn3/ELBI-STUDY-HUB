#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[2]
errors=[]
required=[
 'assets/source/libresprite/campus-day/01_sky_base.png','assets/source/libresprite/campus-day/07_world_static.png',
 'assets/source/tiled/scene_living.tmj','public/assets/living/living-manifest.json','assets/exports/scene_living/campus_living_composite.png'
]
for rel in required:
 p=ROOT/rel
 if not p.exists(): errors.append(f'missing {rel}')
for rel in ['assets/source/libresprite/campus-day/01_sky_base.png','assets/source/libresprite/campus-day/07_world_static.png','assets/exports/scene_living/campus_living_composite.png']:
 p=ROOT/rel
 if p.exists() and Image.open(p).size!=(768,480): errors.append(f'{rel} must be 768x480')
if (ROOT/'assets/source/tiled/scene_living.tmj').exists():
 d=json.loads((ROOT/'assets/source/tiled/scene_living.tmj').read_text())
 names={o['name'] for l in d['layers'] if l.get('type')=='objectgroup' for o in l.get('objects',[])}
 for n in ['CLOUD_FAR_BAND','CLOUD_MID_BAND','CLOUD_NEAR_BAND','LEAF_ZONE_LEFT','LEAF_ZONE_RIGHT','BIRD_PATH_HIGH','RAIN_AREA','UI_SAFE_RIGHT','ANCHOR_OBLATION']:
  if n not in names: errors.append(f'missing Tiled marker {n}')

atlas=ROOT/'assets/generated/atlases/campus-atlas.json'
if not atlas.exists(): errors.append('missing campus atlas JSON')
else:
 ad=json.loads(atlas.read_text())
 frames={f.get('filename') for tex in ad.get('textures',[]) for f in tex.get('frames',[])}
 for required_frame in ['cloud_far_01','cloud_mid_01','cloud_near_01','palm_fronds_00','tree_canopy_00','bird_00','leaf_00','rain_streak']:
  if required_frame not in frames: errors.append(f'missing living atlas frame {required_frame}')

count=len(list((ROOT/'assets/exports/living-sprites').glob('*.png')))
if count<25: errors.append(f'expected >=25 living sprites, got {count}')
if errors:
 print('LIVING ELBI VALIDATION FAILED'); print('\n'.join(' - '+e for e in errors)); raise SystemExit(1)
print(f'LIVING ELBI VALIDATION OK — 768x480, {count} small runtime sprites')
