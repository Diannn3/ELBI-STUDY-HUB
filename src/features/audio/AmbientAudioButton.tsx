import { useEffect, useRef, useState } from 'react';
import type { UserPreferences } from '../../db/schema';

type Ambience = UserPreferences['ambience'];
const fileFor: Record<Exclude<Ambience, 'off'>, string> = {
  rain: '/assets/audio/rainy-elbi.ogg',
  night: '/assets/audio/night-insects.ogg',
  library: '/assets/audio/quiet-room.ogg',
};

export function AmbientAudioButton({ ambience, volume }: { ambience: Ambience; volume: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
    if (ambience === 'off') { audio.pause(); setPlaying(false); return; }
    audio.src = fileFor[ambience];
    audio.loop = true;
    if (playing) void audio.play().catch(() => setPlaying(false));
  }, [ambience, volume, playing]);

  useEffect(() => () => audioRef.current?.pause(), []);

  async function toggle() {
    if (ambience === 'off') return;
    if (!audioRef.current) audioRef.current = new Audio(fileFor[ambience]);
    const audio = audioRef.current; audio.loop = true; audio.volume = volume;
    if (playing) { audio.pause(); setPlaying(false); }
    else { try { await audio.play(); setPlaying(true); } catch { setPlaying(false); } }
  }

  return <button className="ambient-toggle" type="button" disabled={ambience === 'off'} aria-pressed={playing} onClick={() => void toggle()}>{playing ? 'MUTE' : 'PLAY'}</button>;
}
