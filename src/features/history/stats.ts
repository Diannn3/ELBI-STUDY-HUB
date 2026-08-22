import type { FocusSession, Task } from '../../db/schema';

export function startOfLocalDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function computeTodayStats(sessions: FocusSession[], tasks: Task[], now = Date.now()) {
  const start = startOfLocalDay(now);
  const todays = sessions.filter(s => s.endedAt >= start && s.endedAt <= now);
  return {
    focusSeconds: todays.reduce((sum, s) => sum + s.actualSeconds, 0),
    sessions: todays.length,
    completedTasks: tasks.filter(t => t.status === 'done' && t.updatedAt >= start).length,
  };
}

export function computeWeekBars(sessions: FocusSession[], now = Date.now()) {
  const today = new Date(now);
  const day = (today.getDay() + 6) % 7;
  const monday = startOfLocalDay(now) - day * 86_400_000;
  return Array.from({ length: 7 }, (_, i) => {
    const from = monday + i * 86_400_000;
    const to = from + 86_400_000;
    const seconds = sessions.filter(s => s.endedAt >= from && s.endedAt < to).reduce((sum, s) => sum + s.actualSeconds, 0);
    return { day: ['M','T','W','T','F','S','S'][i], seconds };
  });
}
