# LibreSprite source workflow

LibreSprite is the authoring tool of record for Pass 1.

- `campus/01_sky.png` … `08_lighting.png` are lossless, transparent 320×180 source layers.
- `props/*.png` are reusable authored sprites.
- `scripts/rebuild_campus_hero.js` reconstructs the final hero pixel-by-pixel using LibreSprite's `Image.putPixel()` API.
- `../palettes/elbi-pass1.gpl` is the locked Pass-1 palette.

## In LibreSprite

1. Create/open a 320×180 RGBA sprite.
2. Run `scripts/rebuild_campus_hero.js` to reproduce the exact composite as pixels.
3. For layered editing, import each `campus/*.png` file as a layer in numeric order. Keep the names.
4. Save the working master as `campus_hero.libresprite` locally.
5. Export the runtime composite to `assets/exports/sprites/campus_hero.png`.

The repository intentionally keeps the layer PNGs and deterministic build script as portable source material. Generated atlases are not source-of-truth assets.
