# Pass 1 implementation report

Date: 2026-08-21

## Outcome

The narrow product path is implemented in source and in the dependency-free verification harness:

**Campus Home → choose/create task → Start Focus → Focus Mode → finish/early end → Done/Continue/Blocked → optional TIL → history/stats.**

The project deliberately contains no user-facing rooms, Discord, friends, avatars, XP, unlockables, multiple scenes, AI, calendar integrations, full Kanban, or public profiles.

## Executed verification in this sandbox

### Domain / timer

`./scripts/validate/run_domain_tests.sh` executed 10 deterministic checks successfully:

- 25:00 → 24:59 derives from absolute timestamps
- pause freezes elapsed duration
- resume excludes the paused duration
- natural expiration
- finished timer stops accumulating
- early-ended timer stops accumulating
- custom duration clamps to 1–180 minutes
- history totals derive from source sessions
- deterministic last-write-wins helper
- cloud serialization replaces local placeholder identity

### Asset pipeline

`python3 scripts/assets/build_assets.py` and `validate_assets.py` passed.

Observed:

- hero: 320×180
- source hero layers: 8
- reusable runtime PNGs: 9
- locked palette: 44 colors
- actual hero composite: 37 colors
- Tiled source: valid `.tmj`, expected named layers present, no external tileset `source`
- FastPack contract: Phaser 3 metadata, rotation off, trim on, 1 px extrusion, alias detection on
- original ambience sources regenerated successfully

The sandbox does not have FastPack or OxiPNG executables. `npm run assets` therefore exercised the deterministic lossless fallback pack/PNG optimizer while preserving the committed FastPack `.fpsheet` and OxiPNG production branch. The exact binaries will be exercised in CI or a connected developer machine.

### UI / interaction harness

`python3 tests/e2e/visual_harness.py` passed:

- Campus Home renders
- seeded Today tasks render
- Start Focus modal opens
- wall-clock timer changes (`00:05 → 00:04` in test mode)
- natural expiration reaches Wrap-up
- session persists in the test persistence adapter
- TIL persists
- sync outbox receives mutations
- Done updates task state
- history updates to one session
- Escape closes the modal
- keyboard focus reaches a real control
- zero browser page errors

`python3 tests/e2e/result_paths.py` additionally passed all result transitions:

- Done → task `done`
- Continue → task `doing`
- Blocked → task `blocked`
- quick task creation + auto-selection works

Desktop and 390×844 mobile screenshots were generated and manually inspected.

## Environment-limited checks

These are implemented but could not be executed end-to-end inside this sandbox for reasons outside the repository:

| Check | State | Reason |
|---|---|---|
| React/Vite production `npm install` + build | Ready, unexecuted here | sandbox shell cannot resolve the npm registry |
| Real Phaser 4 runtime | Ready, unexecuted here | Phaser npm dependency cannot be installed in sandbox |
| Real Dexie IndexedDB reload test through served URL | Ready, unexecuted here | managed Chromium has enterprise `URLBlocklist: ["*"]`, blocking localhost/file navigation |
| Real service-worker offline reload | Ready, unexecuted here | same managed Chromium URL policy |
| Supabase local `db reset` / live RLS adversarial test | Ready, unexecuted here | Supabase CLI/Docker not available |
| FastPack exact binary output | Ready, unexecuted here | FastPack executable absent |
| OxiPNG exact binary optimization | Ready, unexecuted here | OxiPNG executable absent |
| Cloudflare Pages preview URL | Not deployed | no Cloudflare connector/session is connected in this chat |
| Editable Figma file | Not created | Figma connection exposes two plans and the Figma tool requires the user to choose a plan before file creation |

None of these blockers prevents the included source/preview from being inspected or the local-first interaction model from being exercised. The real Playwright localhost/PWA test is already included at `tests/playwright/pass1.spec.ts` for a normal CI/developer environment.

## Definition-of-done matrix

Legend: **PASS** executed here, **READY** implemented but requires an external runtime/service, **OUT** intentionally postponed.

| Requirement | Status |
|---|---|
| coherent UPLB/Elbi-inspired pixel scene | PASS |
| LibreSprite-editable pixel source | PASS (layer PNGs + exact `putPixel()` rebuild script) |
| Tiled-editable scene source | PASS (`scene_home.tmj`) |
| FastPack build reproducible | READY (locked `.fpsheet`; exact binary unavailable here) |
| OxiPNG stage | READY (production branch present; exact binary unavailable here) |
| Phaser pixel-crisp configuration | READY (source/config complete; package install unavailable here) |
| React UI independent from Phaser | PASS (architecture/source audit) |
| create/select task | PASS |
| start focus | PASS |
| absolute timestamp timer | PASS |
| reload survival | READY (Dexie persistence + Playwright test; localhost blocked here) |
| background/sleep resilience | PASS at domain level; READY for real hidden-tab browser test |
| temporary offline timer/data | READY (IndexedDB + SW + real E2E test; localhost blocked here) |
| session persisted | PASS in harness; READY against real Dexie browser storage |
| Done / Continue / Blocked | PASS |
| TIL save/skip | PASS |
| history/stats derived from sessions | PASS |
| Dexie local application data surface | PASS source audit; READY browser persistence test |
| migration-controlled Supabase schema | PASS |
| RLS ownership policies | PASS static audit; READY live DB adversarial test |
| sync outbox | PASS |
| reconnect replay | READY (requires configured authenticated Supabase) |
| PWA shell | PASS static implementation; READY offline browser verification |
| keyboard path / Escape | PASS |
| reduced motion | PASS source + visual audit |
| core Playwright definitions | PASS harness; READY real served-app suite |
| screenshot baselines | PASS (desktop + mobile artifacts) |
| production build | READY (requires npm registry access) |
| Cloudflare preview | READY config, not deployed |
| no progression/cosmetic scope creep | PASS |

## Visual audit

The first pass intentionally avoids:

- generic giant rounded cards
- glassmorphism
- random gradient sections
- Lucide icon soup
- emoji navigation
- inconsistent pixel scale
- animated world progression
- excessive motion

The pixel hero owns the viewport; the Today panel uses the right-side low-detail region, and the focus/wrap states deliberately reduce scenery contrast so the work remains primary.

## Next gate

Do **not** add social/Discord or full Kanban until a normal connected environment runs:

1. `npm install`
2. `npm run assets`
3. `npm run lint && npm run typecheck && npm run test && npm run build`
4. `npm run test:e2e`
5. local Supabase reset + RLS adversarial test
6. Cloudflare preview deployment
7. five-person no-explanation usability test

Then fix failures in this vertical slice before expanding scope.
