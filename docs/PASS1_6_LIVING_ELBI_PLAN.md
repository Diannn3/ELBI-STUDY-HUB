Yes. I’d change the background from a **single static “pixel picture”** into an actual **living pixel diorama** built from layers. The important distinction is that “dynamic” should mean *the campus breathes*—clouds drift, leaves sway, light changes, birds occasionally cross the sky—not that the environment turns into a distracting game.

That fits the blueprint well: it already calls for one polished fixed scene with minimal ambient loops, explicitly allows time-of-day/weather overlays to reuse the same base art, and recommends Phaser particles/tweens for cheap ambience instead of drawing everything frame-by-frame.

# The new target

I’d rebuild the entire scene so it visually resembles the reference you just attached:

**bright blue sky → huge dimensional pixel clouds → dense green trees framing the sides → CAS/Oblation centered → rich lawn and foreground → very high color depth → light cream HUD floating over it.**

The difference from what we have now is that it will no longer be:

```text
one big campus-background.png
```

It becomes:

```text
ELBI CAMPUS DIORAMA

SKY
↓
FAR CLOUDS
↓
NEAR CLOUDS
↓
DISTANT TREE LINE
↓
CAS
↓
OBLATION
↓
MID TREES + PALMS
↓
LAWN + SHRUBS
↓
FOREGROUND TREES / PLANTERS
↓
AMBIENT FX
↓
LIGHTING
```

Each layer can move or change independently.

---

# 1. I would redraw the background at a different master resolution

I would **not** keep using the current large flattened background asset.

For this specific reference, I'd change our art master from the old 640×360 concept to approximately:

## **768 × 480**

That gives us a **16:10** composition, extremely close to the shape of the UI reference you like.

It is also divisible cleanly by our underlying pixel grid:

```text
768 / 16 = 48 tiles
480 / 16 = 30 tiles
```

That gives LibreSprite enough room for:

- detailed architecture
- expressive trees
- layered clouds
- recognizable Oble silhouette
- flower beds
- palm fronds
- CAS windows
- grass clusters

without making the source art basically ordinary high-resolution illustration.

The blueprint already says we can use either a 16×16 world scale or 32×32 when architecture needs additional detail, as long as we don't casually mix scales.

For this scene I'd use:

```text
WORLD GRID
16 × 16

ARCHITECTURE MODULES
32 × 32 / multiples thereof

SMALLEST INTENTIONAL DETAIL
1 source pixel
```

---

# 2. We rebuild the scene from zero around the reference

I would treat the screenshot/photo/reference as the **composition guide**, but the actual final artwork remains hand-built pixel art.

We don't:

```text
photo
↓
Photoshop pixel filter
↓
done
```

We do:

```text
reference
↓
composition analysis
↓
pixel blockout
↓
architecture pass
↓
vegetation pass
↓
lighting
↓
manual cleanup
↓
animation layers
```

LibreSprite remains the actual source-of-truth editor as our blueprint specifies.

---

# 3. Exact LibreSprite layer architecture

I'd structure the new source scene approximately like this:

```text
campus_home_day/
│
├── 00_REFERENCE
│
├── 01_SKY_BASE
│
├── 02_CLOUDS_FAR
├── 03_CLOUDS_MID
├── 04_CLOUDS_NEAR
│
├── 05_MOUNTAIN_HAZE
├── 06_TREE_LINE_FAR
│
├── 07_CAS_BACK
├── 08_CAS_DETAILS
├── 09_CAS_SHADOWS
│
├── 10_OBLATION
├── 11_OBLATION_PEDESTAL
│
├── 12_PALMS_BACK
├── 13_TREES_MID
├── 14_SHRUBS
│
├── 15_GROUND
├── 16_PATH
├── 17_STAIRS
├── 18_FLOWERS
│
├── 19_FOREGROUND_LEFT
├── 20_FOREGROUND_RIGHT
│
├── 21_LIGHTING_BASE
├── 22_SUN_PATCHES
│
└── 23_FX_REFERENCE
```

The layers aren't only useful for editing.

They become actual **runtime depth layers**.

---

# 4. The sky is going to be the most important dynamic element

