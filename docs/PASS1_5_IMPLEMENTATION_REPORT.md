# Pass 1.5 implementation report — vibrant UPLB home

Date: 2026-08-21

## Outcome

Pass 1.5 completes the planned **Visual Identity + Real Home Scene** pass without expanding the postponed product scope.

The reliable loop remains:

**Campus Home → choose/create task → Start Focus → Focus Mode → finish/early end → Done/Continue/Blocked → optional TIL → history/stats.**

The home has been rebuilt from the dark/blue Pass-1 treatment into a bright daytime UPLB/CAS-inspired scene with UP Maroon, Forest Green, Gold, cream and sand interface surfaces.

## Visual implementation

### Home

- Removed the giant marketing-style hero headline from the signed-in workspace.
- Kept the scene as the primary visual object.
- Rebuilt the Today utility as a maroon **Campus Notice** board with cream paper surface.
- Rebuilt the status dock as a cream campus-radio/control surface with maroon top edge.
- Replaced the settings text affordance in the React app with an original 16×16 pixel settings icon.
- Kept network state, task capture, task selection, Start Focus, ambience, and derived history visible without obscuring the central landmark.

### Focus / modal / wrap-up

- Start Focus now uses a cream planner-card treatment with maroon frame, green selected preset, and gold active trim.
- Focus Mode dims and desaturates the campus while keeping the same scene; the scene itself does not evolve.
- Focus timer uses UP Maroon digits and UP Gold progress.
- Wrap-up uses a cream reflection sheet. Done = green, Continue = gold/sand, Blocked = maroon, with labels/icons so state is not color-only.
- Removed the game-like `CURRENT QUEST` wording in favor of `CURRENT WORK`.

### Responsive behavior

- Desktop: scene fills the viewport; Today is a right-side overlay in the low-priority safe zone.
- Mobile: the same scene becomes the top ~43% of the page; Today and the dock move into normal document flow beneath it.
- No second mobile artwork is required.

## Pixel-art implementation

### Master scene

- New authoring/runtime master: **640×360**.
- Current composite: **43 actually-used colors**.
- Combined environment/UI palette: 52 authored colors.
- Nearest-neighbor only; no AI image generation, photo filter, or image quantization was used.

The user-supplied UPLB photograph was used as a composition/architecture reference. The scene is authored from integer pixel clusters and geometry in `scripts/assets/generate_pixel_art.py`.

### Editable scene layers

`assets/source/libresprite/campus_day/`

1. `01_sky.png`
2. `02_clouds.png`
3. `03_far_trees.png`
4. `04_cas.png`
5. `05_oblation.png`
6. `06_ground.png`
7. `07_mid_trees.png`
8. `08_props.png`
9. `09_foreground.png`
10. `10_lighting.png`

The legacy 320×180 `campus/` layer set was removed so there is only one scene source-of-truth.

### Reusable props / UI pixels

New reusable scene assets include:

- broadleaf tree variants
- palm
- bench
- lamp
- student variants
- bird
- leaf particle

New 16×16 UI assets include:

- settings
- music
- focus
- task
- stats
- checkbox empty / doing / done
- priority high / medium / low

Large scene layers are intentionally loaded directly in Phaser. FastPack remains for small props/UI sprites.

## Tiled / Phaser implementation

### Tiled

`scene_home.tmj` now contains:

- BACKGROUND
- CLOUDS
- FAR_WORLD
- ARCHITECTURE
- OBLATION
- GROUND
- PROPS_BACK
- PROPS_FRONT
- FOREGROUND
- LIGHTING
- FX_MARKERS
- INTERACTION_MARKERS

New markers:

- `UI_SAFE_RIGHT`
- `UI_SAFE_TOP`
- `ANCHOR_OBLATION`
- cloud / bird / leaf FX anchors
- `PARALLAX_SKY`
- `PARALLAX_FAR`
- `PARALLAX_WORLD`
- `PARALLAX_FOREGROUND`

No external Tiled tileset `source` references are used.

### Phaser

`CampusScene` now:

- runs at 640×360
- loads 10 direct scene layers
- uses nearest-neighbor texture filtering
- performs only integer-aligned ±1–2 px slow layer drift
- can spawn a rare small bird and rare leaf particle from the atlas
- disables nonessential scene motion under reduced-motion
- reads Tiled markers rather than scattering effect coordinates through UI code

## Asset-pipeline verification

Executed successfully in this environment:

```text
python3 scripts/assets/build_assets.py
python3 scripts/validate/validate_assets.py
```

Observed:

- 10 scene layers
- 640×360 hero
- 43 hero colors
- 23 runtime small PNGs after legacy cleanup
- Tiled marker/layer validation passes
- FastPack contract validation passes
- original ambience regeneration passes

FastPack and OxiPNG binaries are still not installed in this sandbox. The deterministic lossless fallback path executed; the committed production FastPack/OxiPNG branches remain intact.

## Domain / interaction verification

Executed successfully:

```text
bash scripts/validate/run_domain_tests.sh
python3 scripts/validate/scope_audit.py
python3 tests/e2e/visual_harness.py
python3 tests/e2e/mobile_visual.py
python3 tests/e2e/result_paths.py
```

Results:

- 10/10 domain/timer checks pass
- no postponed social/progression features detected
- home renders
- Start Focus modal opens
- wall-clock timer changes from absolute timestamps
- natural expiration reaches wrap-up
- session/TIL/outbox mutations persist in the verification adapter
- Done / Continue / Blocked all map to the intended task state
- Escape closes the modal
- keyboard focus reaches a real control
- no browser page errors in the visual harness

## Visual QA artifacts

Generated and manually reviewed:

- `test-artifacts/home.png` — 1440×900
- `test-artifacts/home-1920.png` — 1920×1080
- `test-artifacts/mobile-home.png` — 390×844
- `test-artifacts/mobile-modal.png`
- `test-artifacts/start-focus.png`
- `test-artifacts/focus.png`
- `test-artifacts/wrap.png`
- `test-artifacts/home-after.png`

The central landmark remains visually readable on desktop and mobile. Text/controls always sit on dedicated surfaces rather than directly on the sky/grass.

## Real-tool gate

A real connected dependency/tool environment remains the next mandatory gate before Auth/Courses/Kanban work starts.

Attempted here:

```text
npm install --ignore-scripts
```

The command timed out because the sandbox cannot reach the npm registry. A global TypeScript binary exists, but `tsc --noEmit` cannot resolve `vite/client` without project dependencies. This is an environment dependency failure, not a source TypeScript diagnostic.

Still requiring a normal developer/CI environment:

1. `npm install`
2. `npm run assets` with real FastPack + OxiPNG installed
3. `npm run lint`
4. `npm run typecheck`
5. `npm run test`
6. `npm run build`
7. `npm run test:e2e` against a served app
8. `supabase start && supabase db reset`
9. live adversarial RLS tests
10. Cloudflare Pages preview

Per the approved roadmap, Auth → Courses/Semesters → full Plan/Kanban should begin **only after this gate passes**. Social/Discord remains later, after closed-alpha evidence.

## GitHub delivery state

The updated work is committed locally on branch `pass1.5-vibrant-home` and is packaged as a source ZIP / git bundle for handoff. The GitHub connector can read `Diannn3/ELBI-STUDY-HUB`, but branch creation returned GitHub `403 Resource not accessible by integration`, so this environment cannot push the branch directly despite the user's permission. No partial writes were made to `master`.
