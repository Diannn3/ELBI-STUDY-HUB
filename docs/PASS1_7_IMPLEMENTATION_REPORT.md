# Pass 1.7 implementation report

## Scope

Pass 1.7 consolidates the approved bright visual direction and introduces two production foundations:

1. SpriteFusion Pixel Snapper as a generated-art normalization workbench.
2. Living Elbi as a layered, dynamic 768×480 Phaser environment.

It does **not** add social, progression, AI, additional campus scenes, full Kanban, or study-driven scenery changes.

## Implemented

### Art/toolchain
- generated-art inbox and snapped workbench separation
- pinned native Pixel Snapper CI path plus transparent deterministic development fallback
- ELBI master `.hex` + `.gpl` palettes
- category presets and manifest/report generation
- manual promotion gate into LibreSprite source
- LibreSprite 768×480 Living Elbi assembly helper
- Tiled 48×30 scene/marker contract
- FastPack small-sprite atlas path
- OxiPNG release optimization path
- deterministic asset validation

### Living environment
- large 768×480 sky/world/lighting plates
- 3 far, 4 mid, 2 near cloud variants
- 4 palm, 4 canopy, 3 grass animation frames
- bird, leaf, rain assets
- moving cloud bands and wrap
- wind-driven vegetation
- rare birds/leaves
- rainy profile
- sunlight/dapple/cloud shadow system
- tiny pointer parallax
- mobile/reduced-motion suppression
- Bright / Local / Rainy scene presets
- Morning / Day / Golden / Night lighting profiles
- Focus calm mode
- hidden-tab ambient pause/resume

### UI/preferences
- Light HUD default
- Dark and Auto HUD
- Full/Subtle/Reduced ambient motion
- scene selection in Settings
- preferences persisted through Dexie schema migration and serialized for cloud sync
- Supabase migration for new preference fields

### Reliability fixes discovered during audit
- custom focus range corrected to 5–120 minutes
- React→Phaser preference race fixed by replaying latest bridge state to late subscribers
- Living lighting ternary defect fixed
- rain particle ramp/wrap hardened
- bird schedule constrained to intended 25–60 second range
- runtime tuning moved toward Tiled marker properties
- legacy static hero removed from active React/Phaser scene paths

## Verification performed in constrained environment

The repository contains both normal production tests and dependency-light verification paths. See `docs/PASS1_7_AUDIT.md` for the final commands/results.

## External constraint

The connected GitHub integration reported repository permissions but write operations returned HTTP 403 `Resource not accessible by integration`; direct network clone from the execution container was also unavailable. Work therefore continued in a real local Git working tree reconstructed from the Pass 1.5 bundle. The final bundle/patch can be applied to the canonical repository without replacing its history.