Your reference has a massive sky.

That is fantastic because sky movement produces a huge perceived increase in “life” without creating much additional art.

I would build **three cloud depth bands**.

| LayerSizeSpeedBehavior |        |                 |                                    |
| ---------------------- | ------ | --------------- | ---------------------------------- |
| Far clouds             | small  | extremely slow  | mostly background depth            |
| Mid clouds             | medium | slow            | main visible motion                |
| Near clouds            | large  | slightly faster | occasional foreground cloud masses |

The clouds aren't one giant repeating texture.

I'd create maybe:

```text
cloud_far_01
cloud_far_02
cloud_far_03

cloud_mid_01
cloud_mid_02
cloud_mid_03
cloud_mid_04

cloud_near_01
cloud_near_02
```

Then Phaser distributes them across a wider sky.

---

# 5. Cloud movement

Cloud movement should be **almost subliminal**.

Something like:

```text
FAR CLOUDS
1 pixel / ~1.5–2.5 sec

MID CLOUDS
1 pixel / ~0.7–1.2 sec

NEAR CLOUDS
1 pixel / ~0.4–0.8 sec
```

Not:

> CLOUDS ZOOMING ACROSS SCREEN ☁️☁️☁️

The user should notice after ten seconds that:

> wait... the sky is actually moving.

That's the vibe.

Phaser's tween system can continuously change sprite positions, supports repeats/yoyo/delays, and can operate on arbitrary properties. ([Phaser Documentation](https://docs.phaser.io/phaser/concepts/tweens "https://docs.phaser.io/phaser/concepts/tweens"))

Because we'll configure Phaser for pixel art, movement remains integer-snapped instead of turning those clouds blurry.

