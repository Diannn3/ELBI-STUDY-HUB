#!/usr/bin/env python3
"""Explicit manual gate from snapped workbench to LibreSprite source staging."""
import argparse, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
ap=argparse.ArgumentParser(); ap.add_argument('relative_path'); ap.add_argument('--yes',action='store_true'); ns=ap.parse_args()
src=ROOT/'assets/workbench/snapped'/ns.relative_path
if not src.exists(): raise SystemExit(f'not found: {src}')
dst=ROOT/'assets/source/libresprite/imported'/ns.relative_path
if not ns.yes: raise SystemExit(f'Review {src} visually, then rerun with --yes to promote to {dst}')
dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst); print('PROMOTED',dst.relative_to(ROOT))
