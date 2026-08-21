# Opus Frontend Audit & Fix Report

## Executive result

The original Opus frontend had useful interaction coverage, custom pixel icons, sensible component boundaries, and a strong UPLB pixel scene. Its main problem was **visual direction**: it interpreted the product as a cream academic planner framed in UP Maroon, while the supplied target reference is an **immersive pixel environment with dark in-world HUD surfaces floating over the scene**.

The fixed version keeps the functional breadth of the Opus prototype while changing the UI hierarchy around the reference.

## What was wrong

### P0 — visual direction mismatch

1. **The scene was trapped inside an app frame.** A thick maroon application border made the site look like a themed dashboard instead of a place.
2. **Cream dominated the UI.** The Today board, routes, dock and dialogs all used large paper/cream surfaces; the reference uses dark graphite/violet utility panels.
3. **The background stopped being the product's visual anchor.** The daytime CAS/Oble artwork was good, but too much opaque UI competed with it.
4. **Navigation was a normal website header.** The target uses small floating controls with almost no chrome.
5. **The bottom dock felt like a dashboard footer.** The target is closer to a compact persistent radio/status strip.
6. **The Today board was one vertical list.** The reference's board language is denser and more structured; a mini Kanban is a much closer fit.
7. **The page family drifted.** Campus, Plan, Learn, Stats and Settings looked like separate paper pages rather than surfaces in one ambient world.

### P0 — prototype behavior regressions

1. **Timer drift/background failure.** The prototype incremented `elapsedSec` once per `setInterval(1000)`. Browser throttling or sleep could make time inaccurate.
2. **No reload persistence.** Tasks, TILs, timer state and settings lived only in React state.
3. **Fake cloud sync.** The Settings UI exposed a cloud-sync switch even though the standalone prototype has no Supabase connection.
4. **Data buttons did nothing.** Export / clear history / delete all had no handlers.

### P1 — engineering / handoff issues

1. A second `src/package.json` duplicated dependency metadata.
2. Root scripts used `npx vite`, which can unexpectedly attempt network resolution; local package scripts should call `vite` directly.
3. `@emotion/react` was unused.
4. BrowserRouter had no static-host history fallback.
5. Several dynamically styled Board `tone` values were incompatible after the visual component was changed.
6. Some generated Tailwind opacity modifiers were invalid (`/88`, `/32`, etc.) and would silently fail to emit utilities.
7. The prototype depends on a Google-hosted pixel font, so the offline production app should eventually replace that with an approved bundled/font strategy in the canonical repo. This fixed zip does not ship font binaries.

## What changed

### 1. Full-bleed world layer

`App.tsx` now owns one persistent `CampusScene`. Every route renders over the same environment. The campus is no longer visually boxed inside a maroon application frame.

### 2. Lofi-style scene treatment

`CampusScene.tsx` keeps the existing pixel UPLB artwork but applies a controlled dusk tint:

- lower brightness, not grayscale
- preserved green/teal/blue environmental colors
- violet/navy environmental tint
- warm maroon lower-light influence
- restrained vignette
- a few tiny stepped pixel floaters only when motion is allowed

No blur-heavy glass effects were added.

### 3. Floating navigation

`TopNav.tsx` now uses:

- floating ELBI STUDY label at top-left
- icon-only route controls at top-right
- dark translucent blocks rather than a full-width header bar
- gold active state + maroon marker

### 4. Study Board replaces the paper Today card

`TodayBoard.tsx` is now structurally closer to the reference:

- `STUDY BOARD` title
- compact `[+] Task / Plan / History` toolbar
- Backlog / In Progress / Done columns
- dark compact cards
- `[ ]` and `[X]` pixel-status language
- selected task highlighted with gold + maroon edge
- progress meter
- high-contrast START FOCUS action

It still supports quick task creation and task selection.

### 5. Radio/status dock

`StudyDock.tsx` is now a slim dark strip containing:

- ambience play/pause
- volume slider
- Rainy Elbi thumbnail/title
- Today / Week / consistency stats
- current task
- timer
- start/end control

This mirrors the information density and placement of the reference without cloning its exact content.

