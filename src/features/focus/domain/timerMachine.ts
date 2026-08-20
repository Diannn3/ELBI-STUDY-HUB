import type { ActiveTimer, TimerMode } from './timerTypes';

const durationByMode: Record<Exclude<TimerMode, 'custom' | 'stopwatch'>, number> = {
  pomodoro25: 25,
  focus50: 50,
  quiet5: 5,
};

export function createTimer(input: {
  id: string;
  taskId?: string;
  courseId?: string;
  mode: TimerMode;
  customMinutes?: number;
  now?: number;
}): ActiveTimer {
  const now = input.now ?? Date.now();
  const plannedMinutes = input.mode === 'custom'
    ? Math.max(1, Math.min(180, input.customMinutes ?? 25))
    : input.mode === 'stopwatch'
      ? undefined
      : durationByMode[input.mode];

  return {
    id: input.id,
    taskId: input.taskId,
    courseId: input.courseId,
    mode: input.mode,
    status: 'running',
    startedAt: now,
    plannedEndAt: plannedMinutes ? now + plannedMinutes * 60_000 : undefined,
    plannedMinutes,
    accumulatedPauseMs: 0,
    updatedAt: now,
  };
}

export function pauseTimer(timer: ActiveTimer, now = Date.now()): ActiveTimer {
  if (timer.status !== 'running') return timer;
  return { ...timer, status: 'paused', pausedAt: now, updatedAt: now };
}

export function resumeTimer(timer: ActiveTimer, now = Date.now()): ActiveTimer {
  if (timer.status !== 'paused' || !timer.pausedAt) return timer;
  const pauseMs = Math.max(0, now - timer.pausedAt);
  return {
    ...timer,
    status: 'running',
    pausedAt: undefined,
    accumulatedPauseMs: timer.accumulatedPauseMs + pauseMs,
    updatedAt: now,
  };
}

export function finishTimer(timer: ActiveTimer, now = Date.now()): ActiveTimer {
  return { ...timer, status: 'finished', pausedAt: undefined, updatedAt: now };
}

export function endTimerEarly(timer: ActiveTimer, now = Date.now()): ActiveTimer {
  return { ...timer, status: 'ended_early', pausedAt: undefined, updatedAt: now };
}
