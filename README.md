# Elbi Study Hub — Pass 1

A narrow, local-first UPLB/Elbi-inspired study companion built around one reliable loop:

**Campus Home → choose/create task → Start Focus → survive reload/background/offline → finish → Done/Continue/Blocked → TIL → history/stats update.**

This repository deliberately does **not** include Discord, social rooms, XP, achievements, avatar systems, multiple scenes, AI, full Kanban, or native desktop/mobile wrappers.

## What is implemented

- React 19 + TypeScript + Vite app architecture
- Phaser 4 world layer with a React↔Phaser event bridge
- one original 320×180 UPLB-inspired pixel campus hero scene
- real pixel source layers and a LibreSprite `Image.putPixel()` rebuild script
- Tiled `.tmj` source with scene layers, FX markers, and UI-safe interaction markers
- FastPack `.fpsheet` configuration (`phaser3`, trim, 1 px extrusion, aliases, rotation off)
- lossless PNG optimization stage
- Dexie/IndexedDB local database schema and reactive queries
- absolute-timestamp focus timer with pause/resume/natural finish/early end
- task creation/selection and 25/5, 50/10, Quiet 5, Custom, and Flow modes
- Done / Continue / Blocked wrap-up paths
- optional TIL note capture
- derived daily/weekly history stats
- local-first sync outbox plus Supabase serializer/replay layer
- migration-controlled Supabase schema and RLS policies
- PWA/service-worker configuration and persistent-storage request
- original generated Rainy Elbi / Night Insects / Quiet Room ambience loops
- reduced-motion behavior
- Vitest/Playwright/axe test definitions
- screenshot regression baseline path
- GitHub Actions CI definition
- Cloudflare Pages deployment instructions
- dependency-free `preview/` verification harness

## Quickest way to inspect it

The sandbox could not reach the npm registry, so a no-dependency preview harness is included and was used for visual/interaction QA.

### Windows

Double-click `start-preview.bat`, then open:

`http://127.0.0.1:4174/`

### macOS/Linux/WSL

```bash
python3 -m http.server 4174 -d preview
```

Then open `http://127.0.0.1:4174/`.

The preview uses IndexedDB when served normally and includes the service worker/offline shell.

## Full development setup

Requirements:

- Node 22+
- npm
- Python 3.13+ with Pillow for the deterministic asset scripts
- FFmpeg for rebuilding the original ambience `.ogg` files
- LibreSprite for manual pixel editing
- Tiled 1.12.x for `.tmj` editing
- FastPack CLI for production atlas packing
- OxiPNG for the explicit final lossless optimization stage
- Supabase CLI + Docker only when testing cloud migrations/RLS locally

```bash
npm install
npm run assets
npm run dev
```

### Quality commands

```bash
npm run validate:assets
npm run test:domain
npm run test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## Asset workflow

### Pixel art

Authoring source is under `assets/source/libresprite/`.

- `campus/*.png`: transparent editable layers
- `props/*.png`: reusable sprites
- `scripts/rebuild_campus_hero.js`: reconstructs the hero pixel-by-pixel inside LibreSprite
- `../palettes/elbi-pass1.gpl`: locked 44-color Pass-1 palette

The runtime hero currently uses only 37 colors.

### Tiled

Open `assets/source/tiled/elbi-study.tiled-project`, then `scene_home.tmj`.

The source has:

- BACKGROUND
- FAR_WORLD
- ARCHITECTURE
- GROUND
- PROPS_BACK
- PROPS_FRONT
- FOREGROUND
- LIGHTING
- FX_MARKERS
- INTERACTION_MARKERS

No external Tiled tileset `source` references are used.

### FastPack

`assets/source/atlas.fpsheet` is the committed packing contract.

```bash
fastpack pack --project assets/source/atlas.fpsheet
```

`npm run assets` automatically uses FastPack if the binary is available. In the sandbox, FastPack/OxiPNG executables were unavailable, so the script exercised a deterministic lossless development fallback while keeping the production FastPack/OxiPNG stage intact.

## Local-first behavior

The UI writes to Dexie first. Outbox replay only happens when:

1. the device is online,
2. Supabase is configured, and
3. a Supabase user is authenticated.

A local placeholder identity is replaced with the authenticated `auth.uid()` before cloud replay, so RLS ownership remains correct.

## Supabase

```bash
supabase start
supabase db reset
```

The Pass-1 migration enables RLS on every exposed table and creates per-operation ownership policies.

## Testing note

The managed Chromium available in the build sandbox has a system policy that blocks **all URL navigation**, including localhost. Because of that:

- domain/timer tests were executed normally;
- the full four-state UI was executed with Playwright using `page.set_content()` and a test-only in-memory persistence adapter;
- mobile/desktop screenshots were generated and visually reviewed;
- a real localhost IndexedDB/service-worker Playwright spec is included for CI/local execution, but could not be executed in this sandbox policy environment.

See `docs/PASS1_IMPLEMENTATION_REPORT.md` for the exact verification matrix.

## Branding

The application is an **unofficial student-made study tool**. Its app identity is original. The first scene is UPLB-inspired rather than using a modified UP seal or treating the Oblation as an app logo.
