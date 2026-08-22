# Living Elbi source plates

These 768×480 PNG plates are the canonical large-scene inputs for the Living Elbi campus diorama. They are deliberately kept outside the atlas so architecture and lighting remain easy to inspect and edit.

- `01_sky_base.png` — clean sky plate
- `05_haze.png` — atmospheric depth
- `07_world_static.png` — CAS/Oblation/ground/major vegetation
- `21_sun_dapple_1.png`, `21_sun_dapple_2.png` — subtle authored sunlight overlays
- `22_cloud_shadow.png` — low-alpha moving cloud shadow

Use `../scripts/rebuild_living_elbi.js` in LibreSprite to assemble these into a layered 768×480 working document. Save the editable document as `campus_day.lesprite` locally if desired. The PNG plates remain committed because they are deterministic and directly consumable by the build.

Generated/external concept art must pass through `assets/inbox/generated → Pixel Snapper → assets/workbench/snapped` and be manually promoted before becoming production source. Finalized LibreSprite work must never be automatically passed back through Pixel Snapper.
