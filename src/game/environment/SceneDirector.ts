import type { EnvironmentPreferences, TimeOfDay } from './types';
export class SceneDirector {
  private prefs:EnvironmentPreferences={scenePreset:'bright',motionMode:'subtle',reducedMotion:false,focusCalm:false};
  setPreferences(next:Partial<EnvironmentPreferences>){this.prefs={...this.prefs,...next};}
  get preferences(){return this.prefs;}
  get motionMultiplier(){if(this.prefs.reducedMotion||this.prefs.motionMode==='reduced')return .03;const base=this.prefs.motionMode==='full'?1:.55;return this.prefs.focusCalm?base*.42:base;}
  get rainy(){return this.prefs.scenePreset==='rainy';}
  get allowBirds(){return !this.prefs.focusCalm&&!this.prefs.reducedMotion&&this.prefs.motionMode!=='reduced'&&!this.rainy;}
  get allowParallax(){return !this.prefs.focusCalm&&!this.prefs.reducedMotion&&this.prefs.motionMode!=='reduced';}
  resolveTimeOfDay(now=Date.now()):TimeOfDay{
    if(this.prefs.scenePreset!=='local')return 'day'; const h=new Date(now).getHours(); if(h<8)return 'morning';if(h<16)return 'day';if(h<19)return 'golden';return 'night';
  }
}
