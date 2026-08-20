# LibreSprite source workflow — Pass 1.5

LibreSprite remains the authoring tool of record for the campus pixel scene.

- `campus_day/01_sky.png` … `10_lighting.png` are lossless transparent **640×360** source layers.
- `props/*.png` are reusable authored scene sprites.
- `ui/*.png` are original 16×16 UI icons.
- `scripts/rebuild_campus_hero.js` reconstructs the exact flattened hero pixel-by-pixel through LibreSprite's `Image.putPixel()` API.
- `../palettes/elbi-up-day.gpl` is the Pass-1.5 scene/UI palette.

## In LibreSprite

1. Create/open a 640×360 RGBA sprite.
2. Run `scripts/rebuild_campus_hero.js` if you need the exact current flattened composite.
3. For layered editing, import each `campus_day/*.png` file as a layer in numeric order and preserve the names.
4. Save the working master locally as `campus_day.libresprite`.
5. Export the flattened runtime reference to `assets/exports/sprites/campus_hero.png`.
6. Keep large scene layers separate for Phaser; only small reusable props/UI art go through FastPack.

The repository intentionally keeps portable layer PNGs plus a deterministic pixel rebuild script. Generated atlases are disposable build artifacts, not source-of-truth art.
