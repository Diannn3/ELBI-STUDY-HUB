#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, os, shutil, subprocess, sys, hashlib
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PRESETS = json.loads((ROOT/'scripts/assets/pixel_snap_presets.json').read_text())
PALETTE = [p.strip().lstrip('#') for p in (ROOT/'assets/source/palettes/elbi-master.hex').read_text().strip().split(',') if p.strip()]


def category_for(path: Path) -> str:
    parts = set(path.parts)
    if 'campus' in parts: return 'campus'
    if 'clouds' in parts: return 'cloud'
    if 'foliage' in parts: return 'foliage'
    if 'props' in parts: return 'prop'
    if 'ui' in parts: return 'icon'
    return 'prop'


def nearest(rgb):
    p = [(int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)) for h in PALETTE]
    return min(p, key=lambda c:(rgb[0]-c[0])**2+(rgb[1]-c[1])**2+(rgb[2]-c[2])**2)


def fallback_snap(src: Path, dst: Path, preset: dict):
    # Deterministic development fallback only. It is intentionally simpler than
    # SpriteFusion's implicit-grid detector and therefore cannot satisfy --strict.
    im=Image.open(src).convert('RGBA')
    px=max(1,int(preset.get('pixelSize',2)))
    w=max(1,round(im.width/px)); h=max(1,round(im.height/px))
    im=im.resize((w,h),Image.Resampling.NEAREST)
    # Palette map opaque colors, preserve alpha exactly.
    data=[]; cache={}
    for r,g,b,a in im.getdata():
        if a==0: data.append((r,g,b,a)); continue
        key=(r,g,b)
        c=cache.get(key)
        if c is None: c=cache.setdefault(key,nearest(key))
        data.append((*c,a))
    im.putdata(data)
    dst.parent.mkdir(parents=True,exist_ok=True); im.save(dst,optimize=True,compress_level=9)
    return {'backend':'development-fallback','pixelSize':px,'outputWidth':w,'outputHeight':h}


def native_snap(binary: str, src: Path, dst: Path, preset: dict):
    cmd=[binary,str(src),str(dst),str(preset.get('colors',32)),'--pixel-size',str(preset.get('pixelSize',2)),'--palette',','.join(PALETTE)]
    cp=subprocess.run(cmd,cwd=ROOT,text=True,capture_output=True)
    if cp.returncode:
        raise RuntimeError(f"Pixel Snapper failed for {src}:\n{cp.stdout}\n{cp.stderr}")
    out=Image.open(dst)
    return {'backend':'spritefusion-pixel-snapper','pixelSize':preset.get('pixelSize'),'outputWidth':out.width,'outputHeight':out.height,'stdout':cp.stdout.strip()}


def process(src: Path, input_root: Path, output_root: Path, strict: bool):
    rel=src.relative_to(input_root); cat=category_for(rel); preset=PRESETS[cat]
    dst=(output_root/rel).with_suffix('.png')
    binary=os.environ.get('PIXEL_SNAPPER_BIN') or shutil.which('spritefusion-pixel-snapper')
    if binary:
        result=native_snap(binary,src,dst,preset)
    elif strict:
        raise RuntimeError('spritefusion-pixel-snapper is required in strict mode')
    else:
        result=fallback_snap(src,dst,preset)
    result.update({'source':str(src.relative_to(ROOT)),'output':str(dst.relative_to(ROOT)),'category':cat,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
    expected=(preset.get('expectedWidth'),preset.get('expectedHeight'))
    if all(expected) and (result['outputWidth'],result['outputHeight']) != expected:
        result['warning']=f"expected {expected[0]}x{expected[1]}, got {result['outputWidth']}x{result['outputHeight']}"
    return result


def main():
    ap=argparse.ArgumentParser(description='ELBI wrapper around SpriteFusion Pixel Snapper')
    ap.add_argument('category',nargs='?',default='all',choices=['all','campus','clouds','foliage','props','ui'])
    ap.add_argument('--strict',action='store_true',help='require native SpriteFusion binary')
    ap.add_argument('--input',type=Path,default=ROOT/'assets/inbox/generated')
    ap.add_argument('--output',type=Path,default=ROOT/'assets/workbench/snapped')
    ns=ap.parse_args()
    input_root=ns.input if ns.input.is_absolute() else ROOT/ns.input
    output_root=ns.output if ns.output.is_absolute() else ROOT/ns.output
    roots=[input_root] if ns.category=='all' else [input_root/ns.category]
    files=[]
    for r in roots:
        if r.exists(): files += [p for p in r.rglob('*') if p.suffix.lower() in {'.png','.jpg','.jpeg'}]
    if not files:
        print('No generated inputs to snap.'); return 0
    records=[]
    for p in sorted(files):
        rec=process(p,input_root,output_root,ns.strict); records.append(rec)
        print(f"SNAP {rec['source']} -> {rec['output']} [{rec['backend']}] {rec['outputWidth']}x{rec['outputHeight']}")
        if rec.get('warning'): print('WARN',rec['warning'])
    report={'tool':'spritefusion-pixel-snapper','strict':ns.strict,'records':records}
    (output_root/'snap-manifest.json').write_text(json.dumps(report,indent=2)+'\n')
    return 0

if __name__=='__main__': raise SystemExit(main())
