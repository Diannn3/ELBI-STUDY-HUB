# ELBI Study — Reference-Locked Pixel UI

This build recreates the supplied ELBI Study home-screen reference as a real React UI while keeping the campus scene and interface language pixel-art based.

## Visual target

- full-screen UPLB/Elbi pixel campus
- transparent navigation over the sky
- cream + maroon Today board on the right
- floating cream study/radio dock at the bottom
- UP maroon / forest green / gold accents
- default **Light HUD**, with **Dark** and **Auto** options in Settings
- no generic rounded SaaS cards, glassmorphism or dark-HUD-only treatment

See `docs/reference/home-target.png` and `docs/REFERENCE_REBUILD_SPEC.md`.

## Preview images

- `docs/reference-rebuild-preview.png` — 1586×992 target-size preview
- `docs/reference-rebuild-preview-1366.png` — 1366×768 laptop preview
- `docs/reference-rebuild-preview-dark.png` — optional dark HUD preview

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Rebuild deterministic pixel helper assets

Requires Pillow:

```bash
python scripts/build-reference-assets.py
```

This prepares:

- `public/campus-reference-pixel.png`
- `public/ui/tree-logo.png`

The helper does not generate AI imagery. It reuses the existing pixel-style campus artwork, extends the sky without resampling the scene, and draws the small tree mark from hard-edged pixel primitives.

## Core visual files

- `src/index.css`
- `src/App.tsx`
- `src/pages/Campus.tsx`
- `src/components/TopNav.tsx`
- `src/components/TodayBoard.tsx`
- `src/components/StudyDock.tsx`
- `src/components/FocusMode.tsx`
- `src/components/ui/Board.tsx`
- `src/components/ui/PixelButton.tsx`
- `src/components/ui/PixelIcon.tsx`

## Timer reliability

This prototype now derives elapsed time from absolute timestamps instead of trusting one `setInterval` tick per second. Timer state is also persisted locally so background throttling and reloads are less likely to corrupt an active block. The canonical ELBI Study Hub should still keep Dexie/IndexedDB as its real local-first persistence layer.
