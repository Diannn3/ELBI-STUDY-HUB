import type { ActiveTimer, DerivedTimer } from './timerTypes';

export function deriveTimer(timer: ActiveTimer, now = Date.now()): DerivedTimer {
  const effectiveNow = timer.status === 'paused' && timer.pausedAt
    ? timer.pausedAt
    : (timer.status === 'finished' || timer.status === 'ended_early')
      ? timer.updatedAt
      : now;
  const elapsedMs = Math.max(0, effectiveNow - timer.startedAt - timer.accumulatedPauseMs);

  if (!timer.plannedEndAt) {
    return { elapsedMs, remainingMs: null, isExpired: false };
  }

  // plannedEndAt is calculated from the original start. Paused time is added back.
  const effectiveEnd = timer.plannedEndAt + timer.accumulatedPauseMs;
  const remainingMs = Math.max(0, effectiveEnd - effectiveNow);
  return { elapsedMs, remainingMs, isExpired: remainingMs === 0 };
}

export function formatClock(ms: number | null): string {
  if (ms === null) return '00:00';
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
