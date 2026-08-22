import Phaser from 'phaser';
import type { SceneTuning } from './types';
import { num } from './tiledSceneTuning';
export class BirdSystem {
  private birds: Phaser.GameObjects.Image[]=[];
  private nextSpawn=0;
  private frame=0;
  constructor(private scene: Phaser.Scene,private tuning:SceneTuning){}
  create(now:number){ this.schedule(now); }
  reschedule(now:number){ this.clear(); this.schedule(now); }
  clear(){ this.birds.forEach(b=>b.destroy()); this.birds=[]; }
  private schedule(now:number){ const m=this.tuning.markers.get('BIRD_PATH_HIGH'); const min=num(m,'spawnMinMs',25000),max=num(m,'spawnMaxMs',60000); const phase=Math.abs(Math.sin(now*0.000017+2.1)); this.nextSpawn=now+min+(max-min)*phase; }
  update(now:number,delta:number,multiplier:number,enabled:boolean){
    if(!enabled||multiplier<0.2){ this.clear(); if(now>=this.nextSpawn)this.schedule(now); return; }
    if(now>=this.nextSpawn && this.birds.length===0){
      const m=this.tuning.markers.get('BIRD_PATH_HIGH'); const y=Math.round((m?.y??45)+Math.abs(Math.sin(now*.001))*Math.max(20,m?.height??90));
      const count=1+Math.floor(Math.abs(Math.sin(now*.0031))*3);
      for(let i=0;i<count;i++){ const b=this.scene.add.image(-20-i*13,y+i*5,'campus-atlas','bird_00').setDepth(5).setAlpha(.78); b.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); b.setData('speed',48+i*3); this.birds.push(b); }
      this.schedule(now);
    }
    this.frame=Math.floor(now/170)%4;
    this.birds=this.birds.filter(b=>{ b.setFrame(`bird_${String(this.frame).padStart(2,'0')}`); b.x=Math.round(b.x+(b.getData('speed') as number)*delta/1000*multiplier); if(b.x>790){b.destroy();return false;} return true; });
  }
}
