import Phaser from 'phaser';
import type { SceneTuning } from './types';
import { num } from './tiledSceneTuning';

interface CloudEntry { sprite: Phaser.GameObjects.Image; speed: number; band: string }

export class CloudSystem {
  private clouds: CloudEntry[] = [];
  private tuning: SceneTuning;
  constructor(private scene: Phaser.Scene, tuning: SceneTuning) { this.tuning = tuning; }

  create() {
    const specs = [
      ['CLOUD_FAR_BAND','cloud_far_',3,0.23],
      ['CLOUD_MID_BAND','cloud_mid_',4,0.45],
      ['CLOUD_NEAR_BAND','cloud_near_',2,0.7],
    ] as const;
    let seed = 0;
    for (const [markerName,prefix,count,alpha] of specs) {
      const marker=this.tuning.markers.get(markerName);
      const min=num(marker,'speedMin',2); const max=num(marker,'speedMax',4);
      for (let i=0;i<count;i++) {
        const x=((i+1)/(count+1))*768 + ((seed*47)%80)-40;
        const y=(marker?.y ?? 40) + ((seed*31)%Math.max(1,Math.floor(marker?.height ?? 80)));
        const key=`${prefix}${String(i+1).padStart(2,'0')}`;
        const sprite=this.scene.add.image(Math.round(x),Math.round(y),'campus-atlas',key).setOrigin(0.5).setAlpha(alpha).setDepth(prefix.includes('near')?4:prefix.includes('mid')?2:1);
        sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        const t=((seed*37)%100)/100; this.clouds.push({sprite,speed:min+(max-min)*t,band:markerName}); seed++;
      }
    }
  }

  update(delta: number, multiplier: number) {
    for (const cloud of this.clouds) {
      cloud.sprite.x = Math.round(cloud.sprite.x + cloud.speed * multiplier * delta / 1000);
      if (cloud.sprite.x - cloud.sprite.displayWidth/2 > 790) {
        const marker=this.tuning.markers.get(cloud.band);
        cloud.sprite.x=Math.round(-cloud.sprite.displayWidth/2 - 20);
        const phase=Math.abs(Math.sin((cloud.speed+cloud.sprite.y)*12.37));
        cloud.sprite.y=Math.round((marker?.y ?? 40)+phase*Math.max(1,(marker?.height ?? 80)));
      }
    }
  }

  setVisible(visible: boolean) { this.clouds.forEach(c=>c.sprite.setVisible(visible)); }
}
