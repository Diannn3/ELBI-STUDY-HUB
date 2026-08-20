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
  const view = useUIStore(s => s.view);
  const setView = useUIStore(s => s.setView);
  const timer = useActiveTimer();
  const { prefs } = usePreferences();
  const online = useOnlineSync();

  useEffect(() => { void ensureSeedData(); }, []);
  useEffect(() => {
    if (!timer.active) return;
    if (timer.active.status === 'finished' || timer.active.status === 'ended_early') setView('wrap');
    else setView('focus');
  }, [timer.active?.id, timer.active?.status, setView]);

  if (view === 'focus') return <FocusView />;
  if (view === 'wrap') return <WrapUpView />;

  return <main className="app-shell">
    <div className="scene-layer"><PhaserGame reducedMotion={prefs?.reducedMotion ?? false} /></div>
    <div className="scene-vignette" aria-hidden="true" />

    <header className="topbar">
      <div className="brand-plate">
        <span className="brand-pip" aria-hidden="true" />
        <div className="brand-copy"><strong>ELBI STUDY</strong><small>quiet work, campus rhythm</small></div>
      </div>
      <div className="topbar-actions">
        <span className={`network-chip ${online ? 'is-online' : 'is-offline'}`}><i aria-hidden="true" />{online ? 'ONLINE' : 'OFFLINE'}</span>
        <SettingsPopover />
      </div>
    </header>

    <div className="scene-label" aria-hidden="true"><span>CAS FRONT</span><small>DAY CAMPUS</small></div>

    <aside className="home-panel-wrap"><TodayPanel /></aside>

    <footer className="status-dock">
      <div className="ambient-label">
        <img src="/assets/ui/music.png" alt="" aria-hidden="true" />
        <div><small>AMBIENT</small><strong>{prefs?.ambience === 'rain' ? 'Rainy Elbi' : prefs?.ambience === 'night' ? 'Night insects' : prefs?.ambience === 'library' ? 'Quiet room' : 'Off'}</strong></div>
        <AmbientAudioButton ambience={prefs?.ambience ?? 'rain'} volume={prefs?.ambienceVolume ?? .45} />
      </div>
      <HistoryStrip />
    </footer>

    <StartFocusModal />
  </main>;
}
