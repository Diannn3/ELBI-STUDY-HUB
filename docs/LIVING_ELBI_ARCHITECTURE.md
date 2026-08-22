# Living Elbi architecture

## Goal

The campus is a **fixed place with a living atmosphere**. Motion responds to scene/time/weather/focus/accessibility state, never study progress.

## Render/source size

- master scene: **768×480**
- world grid: **16×16** (48×30)
- Phaser: pixel-art mode, antialias off, whole-pixel rounding

## Source layers

Large scene plates are kept separate from the sprite atlas:

```text
01_sky_base
05_haze
07_world_static
21_sun_dapple_1
21_sun_dapple_2
22_cloud_shadow
```

`rebuild_living_elbi.js` assembles them into an editable LibreSprite working document.

Small runtime sprite families are atlas packed:

- far/mid/near clouds
- palm frames
- canopy frames
- grass frames
- bird frames
- leaf variants
- rain streak
- existing small UI/environment props

## Tiled as tuning source

`assets/source/tiled/scene_living.tmj` stores marker geometry/properties for:

- `CLOUD_FAR_BAND`
- `CLOUD_MID_BAND`
- `CLOUD_NEAR_BAND`
- `LEAF_ZONE_LEFT`
- `LEAF_ZONE_RIGHT`
- `BIRD_PATH_HIGH`
- `RAIN_AREA`
- vegetation anchors
- `ANCHOR_OBLATION`
- UI safe zones

`tiledSceneTuning.ts` parses those properties. Runtime systems should prefer marker configuration over duplicated constants.

## Environment systems

```text
CampusScene
  └─ SceneDirector
      ├─ WindSystem
      ├─ CloudSystem
      ├─ VegetationSystem
      ├─ BirdSystem
      ├─ AmbientParticleSystem
      ├─ LightingSystem
      └─ ParallaxRig
```

### SceneDirector

Combines:
- scene preset: Bright / Local / Rainy
- time of day: Morning / Day / Golden / Night
- motion: Full / Subtle / Reduced
- OS/user reduced motion
- focus calm state

### Motion policy

Normal home defaults to **Subtle**. Focus Mode removes pointer parallax, suppresses birds, reduces environment motion, and keeps weather believable. Reduced motion disables/suppresses nonessential motion while leaving a complete static composition.

### Visibility policy

Nonessential environment simulation pauses while the document is hidden and resumes from current state. We deliberately do not replay missed birds, leaves, or wind after a long hidden-tab period. Focus timer state is separate and still derives from absolute timestamps.

## Visual QA

Dynamic screenshot tests use deterministic/frozen ambient state so cloud positions do not produce meaningless regression noise. Separate motion QA validates loops, wrapping, and effect density.
