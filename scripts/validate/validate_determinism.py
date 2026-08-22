#!/usr/bin/env python3
from pathlib import Path
import hashlib, subprocess, sys
ROOT=Path(__file__).resolve().parents[2]
FILES=[
 ROOT/'assets/exports/scene_living/campus_living_composite.png',
 ROOT/'assets/source/tiled/scene_living.tmj',
 ROOT/'assets/exports/living-sprites/cloud_mid_01.png',
 ROOT/'assets/generated/atlases/campus-atlas.json',
]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def build(): subprocess.run([sys.executable,'scripts/assets/build_assets.py'],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
build(); a={str(p.relative_to(ROOT)):digest(p) for p in FILES}; build(); b={str(p.relative_to(ROOT)):digest(p) for p in FILES}
for k in a:
    if a[k]!=b[k]: raise SystemExit(f'DETERMINISM FAIL: {k}')
print('DETERMINISM VALIDATION OK —',len(FILES),'critical outputs stable across two builds')
