import { useEffect } from 'react';
import { ensureSeedData } from '../db/db';
import { TodayPanel } from '../features/tasks/TodayPanel';
import { StartFocusModal } from '../features/focus/ui/StartFocusModal';
import { FocusView } from '../features/focus/ui/FocusView';
import { WrapUpView } from '../features/sessions/WrapUpView';
import { HistoryStrip } from '../features/history/HistoryStrip';
import { PhaserGame } from '../game/PhaserGame';
import { useUIStore } from './store';
import { useActiveTimer } from '../features/focus/useActiveTimer';
import { usePreferences } from '../features/settings/usePreferences';
import { SettingsPopover } from '../features/settings/SettingsPopover';
import { useOnlineSync } from '../hooks/useOnlineSync';
import { AmbientAudioButton } from '../features/audio/AmbientAudioButton';

export default function App() {
  const view=useUIStore(s=>s.view); const setView=useUIStore(s=>s.setView); const timer=useActiveTimer(); const {prefs}=usePreferences(); const online=useOnlineSync();
  useEffect(()=>{void ensureSeedData();},[]);
  useEffect(()=>{if(!timer.active)return;if(timer.active.status==='finished'||timer.active.status==='ended_early')setView('wrap');else setView('focus');},[timer.active?.id,timer.active?.status,setView]);
  if(view==='focus')return <FocusView/>; if(view==='wrap')return <WrapUpView/>;
  const hud=prefs?.hudTheme ?? 'light'; const scene=prefs?.scenePreset ?? 'bright'; const motion=prefs?.motionMode ?? 'subtle';
  return <main className="app-shell" data-hud-theme={hud}>
    <div className="scene-layer"><PhaserGame reducedMotion={prefs?.reducedMotion ?? false} motionMode={motion} scenePreset={scene}/></div>
    <div className="scene-vignette" aria-hidden="true"/>
    <header className="topbar">
      <div className="brand"><span className="brand-tree" aria-hidden="true">♣</span><div><strong>ELBI STUDY</strong><small>quiet work, campus rhythm</small></div></div>
      <nav className="home-nav" aria-label="Primary"><button className="is-active">Campus</button><button disabled>Plan</button><button disabled>Learn</button><button disabled>Stats</button></nav>
      <div className="topbar-actions"><span className={`network-chip ${online?'is-online':'is-offline'}`}>{online?'ONLINE':'OFFLINE'}</span><SettingsPopover/></div>
    </header>
    <aside className="home-panel-wrap"><TodayPanel/></aside>
    <footer className="status-dock"><div className="ambient-label"><span className="audio-thumb" aria-hidden="true">♪</span><div><small>AMBIENT</small><strong>{prefs?.ambience==='rain'?'Rainy Elbi':prefs?.ambience==='night'?'Night insects':prefs?.ambience==='library'?'Quiet room':'Off'}</strong></div><AmbientAudioButton ambience={prefs?.ambience ?? 'rain'} volume={prefs?.ambienceVolume ?? .45}/></div><HistoryStrip/></footer>
    <StartFocusModal/>
  </main>;
}
