# Pixel specification

- Authoring canvas: 320×180 px for the hero scene.
- World grid: 16×16 px.
- Nearest-neighbor / `image-rendering: pixelated` only.
- Runtime scaling: integer-preferred; CSS layout may crop rather than resample critical art.
- No anti-aliasing in authored sprites.
- Main palette target: 40 colors max in Pass 1.
- Large unique architecture can remain a hero layer; repeated vegetation/props are separate sprites.
- Runtime procedural effects (rain, fireflies, drift) are preferred over large authored animation sets.
