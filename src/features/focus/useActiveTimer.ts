import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { createTimer, endTimerEarly, finishTimer, pauseTimer, resumeTimer } from './domain/timerMachine';
import { deriveTimer } from './domain/deriveTimer';
import type { TimerMode } from './domain/timerTypes';

export function useActiveTimer() {
  const active = useLiveQuery(() => db.activeTimers.orderBy('updatedAt').last(), [], undefined);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    const resync = () => setNow(Date.now());
    document.addEventListener('visibilitychange', resync);
    window.addEventListener('focus', resync);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', resync);
      window.removeEventListener('focus', resync);
    };
  }, []);

  const derived = useMemo(() => active ? deriveTimer(active, now) : undefined, [active, now]);

  useEffect(() => {
    if (!active || !derived || active.status !== 'running' || !derived.isExpired) return;
    void db.activeTimers.put(finishTimer(active, now));
  }, [active, derived, now]);

  return {
    active,
    derived,
    async start(input: { taskId?: string; courseId?: string; mode: TimerMode; customMinutes?: number }) {
      await db.activeTimers.clear();
      const timer = createTimer({ id: crypto.randomUUID(), ...input, now: Date.now() });
      await db.activeTimers.put(timer);
      return timer;
    },
    async pause() { if (active) await db.activeTimers.put(pauseTimer(active, Date.now())); },
    async resume() { if (active) await db.activeTimers.put(resumeTimer(active, Date.now())); },
    async endEarly() { if (active) await db.activeTimers.put(endTimerEarly(active, Date.now())); },
    async clear() { await db.activeTimers.clear(); },
  };
}
