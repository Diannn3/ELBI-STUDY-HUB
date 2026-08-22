// ELBI Study Hub — Living Elbi assembly helper for LibreSprite.
// Large scene plates are production source; small ambient sprites are authored separately.
// This helper creates a layered 768x480 document from the committed source PNG plates.
// Run from LibreSprite after setting the repository as the working directory, or edit ROOT below.
const ROOT = 'assets/source/libresprite/campus-day/';
const layers = [
  ['01_SKY_BASE', '01_sky_base.png'],
  ['05_HAZE', '05_haze.png'],
  ['07_WORLD_STATIC', '07_world_static.png'],
  ['21_SUN_DAPPLE_A', '21_sun_dapple_1.png'],
  ['21_SUN_DAPPLE_B', '21_sun_dapple_2.png'],
  ['22_CLOUD_SHADOW', '22_cloud_shadow.png'],
];
function fail(msg) { throw new Error('[Living Elbi] ' + msg); }
let dst;
try { app.command.NewFile({ width: 768, height: 480, colorMode: 'rgb' }); dst = app.activeSprite; }
catch (e) { dst = app.activeSprite; }
if (!dst || dst.width !== 768 || dst.height !== 480) fail('Create/open a 768x480 RGBA sprite first.');
for (const [name, path] of layers) {
  const src = app.open(ROOT + path);
  if (!src) fail('Could not open ' + path);
  const srcImage = src.cels[0] && src.cels[0].image;
  if (!srcImage || srcImage.width !== 768 || srcImage.height !== 480) fail(path + ' is not 768x480');
  app.activeSprite = dst;
  const layer = dst.newLayer(); layer.name = name;
  const cel = dst.newCel(layer, 1); cel.image = srcImage.clone();
  src.close();
}
app.activeSprite = dst;
console.log('Living Elbi layered 768x480 document assembled. Save as campus_day.lesprite.');
