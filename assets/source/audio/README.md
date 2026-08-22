# Pass-1 ambience source

These three loops are **original procedurally generated audio**, not downloaded music or third-party recordings:

- `rainy-elbi.wav` — filtered noise plus sparse soft droplet transients
- `night-insects.wav` — quiet noise/hum plus deterministic chirp envelopes
- `quiet-room.wav` — low room noise, 60/120 Hz hum, and a subtle fan component

`scripts/assets/generate_ambience.py` deterministically rebuilds all three sources and uses FFmpeg/libvorbis to create small `.ogg` runtime files. Playback is always user-initiated to respect browser autoplay rules.
