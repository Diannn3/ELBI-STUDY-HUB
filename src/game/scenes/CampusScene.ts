import Phaser from 'phaser';
import { sceneBridge } from '../EventBridge';
import { parseSceneTuning } from '../environment/tiledSceneTuning';
import { SceneDirector } from '../environment/SceneDirector';
import { CloudSystem } from '../environment/CloudSystem';
import { WindSystem } from '../environment/WindSystem';
import { VegetationSystem } from '../environment/VegetationSystem';
import { BirdSystem } from '../environment/BirdSystem';
import { AmbientParticleSystem } from '../environment/AmbientParticleSystem';
import { LightingSystem } from '../environment/LightingSystem';
import { ParallaxRig } from '../environment/ParallaxRig';
import type { EnvironmentPreferences, MotionMode, ScenePreset } from '../environment/types';

export class CampusScene extends Phaser.Scene {
  private director = new SceneDirector();
  private wind = new WindSystem();
  private clouds?: CloudSystem;
  private vegetation?: VegetationSystem;
  private birds?: BirdSystem;
  private particles?: AmbientParticleSystem;
  private lighting?: LightingSystem;
  private parallax?: ParallaxRig;
  private environmentPaused = false;
  private mobile = false;
  private frozen = false;
  private unsubscribers: Array<() => void> = [];

  constructor() { super('CampusScene'); }

  preload() {
    const base='/assets/living/';
    this.load.image('living-sky',`${base}01_sky_base.png`);
    this.load.image('living-haze',`${base}05_haze.png`);
    this.load.image('living-world',`${base}07_world_static.png`);
    this.load.image('sun_dapple_1',`${base}21_sun_dapple_1.png`);
    this.load.image('sun_dapple_2',`${base}21_sun_dapple_2.png`);
    this.load.image('cloud_shadow',`${base}22_cloud_shadow.png`);
    this.load.json('living-map',`${base}scene_living.json`);
    this.load.multiatlas('campus-atlas','/assets/campus-atlas.json','/assets/');
  }

  create() {
    this.cameras.main.setRoundPixels(true);
    const sky=this.add.image(384,240,'living-sky').setDepth(0); sky.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const haze=this.add.image(384,240,'living-haze').setDepth(3); haze.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const world=this.add.image(384,240,'living-world').setDepth(5); world.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    const tuning=parseSceneTuning(this.cache.json.get('living-map'));
    this.clouds=new CloudSystem(this,tuning); this.clouds.create();
    this.vegetation=new VegetationSystem(this,tuning); this.vegetation.create();
    this.birds=new BirdSystem(this,tuning); this.birds.create(this.time.now);
    this.particles=new AmbientParticleSystem(this,tuning);
    this.lighting=new LightingSystem(this);
    this.parallax=new ParallaxRig(this,[{object:haze,baseX:384,baseY:240,factor:.12},{object:world,baseX:384,baseY:240,factor:.26}]);
    this.mobile=window.innerWidth<600 || window.matchMedia?.('(pointer: coarse)').matches===true;
    this.frozen=new URLSearchParams(window.location.search).get('motion')==='freeze';
    const visibilityHandler=()=>{
      this.environmentPaused=document.visibilityState==='hidden';
      if(!this.environmentPaused){this.birds?.reschedule(this.time.now);}
    };
    document.addEventListener('visibilitychange',visibilityHandler);
    this.unsubscribers.push(()=>document.removeEventListener('visibilitychange',visibilityHandler));
    this.unsubscribers.push(
      sceneBridge.on<boolean>('reduced-motion',v=>this.director.setPreferences({reducedMotion:v})),
      sceneBridge.on<MotionMode>('motion-mode',v=>this.director.setPreferences({motionMode:v})),
      sceneBridge.on<ScenePreset>('scene-preset',v=>this.director.setPreferences({scenePreset:v})),
      sceneBridge.on<boolean>('focus-calm',v=>this.director.setPreferences({focusCalm:v})),
    );
    this.scale.on(Phaser.Scale.Events.RESIZE,()=>{this.mobile=window.innerWidth<600 || window.matchMedia?.('(pointer: coarse)').matches===true;});
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.unsubscribers.forEach(fn=>fn());this.particles?.clear();});
    sceneBridge.emit('scene-ready',true);
  }

  update(time:number,delta:number) {
    if(this.environmentPaused)return;
    const safeDelta=Math.min(delta,100); // never simulate a hidden tab's missing minutes
    const mult=this.frozen?0:this.director.motionMultiplier;
    this.wind.update(time,safeDelta,mult);
    this.clouds?.update(safeDelta,mult);
    this.vegetation?.update(time,this.wind.strength,mult);
    this.birds?.update(time,safeDelta,mult,this.director.allowBirds&&!this.frozen);
    this.particles?.update(time,safeDelta,this.wind.strength,mult,this.director.rainy,this.mobile);
    const tod=this.director.resolveTimeOfDay(Date.now()); this.lighting?.setProfile(tod,this.director.rainy); this.lighting?.update(time,safeDelta,mult,this.director.rainy);
    this.parallax?.update(this.director.allowParallax&&!this.frozen,this.mobile);
  }
}
