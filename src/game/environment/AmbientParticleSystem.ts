import Phaser from 'phaser';
import type { SceneTuning } from './types';
import { num } from './tiledSceneTuning';
interface Leaf { sprite: Phaser.GameObjects.Image; vx:number; vy:number; life:number }
interface RainDrop { sprite: Phaser.GameObjects.Image; vy:number }
export class AmbientParticleSystem {
  private leaves:Leaf[]=[]; private rain:RainDrop[]=[]; private nextLeaf=0;
  constructor(private scene:Phaser.Scene,private tuning:SceneTuning){}
  update(now:number,delta:number,wind:number,multiplier:number,rainy:boolean,mobile:boolean){
    const enabled=multiplier>=.15;
    if(enabled && now>=this.nextLeaf && this.leaves.length<8){
      const left=Math.sin(now*.0013)>0; const m=this.tuning.markers.get(left?'LEAF_ZONE_LEFT':'LEAF_ZONE_RIGHT'); const phase=Math.abs(Math.sin(now*.007));
      const s=this.scene.add.image(Math.round((m?.x??0)+phase*(m?.width??180)),Math.round((m?.y??170)+phase*60),'campus-atlas',`leaf_${String(Math.floor(phase*3)%3).padStart(2,'0')}`).setDepth(8).setAlpha(.8);
      s.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); this.leaves.push({sprite:s,vx:(left?1:-1)*(5+wind*8),vy:8+wind*4,life:7000});
      this.nextLeaf=now+3000+phase*4500;
    }
    this.leaves=this.leaves.filter(l=>{l.life-=delta;l.sprite.x=Math.round(l.sprite.x+l.vx*delta/1000*multiplier);l.sprite.y=Math.round(l.sprite.y+l.vy*delta/1000*multiplier);if(l.life<=0||l.sprite.y>490){l.sprite.destroy();return false;}return true;});
    const rainMarker=this.tuning.markers.get('RAIN_AREA'); const target=rainy?Math.round(num(rainMarker,mobile?'mobileMax':'desktopMax',mobile?40:90)*multiplier):0;
    const ramp=8; let added=0;
    while(this.rain.length<target && added<ramp){ added++; const phase=(this.rain.length*37%100)/100; const s=this.scene.add.image(Math.round(phase*768),Math.round((this.rain.length*71)%480),'campus-atlas','rain_streak').setDepth(9).setAlpha(.55); s.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); this.rain.push({sprite:s,vy:160+phase*90}); }
    let removed=0; while(this.rain.length>target && removed<ramp){removed++;this.rain.pop()?.sprite.destroy();}
    for(const r of this.rain){r.sprite.x=Math.round(r.sprite.x-45*delta/1000);r.sprite.y=Math.round(r.sprite.y+r.vy*delta/1000);if(r.sprite.y>490 || r.sprite.x<-12){r.sprite.y=-10;r.sprite.x=Math.round(Math.abs(Math.sin(now*.001+r.vy))*768);}}
  }
  clear(){this.leaves.forEach(l=>l.sprite.destroy());this.leaves=[];this.rain.forEach(r=>r.sprite.destroy());this.rain=[];}
}
