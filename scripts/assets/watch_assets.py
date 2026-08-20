#!/usr/bin/env python3
from pathlib import Path
import subprocess, sys, time
ROOT=Path(__file__).resolve().parents[2]
WATCH=[ROOT/'assets/source', ROOT/'scripts/assets']
def stamp():
    vals=[]
    for root in WATCH:
        for p in root.rglob('*'):
            if p.is_file() and '__pycache__' not in str(p): vals.append((str(p),p.stat().st_mtime_ns,p.stat().st_size))
    return hash(tuple(vals))
last=None
print('Watching asset sources. Ctrl-C to stop.')
while True:
    cur=stamp()
    if cur!=last:
        last=cur
        subprocess.run([sys.executable,str(ROOT/'scripts/assets/build_assets.py')],cwd=ROOT)
    time.sleep(.75)
