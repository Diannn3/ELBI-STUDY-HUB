#!/usr/bin/env python3
"""Create a disposable 2x concept from the manually reviewed 768x480 source.
This exists to exercise the generated -> Pixel Snapper -> workbench gate without
pretending the workbench output is the final authored source.
"""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
src=ROOT/'assets/source/libresprite/campus-day/07_world_static.png'
out=ROOT/'assets/inbox/generated/campus/campus_day_concept.png'
out.parent.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert('RGBA').resize((1536,960),Image.Resampling.NEAREST)
im.save(out,optimize=True,compress_level=9)
print('Generated disposable concept:',out.relative_to(ROOT))
