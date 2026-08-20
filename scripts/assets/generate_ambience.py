#!/usr/bin/env python3
from pathlib import Path
import wave, math, random, struct, subprocess, shutil
ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'assets/source/audio'; PUBLIC=ROOT/'public/assets/audio'; PREVIEW=ROOT/'preview/assets/audio'
for p in (SRC,PUBLIC,PREVIEW): p.mkdir(parents=True,exist_ok=True)
RATE=22050; SECS=12; N=RATE*SECS

def render(name, sample_fn, seed):
    random.seed(seed)
    wav=SRC/f'{name}.wav'
    with wave.open(str(wav),'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
        buf=bytearray()
        for i in range(N):
            t=i/RATE; v=max(-1,min(1,sample_fn(t,i)))
            buf.extend(struct.pack('<h',int(v*32767)))
        w.writeframes(buf)
    ffmpeg=shutil.which('ffmpeg')
    target=PUBLIC/f'{name}.ogg'
    if ffmpeg:
        subprocess.run([ffmpeg,'-y','-loglevel','error','-i',str(wav),'-c:a','libvorbis','-q:a','3',str(target)],check=True)
        shutil.copy2(target,PREVIEW/target.name)
    elif not target.exists():
        print(f'WARN: ffmpeg unavailable and {target.name} missing; runtime ambience not rebuilt')

rain_state={'x':0.0}
def rainy(t,i):
    white=random.uniform(-1,1); rain_state['x']=.82*rain_state['x']+.18*white
    hiss=.055*white+.08*rain_state['x']; phase=(t*7)%1; drip=0
    if phase<.018: drip=.07*math.sin(math.pi*phase/.018)*math.sin(2*math.pi*1200*t)
    return hiss+drip

def quiet(t,i):
    white=random.uniform(-1,1)
    return .025*math.sin(2*math.pi*60*t)+.012*math.sin(2*math.pi*120*t)+.018*white+.018*math.sin(2*math.pi*.22*t)*math.sin(2*math.pi*180*t)

def night(t,i):
    white=random.uniform(-1,1)*.015; cycle=t%3; chirp=0
    if .4<cycle<.75 or 1.05<cycle<1.32:
        u=cycle-.4 if cycle<.75 else cycle-1.05; env=math.sin(math.pi*min(1,u/.35))**2
        chirp=.045*env*math.sin(2*math.pi*(2600+300*math.sin(2*math.pi*8*t))*t)
    return white+.012*math.sin(2*math.pi*95*t)+chirp

render('rainy-elbi',rainy,2808); render('quiet-room',quiet,2810); render('night-insects',night,2812)
print('Generated original Pass-1 ambience loops')