Phaser specifically recommends `pixelArt: true` for pixel games; it switches off texture antialiasing and enables whole-pixel rendering. ([Phaser Documentation](https://docs.phaser.io/api-documentation/4.0.0/typedef/types-core "https://docs.phaser.io/api-documentation/4.0.0/typedef/types-core"))

---

# 6. Clouds wrap rather than disappear

When a cloud leaves the right side:

```text
                 ☁️
────────────────────>
```

it gets moved to:

```text
☁️
<────────────────────
```

with:

- a random Y within its band
- randomized gap
- optional variant
- same speed family

So the system can run indefinitely.

We don't need a 10-minute cloud animation file.

---

# 7. Slight cloud vertical movement

Some clouds can also shift:

```text
y = y0
   ↓
y0 + 1 px
   ↓
y0
```

over something like **8–20 seconds**.

Extremely subtle.

This helps prevent the background from looking like PNGs sliding sideways.

---

# 8. Parallax depth

This is where the whole scene will start looking MUCH richer.

Tiled already has native concepts for parallax factors. A value below 1 moves a layer more slowly than the camera, making it appear farther away. ([Tiled Documentation](https://doc.mapeditor.org/en/stable/manual/layers/ "https://doc.mapeditor.org/en/stable/manual/layers/"))

I would define something like:

| LayerParallax  |        |
| -------------- | ------ |
| Sky            | `0.00` |
| Far clouds     | `0.03` |
| Mid clouds     | `0.06` |
| Far trees      | `0.10` |
| CAS            | `0.16` |
| Oble           | `0.18` |
| Mid vegetation | `0.25` |
| Foreground     | `0.40` |

However—and this is important—

## the camera itself barely moves.

Maybe maximum:

```text
± 2–3 source pixels
```

based on pointer position.

So when you move your cursor:

```text
LEFT EDGE

foreground → 3 px
CAS        → 1 px
clouds     → almost nothing
```

It produces depth without making the user seasick.

---

# 9. Pointer parallax is optional

I'd actually expose:

```text
Ambient Motion

[ Full ]
[ Subtle ]
[ Off ]
```

The default would be **Subtle**.

During Focus Mode:

```text
pointer parallax = disabled
```

because the scene should become calmer.

This also aligns with the blueprint: entering Focus should collapse navigation and make the scene calmer rather than more active.

---

# 10. Tree animation should NOT animate whole trees

This is important for visual quality.

If the full tree sprite rocks left/right:

> it will look like the tree trunk is made of rubber 😭

Instead:

```text
STATIC

tree trunk
main branches
large canopy silhouette

ANIMATED

outer leaf cluster A
outer leaf cluster B
small top cluster
```

The animated overlays can shift:

```text
FRAME 1
neutral

FRAME 2
outer leaves +1px

FRAME 3
different cluster +1px

FRAME 4
neutral
```

at around:

**4 fps or slower**.

The blueprint recommends roughly **4–8 fps authored loops** for leaves/rain/flags/screens.

---

# 11. Palm fronds

The palms around CAS are ideal animation candidates.

Each palm:

```text
TRUNK
static

FROND GROUP
3–4 frame loop
```

Possible loop:

```text
A
B
C
B
A
```

at maybe:

```text
3–4 fps
```

with different start delays.

Otherwise every palm sways simultaneously and it looks robotic.

---

# 12. Wind state

Instead of each animation having unrelated speeds, I would introduce a tiny global environmental state:

```ts
WindState {
  strength: 0..1
  direction: -1 | 1
}
```

That state influences:

```text
cloud speed
leaf frequency
palm animation speed
tree canopy animation
grass motion
```

For example:

### Calm

```text
clouds       0.5×
leaves       rare
palms        slow
grass        nearly static
```

### Breezy

```text
clouds       1×
leaves       occasional
palms        normal
grass        subtle
```

No storms by default.

---

# 13. Grass

The huge lawn should mostly remain static.

I would animate maybe **5–10%** of it.

Create:

```text
grass_wind_01
grass_wind_02
grass_wind_03
```

Tiny 4×4 / 8×8 clusters.

Only sparse areas change frames.

Otherwise shimmering grass becomes visual noise.

---

# 14. Leaves

This is where Phaser particles are useful.

The engine's `ParticleEmitter` maintains a pool of particles and allows randomized positions, speed and properties at emission. ([Phaser Documentation](https://docs.phaser.io/api-documentation/4.0.0/class/gameobjects-particles-particleemitter "https://docs.phaser.io/api-documentation/4.0.0/class/gameobjects-particles-particleemitter"))

Create maybe:

```text
leaf_green_01
leaf_green_02
leaf_gold_01
```

Then:

```text
spawn every 2–7 seconds

max alive:
5–8

movement:
slow diagonal fall

rotation:
none or 90° frame changes
```

You don't need 100 leaves.

Three moving leaves can sell the effect surprisingly well.

---

# 15. Birds

I definitely want these.

But rarely.

Maybe every:

**25–60 seconds**

spawn:

```text
bird
or
2–4 bird flock
```

High in the sky.

Animation:

```text
frame 1: wings up
frame 2: straight
frame 3: down
frame 2
```

at about:

```text
5–7 fps
```

A flock passes across the screen in around:

```text
10–18 seconds
```

Then disappears.

Because it doesn't happen constantly, users will occasionally notice it and the scene feels less mechanical.

---

# 16. Clouds can cast extremely subtle shadows

Optional polish.

When a large near cloud passes:

```text
cloud-shadow layer
```

could slide slowly across:

- lawn
- building

at maybe:

```text
4–7% opacity
```

Not a real lighting simulation.

Just a low-alpha cool overlay.

That would make the scene feel incredibly alive.

---

# 17. Sunlight flicker

Trees create dappled light.

We could make a:

```text
sun_dapple_overlay.png
```

with little patches of warm highlight.

Then cycle perhaps:

```text
sun_dapple_A
sun_dapple_B
```

every:

```text
6–12 seconds
```

at low opacity.

The user shouldn't consciously see it animate.

The scene should simply feel less frozen.

---

# 18. Building animations

CAS should almost completely remain still.

That's important.

Do NOT animate:

```text
building
roof
windows
Oble
stairs
```

Potential micro-animation later:

```text
one window reflection
flag if visible
tiny distant person
```

But architecture remaining static gives the scene visual stability.

---

# 19. Tiny campus life

Once the environment works, we could add **tiny non-interactive student silhouettes**.

Not yet as characters.

Something like:

```text
student_walk_A
student_walk_B

student_sit
student_bike
```

Spawn:

```text
once every 20–90 seconds
```

Maybe someone slowly crosses CAS.

Maybe one cyclist passes.

Maybe someone sits.

That would add huge charm.

But I'd put it **after clouds / vegetation / lighting**, because those already give us most of the benefit.

---

# 20. No pathfinding system

Important scope decision.

We do not create:

```text
NPC AI
collision maps
navigation
behavior trees
```

A student simply follows:

```text
PATH_A
PATH_B
PATH_C
```

in Tiled.

Example:

```text
WALK_PATH_FRONT_CAS
```

Phaser tween:

```text
start
↓
walk across
↓
despawn
```

That's enough.

---

# 21. New Tiled structure

Tiled becomes much more important after this redesign.

I would create:

```text
HOME_DAY
│
├── SKY
│   ├── SKY_BASE
│   ├── CLOUD_FAR
│   ├── CLOUD_MID
│   └── CLOUD_NEAR
│
├── FAR_WORLD
│   ├── TREE_LINE
│   └── HAZE
│
├── ARCHITECTURE
│   ├── CAS
│   ├── OBLATION
│   └── STAIRS
│
├── MID_WORLD
│   ├── PALMS
│   ├── TREES
│   ├── SHRUBS
│   └── GROUND
│
├── FOREGROUND
│   ├── LEFT_TREE
│   ├── RIGHT_TREE
│   └── PLANTERS
│
├── FX_MARKERS
│   ├── LEAF_ZONE_LEFT
│   ├── LEAF_ZONE_RIGHT
│   ├── BIRD_PATH
│   ├── CLOUD_SPAWN
│   └── CLOUD_DESPAWN
│
├── NPC_PATHS
│
└── UI_SAFE_ZONES
```

---

# 22. This is a much better use of Tiled parallax

Tiled group-layer parallax applies automatically to child layers, so we can define depth by group rather than manually editing every object.

For example:

```text
SKY
parallax = 0.02

FAR_WORLD
parallax = 0.10

ARCHITECTURE
parallax = 0.16

MID_WORLD
parallax = 0.25

FOREGROUND
parallax = 0.40
```

That will keep our source scene understandable.

---

# 23. Phaser architecture

I would replace a monolithic `CampusScene.ts` with:

```text
game/
│
├── scenes/
│   └── CampusScene.ts
│
├── environment/
│   ├── SceneDirector.ts
│   ├── ParallaxRig.ts
│   ├── CloudSystem.ts
│   ├── WindSystem.ts
│   ├── VegetationSystem.ts
│   ├── BirdSystem.ts
│   ├── AmbientParticleSystem.ts
│   ├── LightingSystem.ts
│   └── WeatherSystem.ts
│
└── config/
    └── sceneProfiles.ts
```

This prevents `CampusScene.ts` from becoming a 1,000-line mess.

---

# 24. SceneDirector

This is the controller.

Conceptually:

```ts
SceneDirector {
  weather
  timeOfDay
  focusState
  motionPreference
  wind

  update()
}
```

It tells the other systems what state the environment is in.

For example:

```text
NORMAL HOME

Cloud speed      1.0
Trees            1.0
Birds            yes
Leaves           yes
Pointer parallax yes
```

Then:

```text
FOCUS

Cloud speed      0.45
Trees            0.50
Birds            no
Leaves           rare
Pointer parallax no
```

This makes Focus actually feel calmer.

---

# 25. Day/night system — but only after sunny daytime works

Eventually we can make:

```text
AUTO TIME OF DAY
```

without creating four completely separate scenes.

The blueprint explicitly suggests reusing the same scene with time/weather overlays.

I would make:

```text
MORNING
DAY
GOLDEN HOUR
NIGHT
```

But they are not separate CAS drawings.

They share:

```text
CAS
Oble
trees
ground
props
```

and replace/tint:

```text
sky palette
cloud palette
lighting overlay
window lights
ambient FX
```

---

# 26. Time-of-day lighting

Possible progression:

### 06:00–08:00

```text
soft pale blue
warm side lighting
mist
```

### 08:00–16:30

```text
reference-style bright blue
high contrast
vivid greens
```

### 16:30–18:30

```text
golden sky
orange highlights
cool shadows
```

### Evening

```text
blue-violet sky
window lamps
less saturated foliage
```

No need for continuous 24/7 physically accurate lighting.

We can crossfade between four authored visual states.

---

# 27. But default stays exactly like the bright reference

Important.

I would NOT turn Auto into default immediately.

Default:

## **Bright Elbi**

because that's the aesthetic you like.

Settings later:

```text
SCENE

○ Bright Elbi
○ Follow local time
○ Rainy Elbi
```

---

# 28. Rainy Elbi

After the sunny system is solid, rain becomes surprisingly cheap.

We already have:

```text
base scene
```

Then:

```text
blue-gray lighting overlay
cloudier sky
rain particles
wet-ground highlights
rain ambience
tree animation faster
bird spawning disabled
```

The blueprint already names Rainy Elbi as a same-base-scene preset rather than a new unlockable world.

---

# 29. Rain particles

Rain should be procedural, not an enormous sprite sheet.

Something like:

```text
particle texture:
1 × 4 pixel streak

particle count:
~80 desktop
~35 mobile

angle:
slight diagonal

lifespan:
~800–1200 ms
```

One Phaser emitter handles it.

---

# 30. Focus Mode and weather

If the user starts focusing while it's raining:

we don't suddenly turn rain off.

Instead:

```text
Rain continues
↓
particle density reduced
↓
UI disappears
↓
camera parallax disabled
↓
ambient motion slows
```

So the environment stays believable while becoming less distracting.

---

# 31. Motion profiles

I want three internal motion presets:

| EffectFullSubtleReduced |   |        |                     |
| ----------------------- | - | ------ | ------------------- |
| Clouds                  | ✓ | ✓ slow | almost static       |
| Trees                   | ✓ | slow   | static              |
| Palms                   | ✓ | slow   | static              |
| Leaves                  | ✓ | rare   | off                 |
| Birds                   | ✓ | rare   | off                 |
| Pointer parallax        | ✓ | tiny   | off                 |
| Dappled light           | ✓ | tiny   | static              |
| Rain                    | ✓ | ✓      | static/very reduced |

The browser exposes `prefers-reduced-motion` specifically so apps can minimize nonessential motion when the user requests it.

Our app setting overrides Auto if the user explicitly chooses something.

---

# 32. Pixel rendering configuration

Phaser:

```ts
const config = {
  pixelArt: true,
  antialias: false,
  roundPixels: true,
}
```

Phaser 4's documentation explicitly says `pixelArt` disables antialiasing and enables whole-pixel rendering to preserve hard pixel edges.

Camera:

```ts
camera.roundPixels = true
```

Phaser's camera documentation specifically notes this helps avoid subpixel aliasing in pixel-art games.

---

# 33. No continuous CSS movement for world assets

React/CSS should continue handling the HUD.

Phaser handles:

```text
sky
clouds
world
weather
ambient movement
```

Exactly as the blueprint recommends: Phaser is the ambient world layer while DOM remains the productivity interface.

This matters because trying to animate twenty PNG layers with React state would be dumb.

---

# 34. Asset strategy

Large scene layers:

```text
do NOT pack into atlas
```

Examples:

```text
sky_base.png
cas.png
ground.png
foreground_left.png
foreground_right.png
```

Small repeating assets:

```text
FastPack
```

Examples:

```text
cloud variants
birds
leaves
grass animation
palm overlays
small tree overlays
NPCs
```

Our blueprint already treats FastPack-generated atlases as disposable runtime output while original source assets remain recoverable.

---

# 35. Animation source strategy

There should be three animation types.

### Type A — authored

LibreSprite:

```text
palms
tree clusters
birds
tiny NPCs
```

### Type B — procedural

Phaser:

```text
cloud position
leaves
rain
parallax
light overlay
```

### Type C — visual state

SceneDirector:

```text
time of day
weather
focus mode
motion preference
```

That's clean.

---

# 36. We should NOT use heavy shaders initially

Phaser 4.2 added things like Mesh2D, stencil rendering, additional tint capabilities and new lighting functionality.

Cool.

But I don't think we need most of it.

Using complicated fragment shaders for:

```text
clouds
grass
sky
```

would make the system harder to maintain and less authentically pixel-art.

I'd reserve shaders for a future effect if there's a clear benefit.

The majority should be:

```text
sprites
frame animation
particles
tweens
alpha overlays
```

---

# 37. Performance budget

I'd give ourselves an explicit budget.

### Desktop target

```text
60 FPS rendering
```

even though authored animations themselves may run at 4–8 fps.

### Mobile

```text
30–60 FPS rendering
```

depending on device.

### Maximum simultaneously active ambient things

Roughly:

```text
2–4 cloud sprites
3–6 animated vegetation overlays
0–8 leaves
0–4 birds
0–2 NPCs
1 lighting overlay
```

Rain is the obvious exception because particles are tiny.

---

# 38. Don't update React every frame

Absolutely essential.

Bad:

```text
Phaser cloud moves

↓ every frame

React state update

↓
rerender
```

No.

Phaser owns animation entirely.

React only sends occasional commands:

```text
FOCUS_STARTED
FOCUS_ENDED
MOTION_MODE_CHANGED
WEATHER_CHANGED
SCENE_CHANGED
```

---

# 39. Background-tab behavior

Browsers normally pause `requestAnimationFrame()` callbacks when tabs are hidden to save battery.

That's fine.

When the user leaves for 30 minutes, we do **not** simulate:

> 30 minutes worth of missed leaves and birds 😭

On `visibilitychange`:

```text
hidden

pause nonessential environmental systems

visible

re-read:
current time
weather preference
motion setting

resume from current state
```

The Page Visibility API exists specifically to detect that the app became hidden/visible.

Timer logic remains totally separate and continues using absolute timestamps.

---

# 40. Audio integration

Dynamic scene and sound should feel synchronized.

For example:

### Bright Elbi

```text
light breeze
birds
distant campus
```

### Rainy Elbi

```text
rain
leaves
distant thunder maybe extremely rare
```

### Night

```text
insects
soft wind
```

But environment animation must not require audio.

Mute:

```text
visuals continue
```

---

# 41. Dynamic intensity must never respond to study progress

Important because we previously removed that concept.

Never:

```text
50 sessions
↓
more flowers
↓
more birds
↓
prettier campus
```

No.

Dynamic environment responds only to:

```text
time
weather preset
focus state
motion preference
```

The blueprint explicitly says visible progress lives in tasks/history/statistics while the scene itself remains stable.

---

# 42. Exact art-production order

I'd execute the visual portion like this:

### Art Pass 1

Sky only.

Make the blue sky/cloud composition look amazing.

### Art Pass 2

CAS/Oble silhouette.

### Art Pass 3

Architecture details.

### Art Pass 4

Tree framing.

### Art Pass 5

Palms and foliage.

### Art Pass 6

Lawn / stairs / flowers / foreground.

### Art Pass 7

Lighting.

### Art Pass 8

Extract dynamic cloud sprites.

### Art Pass 9

Extract vegetation animation overlays.

### Art Pass 10

Create birds/leaves.

### Art Pass 11

Manual pixel cleanup.

Only then does runtime integration begin.

---

# 43. Runtime implementation order

After static art matches the reference:

```text
STATIC DIORAMA

↓

Phaser layered renderer

↓

cloud drift

↓

tree + palm loops

↓

leaves

↓

birds

↓

tiny parallax

↓

lighting

↓

Focus motion reduction

↓

Reduced Motion

↓

optional Rainy Elbi
```

Not all simultaneously.

That makes visual regressions easy to isolate.

---

# 44. New likely folder structure

```text
assets/source/libresprite/campus-day/
├── campus_day.lesprite
├── sky/
├── architecture/
├── vegetation/
├── foreground/
├── animation/
└── fx/

assets/exports/campus-day/
├── scene/
│   ├── sky.png
│   ├── cas.png
│   ├── oblation.png
│   ├── ground.png
│   └── foreground.png
│
└── sprites/
    ├── clouds/
    ├── leaves/
    ├── palms/
    ├── birds/
    └── vegetation/

assets/source/tiled/
└── campus_home.tmj

src/game/environment/
├── SceneDirector.ts
├── CloudSystem.ts
├── ParallaxRig.ts
├── WindSystem.ts
├── VegetationSystem.ts
├── ParticleSystem.ts
├── BirdSystem.ts
├── WeatherSystem.ts
└── LightingSystem.ts
```

---

# 45. Tiled properties

I'd store settings directly on layer/object properties.

Example:

```text
cloud_mid

speedMin = 3
speedMax = 5
parallax = 0.06
wrap = true
```

Or:

```text
LEAF_ZONE_LEFT

spawnMinMs = 3000
spawnMaxMs = 8000
maxParticles = 5
windInfluence = 0.8
```

So environmental tuning doesn't require editing source code every time.

---

# 46. Debug panel

Development only:

```text
SCENE DEBUG

Wind
[-----●----]

Cloud speed
[---●------]

Leaves
ON

Birds
ON

Parallax
ON

Time
DAY

Weather
CLEAR
```

That makes tuning massively easier.

This never ships as a prominent user interface.

---

# 47. Automated testing

Playwright screenshots need to capture deterministic versions.

Therefore animation tests run with something like:

```text
?motion=freeze
```

That tells SceneDirector:

```text
cloud position fixed
birds off
particles off
vegetation frame = 0
```

Then screenshot comparison is stable.

Otherwise visual-regression tests fail because a cloud moved 3 pixels.

---

# 48. Separate animation QA

We then record short tests:

```text
30s desktop normal
30s Focus
30s reduced motion
30s mobile
30s rainy
```

Check:

- stutters
- sprite popping
- cloud seams
- blurred pixels
- excessive movement
- FPS
- memory growth

The blueprint already makes visual testing at 1366×768, 1920×1080, tablet and \~390×844 mobile part of the test baseline.

---

# 49. Desktop versus mobile effects

Desktop:

```text
full clouds
vegetation
birds
leaves
tiny parallax
```

Mobile:

```text
clouds
vegetation

birds less frequent
leaves reduced
pointer parallax off
```

Low-power/reduced-motion:

```text
clouds very slow
everything else static
```

The static scene itself still has to look beautiful, because motion is polish—not a requirement for the artwork to work.

---

# 50. What I expect it to feel like

When you open the page:

at first:

> “damn that's a nice pixel-art UPLB scene.”

Then after five seconds:

> “wait, those clouds are moving.”

Then:

> “the palms are moving too.”

Then maybe forty seconds later:

> “oh a bird just passed.”

That's exactly the type of environmental life I want.

Not:

> LOOK GUYS THE BACKGROUND IS ANIMATED!!!!!!!

The animation should reward noticing.

---

# Revised scene philosophy

The blueprint originally describes the scene as a fixed diorama with a few depth layers and ambient loops rather than a walkable campus. That remains exactly correct.

I'm just upgrading **“fixed scene”** to mean:

> **fixed place, living atmosphere.**

So:

```text
❌ evolving campus
❌ unlockable world
❌ walkable RPG
❌ world progression

✅ layered pixel diorama
✅ moving clouds
✅ swaying vegetation
✅ rare birds/leaves
✅ subtle parallax
✅ weather
✅ lighting changes
✅ focus-aware calm mode
```

That is the version I would build.

## Implementation milestone

I would call this new milestone:

# **Pass 1.6 — Living Elbi**

And I would not call it complete until the **static scene by itself matches the lush reference**, then the dynamic systems enhance it without distracting from the Today panel and Start Focus button.

The actual work sequence I'd use is:

**Static reference-quality scene → layered source → Tiled depth map → Phaser renderer → clouds → vegetation → particles/birds → subtle parallax → lighting → Focus calm state → reduced-motion → mobile optimization → Rainy Elbi → final visual/performance QA.**

That gives us one background that can look *far* richer than what we have now without creating dozens of separate campus scenes or returning to the expensive “world changes as you study” idea.