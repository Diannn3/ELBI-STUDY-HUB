import Phaser from 'phaser';
export class ParallaxRig {
  private px=0; private py=0;
  constructor(private scene:Phaser.Scene,private targets:Array<{object:Phaser.GameObjects.GameObject & {x:number;y:number};baseX:number;baseY:number;factor:number}>){ }
  update(enabled:boolean,mobile:boolean){
    if(!enabled||mobile){this.px*=.82;this.py*=.82;} else {const p=this.scene.input.activePointer;this.px=((p.x/768)-.5)*6;this.py=((p.y/480)-.5)*4;}
    for(const t of this.targets){t.object.x=Math.round(t.baseX+this.px*t.factor);t.object.y=Math.round(t.baseY+this.py*t.factor);}
  }
}