### 6. Consistent dark HUD components

`Board.tsx` and `PixelButton.tsx` were redesigned around:

- near-black violet/navy surfaces
- cool-gray pixel borders
- white/off-white text
- UP Maroon CTA/action accents
- UP Forest Green status accents
- UP Gold selection/progress accents

The UP palette now behaves as **accent identity**, not as huge flat background areas.

### 7. Modal/focus/wrap-up redesign

The focus setup, live focus state and end-of-session flow now use the same HUD language.

Focus mode intentionally strips away navigation/dock and leaves only:

- task/course
- timer
- progress
- pause/resume
- end
- ambience status

### 8. Other pages brought into the same world

Plan, Learn, Stats and Settings now use translucent/dark route surfaces over the persistent scene rather than full cream-paper screens.

### 9. Timer hardening

The standalone prototype timer now stores:

- `elapsedSec`
- `runStartedAt`
- `runStartedElapsedSec`

The displayed elapsed time is derived from `Date.now()` whenever the repaint loop runs. The interval is therefore only a repaint trigger. On focus/visibility return, time is recalculated immediately.

This is still a prototype implementation; the canonical app should continue using the previously designed Dexie-backed absolute-timestamp domain model.

### 10. Reload persistence

Tasks, sessions, TILs, settings, timer, selected task and flow stage are persisted to a versioned localStorage snapshot. This makes the standalone UI useful for prototype testing across reloads.

Again: **do not replace Dexie with this when merging into the real app.**

### 11. Storage controls fixed

Settings now has working local prototype actions for:

- JSON export
- clear session history
- delete all local data

Cloud sync is intentionally disabled and labeled as a production integration rather than pretending to work.

## Visual target vs fixed result

The fixed design now follows the reference's principles:

| Reference principle | Fixed implementation |
|---|---|
| environment dominates viewport | persistent full-screen campus scene |
| utility panel floats over world | right-side dark Study Board |
| compact title/controls | floating top-left brand + top-right icon HUD |
| dense board content | 3-column task board |
| dark translucent utility material | HUD navy/graphite surfaces |
| bright white pixel labels | white pixel headings + mono task copy |
| thin persistent media strip | Rainy Elbi radio/status dock |
| environmental palette remains visible | blue/green campus under dusk tint |
| accent colors are sparse | maroon CTA, green state, gold selection/progress |

## QA performed in this environment

- every `.ts` / `.tsx` file passed TypeScript syntax transpilation
- project-local prop/type relationships passed a TypeScript compiler run with external React/router/framer modules stubbed
- invalid Board tone usages were removed
- invalid Tailwind opacity modifiers were audited and normalized to supported values
- duplicate `src/package.json` removed
- unused Emotion dependency removed
- `git diff --check` used before packaging
- a 1600×900 visual composition preview was created and manually inspected against the supplied reference direction

## Environment limitation

`npm install` timed out in this environment, so I could not honestly claim a full Vite/Tailwind production build or browser E2E run of the real React bundle here. The source was therefore validated structurally/syntactically and with a manually rendered layout preview.

## Merge recommendation for Diannn3/ELBI-STUDY-HUB

Do **not** drop this zip wholesale on top of the canonical repo.

Port in this order:

1. Tailwind/design tokens or equivalent CSS tokens
2. `Board`, `PixelButton`, `PixelIcon`
3. `TopNav`
4. `TodayBoard` visual structure, connected to canonical Dexie task hooks
5. `StudyDock`, connected to real history/audio state
6. Start Focus / Focus / Wrap-up presentation, connected to the canonical timer domain
7. route page styling
8. only then evaluate whether any prototype-only interaction should survive

Keep from the canonical repo:

- React 19/Vite stack
- Phaser scene architecture
- Dexie database
- Supabase migrations/RLS/sync
- Tiled/FastPack/LibreSprite production pipeline
- Playwright/Vitest suites

## Deliberately not copied from the target screenshot

The implementation borrows hierarchy and interaction principles, not copyrighted scene artwork or an exact clone of the reference. ELBI STUDY retains its own UPLB scene, UP-derived accents, content, task model, icons and component proportions.
