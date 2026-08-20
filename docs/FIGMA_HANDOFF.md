# Figma handoff — Pass 1.5

The current six visual checkpoints are represented by code + QA screenshots:

- `test-artifacts/home.png` — 1440×900 Campus Home
- `test-artifacts/home-1920.png` — 1920×1080 Campus Home
- `test-artifacts/mobile-home.png` — 390×844 Campus Home
- `test-artifacts/start-focus.png` — Start Focus modal
- `test-artifacts/focus.png` — Focus Mode
- `test-artifacts/wrap.png` — Wrap-up / TIL

Source design tokens are in `src/styles/tokens.css`; the material/scene rules are in `docs/visual-direction-v2.md`.

A live editable Figma file was not created in this run because the connected Figma account exposes more than one destination plan and the connector requires an explicit plan choice before file creation. The implementation does not depend on Figma: the React/DOM UI and LibreSprite/Tiled sources remain canonical.
