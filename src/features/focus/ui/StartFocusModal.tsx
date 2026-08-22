import { useState } from 'react';
import { PixelButton } from '../../../components/pixel/PixelButton';
import { PixelModal } from '../../../components/pixel/PixelModal';
import { useUIStore } from '../../../app/store';
import { useTask } from '../../tasks/useTasks';
import { useActiveTimer } from '../useActiveTimer';
import type { TimerMode } from '../domain/timerTypes';

const MODES: Array<{ mode: TimerMode; label: string; detail: string }> = [
  { mode: 'pomodoro25', label: '25 / 5', detail: 'Classic' },
  { mode: 'focus50', label: '50 / 10', detail: 'Deep block' },
  { mode: 'quiet5', label: 'Quiet 5', detail: 'Just begin' },
  { mode: 'custom', label: 'Custom', detail: '5–120 min' },
  { mode: 'stopwatch', label: 'Flow', detail: 'No deadline' },
];

export function StartFocusModal() {
  const open = useUIStore(s => s.focusModalOpen);
  const close = () => useUIStore.getState().setFocusModalOpen(false);
  const selectedTaskId = useUIStore(s => s.selectedTaskId);
  const setView = useUIStore(s => s.setView);
  const task = useTask(selectedTaskId);
  const timer = useActiveTimer();
  const [mode, setMode] = useState<TimerMode>('pomodoro25');
  const [customMinutes, setCustomMinutes] = useState(35);

  async function start() {
    if (!task) return;
    await timer.start({ taskId: task.id, courseId: task.courseId, mode, customMinutes: mode === 'custom' ? customMinutes : undefined });
    close(); setView('focus');
  }

  return <PixelModal open={open} onClose={close} title="START A FOCUS BLOCK">
    <div className="selected-task-card"><span>WORKING ON</span><strong>{task?.title ?? 'Choose a task first'}</strong></div>
    <fieldset className="mode-grid"><legend>FOCUS MODE</legend>{MODES.map(item => <button type="button" key={item.mode} className={`mode-card ${mode === item.mode ? 'is-selected' : ''}`} onClick={() => setMode(item.mode)}>
      <strong>{item.label}</strong><small>{item.detail}</small>
    </button>)}</fieldset>
    {mode === 'custom' ? <label className="custom-minutes-row"><span>MINUTES</span><input type="number" min={5} max={120} value={customMinutes} onChange={e => setCustomMinutes(Math.max(5, Math.min(120, Number(e.target.value) || 5)))} /></label> : null}
    <div className="ambience-row"><div><span>AMBIENT</span><strong>Rainy Elbi</strong></div><span className="volume-dots" aria-hidden="true">▮▮▮▮▯</span></div>
    <PixelButton variant="primary" disabled={!task} onClick={() => void start()}>BEGIN SESSION</PixelButton>
  </PixelModal>;
}
