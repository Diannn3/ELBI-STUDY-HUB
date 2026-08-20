# Manual QA checklist — Pass 1.5

Run this after `npm run dev` or against a Cloudflare preview.

## Core path
- [ ] Home appears with the crisp 640×360 daytime CAS/Oblation scene and Campus Notice Today panel.
- [ ] Create a task with keyboard only.
- [ ] Select a task with keyboard only.
- [ ] Open Start Focus and close with Escape.
- [ ] Start 25/5, 50/10, Quiet 5, Custom, and Flow modes.
- [ ] Pause for at least 10 seconds, resume, and confirm paused duration is excluded.
- [ ] Reload during a running timer and confirm correct remaining time.
- [ ] Background the browser for at least one minute and confirm correct remaining time on return.
- [ ] Let a short/custom timer finish naturally.
- [ ] End a timer early.
- [ ] Verify Done, Continue, and Blocked separately.
- [ ] Save a TIL and verify it survives reload.
- [ ] Skip a TIL and verify session still saves.
- [ ] Confirm Today/weekly stats derive from sessions.

## Offline
- [ ] Load once online so service worker is installed.
- [ ] Disable network.
- [ ] Reload the app.
- [ ] Create/select a task offline.
- [ ] Start/finish a focus block offline.
- [ ] Save TIL offline.
- [ ] Inspect IndexedDB and confirm queued sync mutations.
- [ ] Reconnect and confirm replay after login/configuration.

## Accessibility
- [ ] Tab order is logical.
- [ ] Shift+Tab works.
- [ ] Enter/Space activate controls.
- [ ] Escape closes modal.
- [ ] 200% browser zoom remains usable.
- [ ] `prefers-reduced-motion` disables cloud drift, bird and leaf ambience.
- [ ] Touch controls are usable at 390×844.
- [ ] Result choices remain understandable without color alone.
- [ ] Run the included axe Playwright test.

## Visual / identity
- [ ] 1440×900 and 1920×1080 Home both keep the central monument readable.
- [ ] The Today board remains entirely inside the right utility zone and never covers the monument.
- [ ] Mobile scene occupies roughly the top 38–45%; Today + dock flow below it.
- [ ] No blurred pixel art or filtered scene textures.
- [ ] No arbitrary fractional sprite scaling in Phaser.
- [ ] No emoji used as production navigation icons.
- [ ] No glassmorphism, giant rounded SaaS cards, or random gradient drift.
- [ ] Gold is used as an accent rather than low-contrast gold text on cream.
- [ ] The home is visibly brighter/more saturated than Focus Mode.
- [ ] The app logo/identity remains original; the monument is scene content, never the product logo.
