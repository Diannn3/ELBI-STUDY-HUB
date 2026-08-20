import Phaser from 'phaser';
import { CampusScene } from './scenes/CampusScene';

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 640,
    height: 360,
    backgroundColor: '#55A3D9',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scene: [CampusScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: false, roundPixels: true, pixelArt: true },
  };
}
