# ELBI Study — Reference-Locked Pixel UI Rebuild

## Goal
Recreate `docs/reference/home-target.png` as closely as practical while preserving a real, responsive application and a pixel-art campus scene. The reference controls composition and hierarchy; the implementation remains original code and reusable UI.

## Locked composition
- Full-screen pixel campus world.
- Transparent top navigation over sky.
- Brand lockup top-left.
- Main nav top-right.
- Tall cream/maroon Today board at the right edge.
- Floating cream study dock across the bottom.
- Oble/CAS remains unobstructed by task UI.
- Light HUD is the default. Dark and Auto are optional settings.

## Reference proportions at 1586×992
Approximate anchors used by the responsive CSS:
- outer frame: 8–10 px
- top chrome: ~112 px
- Today board: x≈1160, y≈146, width≈378, bottom≈822
- dock: ~28 px horizontal margin, ~110–130 px high
- campus scene always fills the whole framed viewport

## Pixel rules
- Runtime campus art is `public/campus-reference-pixel.png`.
- It is never bilinear-scaled intentionally; `image-rendering: pixelated` is set.
- UI icons are hand-authored 8×8 glyph matrices in `src/components/ui/PixelIcon.tsx`.
- Decorative corners, borders and ornaments use hard integer-like CSS geometry instead of soft/rounded SaaS cards.
- No glassmorphism, generic pill navigation, or rounded-card dashboard language.

## HUD theme
Default: Light
- paper: #FDF7EB / #FFF9F1
- deep maroon: #5C1016
- UP maroon: #7B1113
- UP green: #014421
- gold: #F5B335
- body text: #292725

Optional Dark uses the same maroon/gold/green hierarchy on charcoal/maroon paper.
Auto follows `prefers-color-scheme`.

## Files changed for the recreation
- `src/App.tsx` — true full-frame overlay architecture and theme resolution.
- `src/pages/Campus.tsx` — scene-first home composition.
- `src/components/CampusScene.tsx` — pixel reference scene.
- `src/components/TopNav.tsx` — reference-positioned transparent nav.
- `src/components/TodayBoard.tsx` — reference-matched Today panel.
- `src/components/StudyDock.tsx` — reference-matched bottom status/radio console.
- `src/components/FocusMode.tsx` — matching theme-aware focus console.
- `src/components/ui/Board.tsx` — reusable framed paper language.
- `src/components/ui/PixelButton.tsx` — pixel chrome buttons.
- `src/components/ui/PixelIcon.tsx` — hand-authored icon language.
- `src/index.css` — complete responsive visual system.
- `src/contexts/StudyContext.tsx` — absolute timestamp timer + local prototype recovery.
- `src/pages/Settings.tsx` — Light / Dark / Auto HUD selector.
- `scripts/build-reference-assets.py` — deterministic pixel asset preparation.

## Responsive gates
### Desktop 1586×992 / 1920×1080
Matches the reference composition most closely.

### Laptop 1366×768
A compact-height media query reduces Today card heights, title spacing and dock height so Start Focus remains visible without scrolling.

### Tablet/mobile
The campus becomes a top hero strip; Today moves into normal document flow. The dock simplifies but remains persistent.

## Functional guarantees preserved/improved
- Today task select/create behavior remains real.
- Start Focus remains wired to the existing study flow.
- Timer uses absolute timestamps instead of trusting one decrement per second.
- Focus timer survives background throttling and local prototype reloads better through persisted timestamps.
- Reduced motion removes ambient bird motion.
- Light/Dark/Auto HUD is independent of the campus scene.

## Visual QA files
- `docs/reference-rebuild-preview.png` — 1586×992 reconstruction preview.
- `docs/reference-rebuild-preview-1366.png` — 1366×768 compact-height preview.
- `docs/reference-rebuild-preview-dark.png` — optional dark HUD preview.
- `docs/reference/home-target.png` — user-supplied visual target, reference-only.
