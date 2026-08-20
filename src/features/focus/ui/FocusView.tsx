import { useEffect } from 'react';
import { PixelButton } from '../../../components/pixel/PixelButton';
import { PixelPanel } from '../../../components/pixel/PixelPanel';
import { useUIStore } from '../../../app/store';
import { useTask } from '../../tasks/useTasks';
import { formatClock } from '../domain/deriveTimer';
import { useActiveTimer } from '../useActiveTimer';

export function FocusView() {
  const timer = useActiveTimer();
  const task = useTask(timer.active?.taskId);
  const setView = useUIStore(s => s.setView);

  useEffect(() => {
    if (timer.active?.status === 'finished') setView('wrap');
  }, [timer.active?.status, setView]);

  if (!timer.active || !timer.derived) return <PixelPanel><p>No active session.</p><PixelButton onClick={() => setView('home')}>Back home</PixelButton></PixelPanel>;
  const isPaused = timer.active.status === 'paused';
  const isStopwatch = timer.active.mode === 'stopwatch';
  const clock = formatClock(isStopwatch ? timer.derived.elapsedMs : timer.derived.remainingMs ?? 0);
  const plannedMs = (timer.active.plannedMinutes ?? 1) * 60_000;
  const progress = isStopwatch ? 0 : Math.min(100, timer.derived.elapsedMs / plannedMs * 100);

  return <main className="focus-view">
    <div className="focus-topline"><span className="brand-mark">ELBI STUDY</span><span>FOCUS MODE</span></div>
    <PixelPanel className="focus-console">
      <p className="eyebrow">{task ? 'CURRENT WORK' : 'OPEN FOCUS'}</p>
      <h1>{task?.title ?? 'Focus session'}</h1>
      <div className="timer-digits" aria-live="polite">{clock}</div>
      {!isStopwatch ? <div className="timer-track"><span style={{ width: `${progress}%` }} /></div> : null}
      <p className="timer-status">{isPaused ? 'PAUSED — the clock is preserved' : 'Stay with one thing.'}</p>
      <div className="focus-controls">
        <PixelButton variant="primary" onClick={() => void (isPaused ? timer.resume() : timer.pause())}>{isPaused ? 'RESUME' : 'PAUSE'}</PixelButton>
        <PixelButton variant="ghost" onClick={() => { void timer.endEarly(); setView('wrap'); }}>END SESSION</PixelButton>
      </div>
    </PixelPanel>
    <p className="focus-footnote">You can reload or leave this tab. The timer is derived from timestamps, not ticks.</p>
  </main>;
}
