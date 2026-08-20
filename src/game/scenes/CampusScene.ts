import Phaser from 'phaser';
import { sceneBridge } from '../EventBridge';

const LAYERS = [
  ['sky', '/assets/scene_01_sky.png'],
  ['clouds', '/assets/scene_02_clouds.png'],
  ['far-trees', '/assets/scene_03_far_trees.png'],
  ['cas', '/assets/scene_04_cas.png'],
  ['oblation', '/assets/scene_05_oblation.png'],
  ['ground', '/assets/scene_06_ground.png'],
  ['mid-trees', '/assets/scene_07_mid_trees.png'],
  ['props', '/assets/scene_08_props.png'],
  ['foreground', '/assets/scene_09_foreground.png'],
  ['lighting', '/assets/scene_10_lighting.png'],
] as const;

export class CampusScene extends Phaser.Scene {
  private reducedMotion = false;
  private cloudLayer?: Phaser.GameObjects.Image;
  private farLayer?: Phaser.GameObjects.Image;
  private foregroundLayer?: Phaser.GameObjects.Image;
  private bird?: Phaser.GameObjects.Image;
  private nextBirdAt = 9000;
  private nextLeafAt = 2500;
  private markerMap = new Map<string, Phaser.Types.Tilemaps.TiledObject>();

  constructor() { super('CampusScene'); }

  preload() {
    for (const [key, path] of LAYERS) this.load.image(key, path);
    this.load.multiatlas('campus-atlas', '/assets/campus-atlas.json', '/assets/');
    this.load.tilemapTiledJSON('campus-map', '/assets/scene_home.json');
  }

  create() {
    for (const [key] of LAYERS) {
      const image = this.add.image(320, 180, key).setOrigin(.5).setDepth(this.depthFor(key));
      image.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
      if (key === 'clouds') this.cloudLayer = image;
      if (key === 'far-trees') this.farLayer = image;
      if (key === 'foreground') this.foregroundLayer = image;
    }

    const map = this.make.tilemap({ key: 'campus-map' });
    for (const layerName of ['FX_MARKERS', 'INTERACTION_MARKERS']) {
      for (const object of map.getObjectLayer(layerName)?.objects ?? []) {
        if (object.name) this.markerMap.set(object.name, object);
      }
    }

    const unsubscribe = sceneBridge.on<boolean>('reduced-motion', value => {
      this.reducedMotion = value;
      if (value) this.resetMotion();
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
    sceneBridge.emit('scene-ready', true);
  }

  private depthFor(key: string) {
    return ['sky','clouds','far-trees','cas','oblation','ground','mid-trees','props','foreground','lighting'].indexOf(key);
  }

  private resetMotion() {
    if (this.cloudLayer) this.cloudLayer.x = 320;
    if (this.farLayer) this.farLayer.x = 320;
    if (this.foregroundLayer) this.foregroundLayer.x = 320;
    this.bird?.destroy(); this.bird = undefined;
  }

  private spawnBird() {
    if (!this.textures.exists('campus-atlas')) return;
    const marker = this.markerMap.get('bird-path');
    const y = marker?.y ?? 96;
    this.bird?.destroy();
    this.bird = this.add.image(-16, y, 'campus-atlas', 'bird_01').setOrigin(.5).setDepth(2.5);
    this.bird.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.tweens.add({ targets: this.bird, x: 656, duration: 18000, ease: 'Linear', onComplete: () => { this.bird?.destroy(); this.bird = undefined; } });
  }

  private spawnLeaf() {
    if (!this.textures.exists('campus-atlas')) return;
    const left = Math.random() < .5;
    const marker = this.markerMap.get(left ? 'leaf-west' : 'leaf-east');
    const leaf = this.add.image(marker?.x ?? (left ? 80 : 560), marker?.y ?? 210, 'campus-atlas', 'leaf_particle').setDepth(8.5).setAlpha(.9);
    leaf.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const dx = left ? 18 + Math.random()*16 : -(18 + Math.random()*16);
    this.tweens.add({ targets: leaf, x: leaf.x + dx, y: leaf.y + 26 + Math.random()*18, alpha: .15, duration: 3500 + Math.random()*1500, ease: 'Linear', onComplete: () => leaf.destroy() });
  }

  update(time: number) {
    if (this.reducedMotion) return;
    // Integer-aligned micro-parallax only; no floating camera or continuous carnival motion.
    if (this.cloudLayer) this.cloudLayer.x = 320 + Math.round(Math.sin(time / 12000) * 2);
    if (this.farLayer) this.farLayer.x = 320 + Math.round(Math.sin(time / 18000) * 1);
    if (this.foregroundLayer) this.foregroundLayer.x = 320 + Math.round(Math.sin(time / 15000) * .5);

    if (time > this.nextBirdAt && !this.bird) {
      this.spawnBird();
      this.nextBirdAt = time + 30000 + Math.random()*18000;
    }
    if (time > this.nextLeafAt) {
      this.spawnLeaf();
      this.nextLeafAt = time + 3800 + Math.random()*2800;
    }
  }
}
