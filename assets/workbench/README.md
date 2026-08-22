# Pixel Snapper workbench

`assets/inbox/generated/` is the only automatic input to Pixel Snapper. Snapped PNGs land in `assets/workbench/snapped/` and are **not production source** until manually inspected and promoted into `assets/source/libresprite/`.

Never run Pixel Snapper automatically over finalized LibreSprite exports: it deliberately collapses detected cells to dominant colors and may destroy intentional single-pixel detail.
