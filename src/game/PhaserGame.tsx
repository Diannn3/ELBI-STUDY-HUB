import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';
import { sceneBridge } from './EventBridge';
import type { MotionMode, ScenePreset } from './environment/types';

export function PhaserGame({ reducedMotion, motionMode='subtle', scenePreset='bright', focusCalm=false }: { reducedMotion: boolean; motionMode?: MotionMode; scenePreset?: ScenePreset; focusCalm?: boolean }) {
  const hostRef=useRef<HTMLDivElement>(null); const gameRef=useRef<Phaser.Game|null>(null);
  useEffect(()=>{if(!hostRef.current)return;gameRef.current=new Phaser.Game(createGameConfig(hostRef.current));return()=>{gameRef.current?.destroy(true);gameRef.current=null;};},[]);
  useEffect(()=>{sceneBridge.emit('reduced-motion',reducedMotion);},[reducedMotion]);
  useEffect(()=>{sceneBridge.emit('motion-mode',motionMode);},[motionMode]);
  useEffect(()=>{sceneBridge.emit('scene-preset',scenePreset);},[scenePreset]);
  useEffect(()=>{sceneBridge.emit('focus-calm',focusCalm);},[focusCalm]);
  return <div className="campus-canvas" ref={hostRef} aria-hidden="true" />;
}
