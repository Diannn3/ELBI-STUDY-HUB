# Manual QA checklist

Run this after `npm run dev` or against a Cloudflare preview.

## Core path
- [ ] Home appears with selected crisp pixel scene and Today panel.
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
- [ ] `prefers-reduced-motion` disables fireflies/procedural motion.
- [ ] Touch controls are usable at 390×844.
- [ ] Run the included axe Playwright test.

## Visual
- [ ] No blurred pixel art.
- [ ] No non-integer canvas filtering.
- [ ] No emoji used as production navigation icons.
- [ ] No glassmorphism/rounded-card drift.
- [ ] UI negative space does not cover key architecture.
