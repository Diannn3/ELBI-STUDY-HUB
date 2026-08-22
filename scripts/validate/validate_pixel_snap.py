#!/usr/bin/env python3
from pathlib import Path
import json, os, shutil, sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
manifest=ROOT/'assets/workbench/snapped/snap-manifest.json'
required=[ROOT/'assets/source/palettes/elbi-master.hex',ROOT/'assets/source/palettes/elbi-master.gpl',ROOT/'scripts/assets/pixel_snap.py',ROOT/'scripts/assets/pixel_snap_presets.json']
errors=[f'missing {p.relative_to(ROOT)}' for p in required if not p.exists()]
if manifest.exists():
    d=json.loads(manifest.read_text())
    for r in d.get('records',[]):
        p=ROOT/r['output']
        if not p.exists(): errors.append(f"missing snapped output {r['output']}"); continue
        im=Image.open(p)
        if im.width<1 or im.height<1: errors.append(f"invalid dimensions {r['output']}")
        if r['category']=='campus' and (im.width,im.height)!=(768,480): errors.append(f"campus must snap to 768x480, got {im.size}")
if errors:
    print('PIXEL SNAP VALIDATION FAILED'); print('\n'.join(' - '+e for e in errors)); raise SystemExit(1)
print('PIXEL SNAP VALIDATION OK')
