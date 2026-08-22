# Pixel Snapper production pipeline

## Purpose

SpriteFusion Pixel Snapper is a **generated/external-art normalization gate**, not the final art editor. It regularizes an implicit pixel grid and optionally maps output to the ELBI palette before human review.

## Directory contract

```text
assets/reference/                  research/reference only
assets/inbox/generated/            untrusted generated/external inputs
assets/workbench/snapped/          normalized review outputs
assets/source/libresprite/         production art source
assets/source/tiled/               scene composition/markers
assets/exports/                    deterministic build exports
assets/generated/atlases/          disposable atlas products
public/assets/                     runtime assets
```

Nothing in `assets/inbox/generated` is eligible to ship directly.

## Presets

Defined in `scripts/assets/pixel_snap_presets.json`:

| Preset | Pixel-size override | Color target | Intended use |
|---|---:|---:|---|
| campus | 2 | 44 | 1536×960 concept → 768×480 workbench |
| cloud | 2 | 24 | cloud variants |
| foliage | 2 | 32 | vegetation bases/frames |
| prop | 4 | 24 | small environment props |
| icon | 4 | 16 | decorative pixel icons |

Production normalization uses explicit pixel size rather than depending on auto-detection after the visual grid is locked.

## Commands

```bash
npm run art:bootstrap-living
npm run art:snap
npm run art:snap:all
npm run art:snap:strict
npm run validate:pixel-snap
```

`--strict` requires the native `spritefusion-pixel-snapper` binary. CI always uses strict mode.

## Development fallback

`scripts/assets/pixel_snap.py` contains a deterministic nearest-neighbor + palette fallback for environments where the Rust binary cannot be installed. The manifest records which engine produced each file. The fallback is useful for directory/build verification but must not be represented as equivalent to SpriteFusion's implicit-grid detection.

## Promotion gate

Promotion from workbench into production source is intentionally manual. Use `scripts/assets/promote_snapped.py` / `npm run art:promote` only after checking:

1. pixel grid consistency,
2. silhouette/readability,
3. palette mapping,
4. unwanted color collapse,
5. transparency,
6. animation-frame coherence when applicable.

Final LibreSprite source must not be automatically re-normalized. Pixel Snapper's cell resampling is destructive to intentional one-pixel detailing and dithering.

## Palette

- `assets/source/palettes/elbi-master.hex` — CLI-friendly comma/line hex representation
- `assets/source/palettes/elbi-master.gpl` — LibreSprite/GIMP palette source

The palette intentionally contains UI brand colors (UP maroon/green/gold/cream) and environmental ramps for sky, foliage, concrete, stone, rain, and warm light.
