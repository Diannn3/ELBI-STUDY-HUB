#!/usr/bin/env python3
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[2]
forbidden_dirs=['discord','friends','rooms','achievements','avatars','ai','calendar']
found=[]
feature_root=ROOT/'src/features'
for name in forbidden_dirs:
    if (feature_root/name).exists(): found.append(str(feature_root/name))
# User-facing strings that would indicate accidental progression scope creep.
for p in (ROOT/'src').rglob('*'):
    if not p.is_file() or p.suffix not in ('.ts','.tsx','.css'): continue
    text=p.read_text(errors='ignore').lower()
    for marker in ['xp points','unlock cosmetic','achievement unlocked','level up']:
        if marker in text: found.append(f'{p}:{marker}')
if found:
    print('SCOPE AUDIT FAILED'); [print('FOUND',x) for x in found]; sys.exit(1)
print('SCOPE AUDIT OK — postponed social/progression features are absent from src/features')
