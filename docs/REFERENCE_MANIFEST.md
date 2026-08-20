# Reference manifest

This file is the textual source-of-truth for the reference-board workflow. A `.pur` board is not generated here because PureRef is a desktop binary.

## Primary user-supplied reference

A frontal daytime photograph of the UPLB CAS/Oblation area was supplied in the project conversation on 21 August 2026. Pass 1.5 uses it as **composition and architectural reference only**, not as a filtered or traced runtime image.

Visual cues intentionally carried into the original pixel scene:

- large bright blue sky / generous negative space
- central monument silhouette
- symmetrical low CAS facade
- teal/green roof
- warm white/cream building walls
- side-framing broadleaf trees and palms
- vivid lawn
- stepped central approach
- strong daytime lighting

The pixel scene is manually/procedurally authored from integer pixel clusters in `scripts/assets/generate_pixel_art.py`; it is not produced by an AI image generator or by photo quantization.

## UPLB environment / brand references

- Official UPLB site / public campus imagery: https://uplb.edu.ph/
- UPLB Visual Brand Guide (updated July 2026): https://sites.google.com/up.edu.ph/uplb-visual-brand-guide/home
- UPLB student-organization Visual Brand Guide: https://sites.google.com/up.edu.ph/visualbrandguideuplbstudentorg/home

Reference buckets for later manual art passes:

- additional CAS frontal and oblique views
- UPLB canopy / large trees
- grass, concrete and pavement
- campus lamps and benches
- campus signs
- rainy/day/night lighting studies

## Pixel-art direction

- architecture silhouettes before surface detail
- connected foliage clusters rather than noisy single pixels
- low-frame-rate ambience
- notice-board / planner / campus-radio utility surfaces
- readable DOM body typography, pixel display typography only for labels/timers

## Rule

Use references to identify proportions, materials, atmosphere, and recognizable cues. Do not trace one photograph pixel-for-pixel. The app remains an unofficial student project and the monument scene is never used as the product logo.
