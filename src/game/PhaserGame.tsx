import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';
import { sceneBridge } from './EventBridge';

export function PhaserGame({ reducedMotion }: { reducedMotion: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  useEffect(() => {
    if (!hostRef.current) return;
    gameRef.current = new Phaser.Game(createGameConfig(hostRef.current));
    return () => { gameRef.current?.destroy(true); gameRef.current = null; };
  }, []);
  useEffect(() => { sceneBridge.emit('reduced-motion', reducedMotion); }, [reducedMotion]);
  return <div className="campus-canvas" ref={hostRef} aria-hidden="true" />;
}
