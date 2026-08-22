# ELBI Study Hub — Pass 1.7 Living Elbi

A local-first UPLB/Elbi-inspired study companion built around one reliable loop:

**Campus Home → choose/create task → Start Focus → survive reload/background/offline → finish → Done/Continue/Blocked → TIL → history/stats update.**

Pass 1.7 keeps that functional core and upgrades the visual/runtime foundation into **Living Elbi**: a bright 768×480 layered pixel diorama with moving clouds, subtle vegetation, rare birds/leaves, weather/lighting profiles, and focus-aware motion reduction.

The product deliberately still excludes Discord, social rooms, XP, achievements, avatar systems, study-driven scenery progression, AI, full Kanban, and native wrappers.

## What is implemented

- React 19 + TypeScript + Vite
- Phaser 4 world layer with replay-safe React↔Phaser bridge
- Dexie/IndexedDB local-first persistence
- absolute-timestamp focus timer, including 5–120 minute Custom mode
- task → focus → Done/Continue/Blocked → TIL → history loop
- Supabase schema/RLS/outbox foundation
- PWA/service-worker foundation
- light HUD by default, plus Dark and Auto HUD options
- Bright Elbi, Follow local time, and Rainy Elbi scene profiles
- Full/Subtle/Reduced ambient-motion modes
- 768×480 Living Elbi scene source and deterministic runtime build
- three cloud depth bands, wind-driven vegetation, rare birds/leaves, rain, dappled light, cloud shadow, tiny pointer parallax
- Focus Mode environmental calming and `prefers-reduced-motion` support
- SpriteFusion Pixel Snapper generated-art normalization workbench
- LibreSprite source/editing handoff
- Tiled composition/marker contract
- FastPack atlas contract for small sprites and OxiPNG release optimization
- Vitest/Playwright/axe definitions plus dependency-light domain/visual QA harnesses

## Quick start

Requirements: Node 22+, npm, Python 3.13+ with Pillow. FFmpeg is needed only when rebuilding ambience.

```bash
npm install
npm run assets
npm run dev
```

### Main QA command

```bash
npm run qa:local
```

For the full production gate also run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Pixel production pipeline

Generated/external imagery is **never production source directly**.

```text
reference / external concept
        ↓
assets/inbox/generated
        ↓
SpriteFusion Pixel Snapper
(grid normalization + palette lock)
        ↓
assets/workbench/snapped
        ↓
manual review / explicit promotion
        ↓
LibreSprite production source
        ↓
Tiled
        ↓
FastPack (small runtime sprites)
        ↓
OxiPNG
        ↓
Phaser 4
```

LibreSprite remains the art source of truth. Finalized LibreSprite art is never automatically sent back through Pixel Snapper.

### Normalize generated art

```bash
npm run art:bootstrap-living
npm run art:snap            # campus preset by default
npm run art:snap:all
npm run validate:pixel-snap
```

CI uses the native pinned SpriteFusion CLI. If it is absent locally, the wrapper can use a deterministic development fallback and clearly records that fact in `assets/workbench/snapped/snap-manifest.json`; the fallback is not considered equivalent to native grid detection.

Manual promotion is explicit:

```bash
npm run art:promote -- <category> <filename>
```

See `docs/PIXEL_SNAPPER_PIPELINE.md`.

## Living Elbi scene

Large 768×480 plates live in `assets/source/libresprite/campus-day/` and intentionally bypass the atlas. Small clouds, foliage frames, birds, leaves, rain, props, and UI sprites are packed.

The editable source can be assembled in LibreSprite with:

`assets/source/libresprite/scripts/rebuild_living_elbi.js`

Tiled source:

`assets/source/tiled/scene_living.tmj`

It contains cloud bands, leaf zones, bird/rain regions, vegetation anchors, Oblation anchor, and UI-safe areas. Runtime tuning reads marker properties from this map rather than maintaining a separate magic-number copy.

See `docs/LIVING_ELBI_ARCHITECTURE.md`.

## Asset commands

```bash
npm run assets
npm run validate:assets
npm run validate:living
npm run validate:pixel-snap
npm run validate:determinism
```

`npm run assets` prefers native FastPack and OxiPNG when available. The repository also contains deterministic lossless development fallbacks so source generation can still be audited in constrained environments.

## Testing

```bash
npm run validate:syntax
npm run test:domain
npm run test:visual
npm run test:mobile
npm run test:living-visual
npm run validate:scope
```

Living visual QA writes deterministic screenshots under `test-artifacts/` for 1536 desktop, 1366 laptop, dark HUD, and mobile states. The Phaser renderer also supports frozen ambient motion for stable screenshot baselines.

## Local-first behavior

React writes to Dexie first. Cloud replay only runs when online, Supabase is configured, and a user is authenticated. The timer derives state from absolute timestamps rather than interval ticks, so browser throttling does not become the source of truth.

## Branding

ELBI Study Hub is an unofficial student-made study tool. Its app identity is original; the campus scene is UPLB-inspired and does not use a modified UP seal or treat the Oblation as the product logo.

## Pass 1.7 reports

- `docs/PASS1_7_IMPLEMENTATION_REPORT.md`
- `docs/PASS1_7_AUDIT.md`
- `docs/PIXEL_SNAPPER_PIPELINE.md`
- `docs/LIVING_ELBI_ARCHITECTURE.md`
