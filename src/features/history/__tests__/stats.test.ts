import { describe, expect, it } from 'vitest';
import { computeTodayStats, computeWeekBars, startOfLocalDay } from '../stats';
import type { FocusSession, Task } from '../../../db/schema';

const base = new Date(2026, 7, 21, 12, 0, 0).getTime();
const session = (endedAt:number, seconds:number): FocusSession => ({ id:String(endedAt), userId:'u', mode:'pomodoro25', startedAt:endedAt-seconds*1000, endedAt, actualSeconds:seconds, result:'done', createdAt:endedAt });

describe('derived study stats', () => {
  it('derives today totals from sessions', () => {
    const sessions=[session(base,1500),session(base-3600_000,1620),session(startOfLocalDay(base)-1,500)];
    const tasks=[{id:'t',userId:'u',title:'x',status:'done',today:1,createdAt:base,updatedAt:base} as Task];
    expect(computeTodayStats(sessions,tasks,base)).toEqual({focusSeconds:3120,sessions:2,completedTasks:1});
  });
  it('returns seven weekly buckets', () => expect(computeWeekBars([session(base,60)],base)).toHaveLength(7));
});
