# Elbi Study Hub — Visual Direction v2 (Pass 1.5)

## North star

**A vibrant, sunny pixel-art UPLB postcard that happens to be a study workspace.**

The home scene is a fixed 640×360 diorama inspired by the supplied frontal UPLB CAS/Oblation photograph. The scene is atmosphere and identity, not progression. Study activity never unlocks or mutates scenery.

## Composition contract

- Master scene: **640×360** RGBA, nearest-neighbor only.
- Center axis: x=320. The monument/CAS center must stay visually unobstructed.
- Desktop utility safe zone: right side, approximately x=466–620 in scene coordinates.
- Top utility safe zone: y=12–60.
- Mobile uses the same scene cropped/reframed above normal-flow UI; no separate mobile artwork.
- UI is React/DOM. Phaser owns only the scene and ambient pixel motion.

## Brand/UI palette

| Token | Value | Role |
|---|---:|---|
| UP Maroon | `#7B1113` | Primary controls, notice-board frame |
| Deep Maroon | `#5C1016` | Dark edge/shadow |
| Rich Maroon | `#9B111E` | Hover/emphasis |
| UP Forest Green | `#014421` | Selected/positive states |
| Green Mid | `#146B3A` | Secondary controls |
| UP Gold | `#FFB81C` | Small highlights, focus progress, key numbers |
| Cream | `#FFF9F1` | Main warm surface |
| Sand | `#F2E8DC` | Alternate surface/task rows |
| Charcoal | `#292725` | Main text |
| Muted | `#625B56` | Secondary text |

Gold is an accent, not a full-surface fill.

## Environmental palette

The campus is allowed to be natural and bright rather than recolored into brand maroon:

- sky: `#397FB8`, `#55A3D9`, `#7DB2E4`, `#A1C1E7`, `#CDE6F7`
- CAS: cool shadow → warm cream (`#91A39A` → `#FFF9F1`)
- roof: teal/UP-green-adjacent values (`#0A4F4C` → `#45A4A1`)
- lawn/foliage: dark forest to vivid yellow-green
- shadows: cool green/blue, never blur-filtered

The authored 640×360 composite is kept below 48 actually-used colors even though the combined scene/UI palette file contains additional UI-only colors.

## Typography

- Pixel/mono display face: headings, timer digits, tiny labels, CTA labels.
- Readable system sans: task titles, notes, settings, descriptions, dates.
- Never render long-form copy into Phaser or baked images.

## UI material language

Use campus-inspired physical metaphors sparingly:

- Today = maroon campus notice board with cream paper surface
- bottom dock = old campus radio/control console, cream with maroon top edge
- focus modal = planner card
- focus state = quiet cream console over dimmed scene
- wrap-up = cream reflection sheet

Avoid glassmorphism, giant rounded SaaS cards, generic gradients, emoji icons, and mixed border-radius systems.

## Pixel geometry

- Scene pixels are authored at native 640×360.
- Runtime uses nearest-neighbor filtering and integer-aligned positions.
- UI borders are 2–3 CSS pixels with hard shadows.
- Sprite rotation is disabled in FastPack.
- No lossy image compression.

## Scene layers

1. `01_sky`
2. `02_clouds`
3. `03_far_trees`
4. `04_cas`
5. `05_oblation`
6. `06_ground`
7. `07_mid_trees`
8. `08_props`
9. `09_foreground`
10. `10_lighting`

The large scene layers load directly in Phaser. FastPack is reserved for small reusable props, ambient sprites, and 16×16 UI art.

## Motion budget

Allowed:

- cloud layer: ±2 px slow drift
- one tiny bird occasionally crossing the sky
- rare leaf particles near the side trees
- tiny 2-frame/low-frequency authored loops later if needed

Not allowed:

- constant parallax carnival
- smooth high-frequency object bobbing
- gameplay-like environmental feedback tied to study time
- animation during reduced-motion mode

## Focus transition

Home is bright and inviting. Starting a focus session shifts the *presentation*, not the world state:

- scene brightness ↓ ~25%
- scene saturation ↓ ~20%
- navigation and stats disappear
- timer and current task dominate
- progress = UP Gold
- pause = Forest Green
- end = Maroon outline

## Branding/IP guardrail

The app identity remains original and explicitly unofficial. The campus/Oblation scene is a prototype scene, not the app mark. Do not use the UP seal or make the monument silhouette the product logo. Public distribution should retain the existing permission/brand-clearance gate documented in the main blueprint.

## Visual QA gates

Capture and review at minimum:

- 1440×900 Home
- 1920×1080 Home
- 390×844 Mobile Home
- Start Focus modal
- Focus Mode
- Wrap-up/TIL

Fail the visual gate if any of these occur:

- the central monument is covered by utility UI
- pixel art is blurred by scaling/filtering
- task/title contrast is poor
- gold text is used on cream
- controls sit directly over complex scenery without a surface
- mobile floats the desktop panel over a cramped scene instead of switching to normal flow
