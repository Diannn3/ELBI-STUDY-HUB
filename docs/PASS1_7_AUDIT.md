# Pass 1.7 audit log

Pass 1.7 was deliberately reviewed in repeated implementation → audit → fix loops rather than treated as complete after the first render.

## Loop 1 — art pipeline and cloud language

**Finding:** the first cloud generator produced rectangular, platform-like silhouettes that looked mechanically tiled rather than like dimensional pixel-cloud masses.

**Fix:** rewrote cloud construction using overlapping hard scan-line lobes, stepped lower silhouettes, broken shadow clusters, and a few internal blue notches. Kept hard source pixels and no antialiasing.

**Result:** far/mid/near cloud variants now preserve clear pixel construction while reading as cloud masses.

## Loop 2 — environment architecture

Findings and fixes:

- fixed an invalid conditional expression in `LightingSystem`
- moved cloud/bird/rain regions and timing toward Tiled marker data
- constrained initial/subsequent bird schedules to 25–60 seconds
- changed rain population adjustment to a bounded ramp rather than large sudden per-frame changes
- fixed rain wrapping on both axes
- removed dead CloudSystem parallax code
- made mobile/parallax decisions responsive to viewport/pointer conditions
- clamped environment delta after hidden tabs so ambient simulation does not replay missed time

## Loop 3 — React/Phaser lifecycle

**Finding:** preferences could be emitted from React before a newly booted Phaser scene subscribed, leaving the scene at defaults until the next preference change.

**Fix:** `EventBridge` now stores the latest payload per event and replays it to late subscribers. Unsubscribe behavior is covered by the dependency-light domain suite.

## Loop 4 — reliability/spec review

- corrected Custom Focus from the prototype's 1–180 minute clamp to **5–120 minutes**
- added Tiled marker parsing tests
- added bridge replay/unsubscribe tests
- preserved absolute-timestamp timer logic
- confirmed postponed social/progression features remain outside `src/features`

## Loop 5 — visual review

Deterministic visual states rendered:

- 1536×960 Light HUD
- 1366×768 Light HUD
- 1536×960 Dark HUD
- 390×844 Mobile

Checks confirm scene and Today board remain visible. Manual review confirmed the bright campus remains the hero, the light cream/maroon HUD has sufficient separation from the scene, and dark HUD content remains readable.

## Loop 6 — build determinism

`scripts/validate/validate_determinism.py` runs the asset build twice and SHA-256 compares critical outputs:

- Living Elbi composite
- Living Tiled map
- representative dynamic cloud sprite
- atlas metadata

All matched byte-for-byte in the local environment.

## Final local verification matrix

Executed successfully in the constrained environment:

```text
python scripts/assets/build_assets.py
python scripts/validate/validate_assets.py
python scripts/validate/validate_living_elbi.py
python scripts/validate/validate_pixel_snap.py
python scripts/validate/validate_determinism.py
node scripts/validate/transpile_syntax.cjs
bash scripts/validate/run_domain_tests.sh
python tests/e2e/visual_harness.py
python tests/e2e/mobile_visual.py
python tests/e2e/living_visual.py
python scripts/validate/scope_audit.py
python -m compileall -q scripts tests
git diff --check
```

Results:

- asset validation: PASS
- Living Elbi validation: PASS
- Pixel Snapper workbench validation: PASS
- determinism: PASS
- TypeScript/TSX syntax transpilation: **53 files, 0 errors**
- domain checks: **13/13 PASS**
- existing core interaction visual harness: PASS
- mobile harness: PASS
- Living Elbi visual states: PASS
- scope audit: PASS
- Python compile: PASS
- whitespace/patch check: PASS

### Gates not executable locally

The execution environment cannot reach the npm registry. `npm install` was attempted and timed out, so normal dependency-backed `eslint`, full `tsc`, Vitest, Vite production build, and served-app Playwright cannot honestly be marked as locally executed. CI contains those gates and additionally installs the native SpriteFusion Pixel Snapper, FastPack, and OxiPNG tools.

Local FastPack/OxiPNG binaries were unavailable, so the deterministic development fallbacks were exercised. CI is the authoritative release gate for their native paths.

## Release decision

The local branch is suitable as a **Pass 1.7 source candidate**. It should only be merged/deployed after the canonical repository's dependency-backed CI passes the native tool, typecheck, build, and Playwright gates.
