import Phaser from 'phaser';
import type { SceneTuning } from './types';

interface AnimatedOverlay { sprite: Phaser.GameObjects.Image; frames: string[]; phase: number; kind: 'palm'|'tree'|'grass' }
export class VegetationSystem {
  private overlays: AnimatedOverlay[]=[];
  constructor(private scene: Phaser.Scene, private tuning: SceneTuning) {}
  create() {
    for (const marker of this.tuning.markers.values()) {
      const kind=marker.properties.kind;
      if (kind!=='palm' && kind!=='tree' && kind!=='grass') continue;
      const frames=kind==='palm' ? [0,1,2,3].map(i=>`palm_fronds_${String(i).padStart(2,'0')}`) : kind==='tree' ? [0,1,2,3].map(i=>`tree_canopy_${String(i).padStart(2,'0')}`) : [0,1,2].map(i=>`grass_wind_${String(i).padStart(2,'0')}`);
      const sprite=this.scene.add.image(Math.round(marker.x+marker.width/2),Math.round(marker.y+marker.height/2),'campus-atlas',frames[0]).setDepth(kind==='grass'?7:6).setAlpha(kind==='tree'?0.7:0.82);
      sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
      this.overlays.push({sprite,frames,phase:this.overlays.length*0.71,kind});
    }
  }
  update(now:number, wind:number, multiplier:number) {
    for (const o of this.overlays) {
      const fps=o.kind==='grass'?2.2:3.2;
      const idx=Math.floor(now/1000*fps*Math.max(0.12,wind)*multiplier+o.phase)%o.frames.length;
      if (multiplier<=0.04) o.sprite.setFrame(o.frames[0]); else o.sprite.setFrame(o.frames[(idx+o.frames.length)%o.frames.length]);
    }
  }
  setStatic(){ this.overlays.forEach(o=>o.sprite.setFrame(o.frames[0])); }
}
