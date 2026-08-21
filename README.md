# ELBI STUDY — Opus UI Audit + Fixed Frontend

This folder is the **fixed version of the Opus/Magic Patterns frontend prototype** supplied for ELBI STUDY HUB.

The redesign keeps the UPLB pixel-art identity, but changes the visual system to match the supplied Lofi Hub reference much more closely:

- full-bleed pixel campus instead of a framed cream dashboard
- compact floating brand and icon navigation
- dark CRT / notice-board utility surfaces
- a large right-side study board with Backlog / In Progress / Done columns
- slim lofi-radio/status dock along the bottom
- white pixel display text with restrained UP Maroon / UP Green / UP Gold accents
- quieter focus mode and matching wrap-up / TIL surfaces

## Important architecture note

This zip is still a **frontend prototype**, not the canonical production implementation from the ELBI STUDY HUB blueprint. It deliberately does **not** replace the production architecture decisions already made for the actual app:

- Phaser world layer
- Dexie / IndexedDB local-first data
- Supabase canonical cloud data + RLS
- FastPack / Tiled / LibreSprite asset pipeline
- production timer domain model

I did, however, repair the two biggest behavioral regressions in the standalone prototype:

1. its focus timer now derives elapsed time from absolute timestamps instead of trusting one `setInterval` tick per second;
2. prototype state is persisted to localStorage so reload/background testing is meaningful before this UI is ported onto Dexie.

When merging into the real repo, **port the visual components/styles, not this prototype context as the data layer**.

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

The `public/_redirects` file provides SPA history fallback on hosts that support that convention.

## Main changed files

- `src/App.tsx` — persistent full-screen scene + overlay shell
- `src/components/CampusScene.tsx` — dusk treatment that keeps pixel art readable
- `src/components/TopNav.tsx` — compact floating icon HUD
- `src/components/TodayBoard.tsx` — reference-inspired three-column study board
- `src/components/StudyDock.tsx` — lofi radio/status bar
- `src/components/StartFocusModal.tsx`
- `src/components/FocusMode.tsx`
- `src/components/SessionWrapUp.tsx`
- `src/components/ui/Board.tsx`
- `src/components/ui/PixelButton.tsx`
- `src/index.css`
- `tailwind.config.js`
- `src/contexts/StudyContext.tsx` — prototype timer/persistence hardening
- `src/pages/*` — dark in-world surfaces instead of paper dashboard pages

See `AUDIT_AND_FIXES.md` for the detailed audit and handoff notes. A manually rendered layout reference is included at `docs/visual-preview.png`.
