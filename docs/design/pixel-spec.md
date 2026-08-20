# Pixel specification — Pass 1.5

- Authoring canvas: **640×360 px** for the daytime CAS/Oblation hero scene.
- World grid: 16×16 px for composition/markers; unique architecture is not forced to tile boundaries.
- Nearest-neighbor / `image-rendering: pixelated` only.
- Runtime scaling: integer-preferred; responsive layout may crop/reframe rather than blur critical art.
- No anti-aliasing in authored sprites.
- Environment composite target: **≤48 actually-used colors**. Current composite uses 43.
- Combined scene/UI palette may include a few extra UI-only colors; current palette has 52 authored colors.
- Large unique architecture/monument/ground remain direct Phaser image layers.
- Repeated vegetation, props, birds/leaves, and UI icons are small sprites and may be FastPack-packed.
- Runtime procedural effects (slow cloud drift, occasional leaf/bird) are preferred over large authored animation sets.
- Reduced-motion disables all nonessential scene motion without changing layout or data.
