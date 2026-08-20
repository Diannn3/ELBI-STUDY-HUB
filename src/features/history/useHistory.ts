import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { computeTodayStats, computeWeekBars } from './stats';

export function useHistory() {
  const sessions = useLiveQuery(() => db.focusSessions.orderBy('endedAt').reverse().toArray(), [], []);
  const tasks = useLiveQuery(() => db.tasks.where('userId').equals('local-user').toArray(), [], []);
  const today = computeTodayStats(sessions, tasks);
  const week = computeWeekBars(sessions);
  return { sessions, tasks, today, week };
}
