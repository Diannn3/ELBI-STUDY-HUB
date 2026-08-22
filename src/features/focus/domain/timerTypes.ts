export type TimerMode = 'pomodoro25' | 'focus50' | 'quiet5' | 'custom' | 'stopwatch';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished' | 'ended_early';

export interface ActiveTimer {
  id: string;
  taskId?: string;
  courseId?: string;
  mode: TimerMode;
  status: TimerStatus;
  startedAt: number;
  plannedEndAt?: number;
  pausedAt?: number;
  accumulatedPauseMs: number;
  plannedMinutes?: number;
  updatedAt: number;
}

export interface DerivedTimer {
  elapsedMs: number;
  remainingMs: number | null;
  isExpired: boolean;
}
