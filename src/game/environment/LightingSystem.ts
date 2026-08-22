import Phaser from 'phaser';
import type { TimeOfDay } from './types';
export class LightingSystem {
  private tint:Phaser.GameObjects.Rectangle; private dappleA:Phaser.GameObjects.Image; private dappleB:Phaser.GameObjects.Image; private cloudShadow:Phaser.GameObjects.Image;
  private currentAlpha=0; private targetAlpha=0; private targetColor=0xffffff;
  constructor(private scene:Phaser.Scene){
    this.tint=scene.add.rectangle(384,240,768,480,0xffffff,0).setDepth(20).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.dappleA=scene.add.image(384,240,'sun_dapple_1').setDepth(10).setAlpha(.14);
    this.dappleB=scene.add.image(384,240,'sun_dapple_2').setDepth(10).setAlpha(0);
    this.cloudShadow=scene.add.image(384,240,'cloud_shadow').setDepth(11).setAlpha(.07);
  }
  setProfile(time:TimeOfDay,rainy:boolean){
    if(rainy){this.targetColor=0x8ea9b8;this.targetAlpha=.18;return;}
    if(time==='morning'){this.targetColor=0xffe5bd;this.targetAlpha=.09;}
    else if(time==='golden'){this.targetColor=0xf6b86a;this.targetAlpha=.16;}
    else if(time==='night'){this.targetColor=0x536b91;this.targetAlpha=.36;}
    else {this.targetColor=0xffffff;this.targetAlpha=0;}
  }
  update(now:number,delta:number,multiplier:number,rainy:boolean){
    this.currentAlpha += (this.targetAlpha-this.currentAlpha)*Math.min(1,delta/1400); this.tint.setFillStyle(this.targetColor,this.currentAlpha);
    const pulse=multiplier<.08?0:(Math.sin(now/6200)+1)/2;
    this.dappleA.setAlpha(rainy?0:.09+pulse*.08); this.dappleB.setAlpha(rainy?0:.08+(1-pulse)*.06);
    this.cloudShadow.x=Math.round(384+Math.sin(now/21000)*110*multiplier); this.cloudShadow.setAlpha(rainy ? .12 : .045 + pulse * .025);
  }
}
