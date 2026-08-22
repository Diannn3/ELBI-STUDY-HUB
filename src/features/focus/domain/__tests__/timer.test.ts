import { describe, expect, it } from 'vitest';
import { createTimer, pauseTimer, resumeTimer, endTimerEarly, finishTimer } from '../timerMachine';
import { deriveTimer, formatClock } from '../deriveTimer';

describe('absolute timestamp timer', () => {
  it('derives remaining time without decrement state', () => {
    const t = createTimer({ id: 't', mode: 'pomodoro25', now: 1_000 });
    expect(deriveTimer(t, 2_000).remainingMs).toBe(1_499_000);
    expect(formatClock(deriveTimer(t, 2_000).remainingMs)).toBe('24:59');
  });
  it('freezes while paused and resumes without losing time', () => {
    const t = createTimer({ id: 't', mode: 'quiet5', now: 0 });
    const p = pauseTimer(t, 60_000);
    expect(deriveTimer(p, 180_000).elapsedMs).toBe(60_000);
    const r = resumeTimer(p, 180_000);
    expect(deriveTimer(r, 240_000).elapsedMs).toBe(120_000);
    expect(deriveTimer(r, 240_000).remainingMs).toBe(180_000);
  });
  it('marks expiration from the wall clock', () => {
    const t = createTimer({ id: 't', mode: 'quiet5', now: 0 });
    expect(deriveTimer(t, 300_001).isExpired).toBe(true);
  });
  it('stops elapsed duration after finish/end early', () => {
    const t = createTimer({ id: 't', mode: 'quiet5', now: 0 });
    const early = endTimerEarly(t, 90_000);
    expect(deriveTimer(early, 999_000).elapsedMs).toBe(90_000);
    const done = finishTimer(t, 300_000);
    expect(deriveTimer(done, 999_000).elapsedMs).toBe(300_000);
  });
  it('clamps custom blocks to 1–180 minutes', () => {
    expect(createTimer({ id:'a', mode:'custom', customMinutes: 0, now: 0 }).plannedMinutes).toBe(1);
    expect(createTimer({ id:'b', mode:'custom', customMinutes: 999, now: 0 }).plannedMinutes).toBe(180);
  });
});
