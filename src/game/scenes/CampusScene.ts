import Phaser from 'phaser';
import { sceneBridge } from '../EventBridge';

export class CampusScene extends Phaser.Scene {
  private reducedMotion = false;
  private fireflies?: Phaser.GameObjects.Group;

  constructor() { super('CampusScene'); }

  preload() {
    this.load.image('campus-hero', '/assets/campus_hero.png');
    this.load.multiatlas('campus-atlas', '/assets/campus-atlas.json', '/assets/');
    this.load.tilemapTiledJSON('campus-map', '/assets/scene_home.json');
  }

  create() {
    const hero = this.add.image(160, 90, 'campus-hero').setOrigin(0.5);
    hero.setDisplaySize(320, 180);
    hero.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const map = this.make.tilemap({ key: 'campus-map' });
    const markers = map.getObjectLayer('FX_MARKERS')?.objects.filter(o => o.type === 'firefly') ?? [];
    this.fireflies = this.add.group();
    const points = markers.length ? markers : Array.from({ length: 12 }, (_, i) => ({ x: 35 + (i * 41) % 240, y: 68 + (i * 17) % 76 }));
    points.forEach((point, i) => {
      const dot = this.add.rectangle(point.x ?? 40, point.y ?? 90, 1, 1, 0xffd96a, 0.35 + (i % 4) * .12);
      dot.setData('phase', i * .73);
      this.fireflies?.add(dot);
    });

    const unsubscribe = sceneBridge.on<boolean>('reduced-motion', value => { this.reducedMotion = value; });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
    sceneBridge.emit('scene-ready', true);
  }

  update(time: number) {
    if (this.reducedMotion) return;
    this.fireflies?.getChildren().forEach((child: any) => {
      const dot = child as Phaser.GameObjects.Rectangle;
      const phase = dot.getData('phase') as number;
      dot.alpha = 0.22 + (Math.sin(time / 900 + phase) + 1) * 0.24;
    });
  }
}
