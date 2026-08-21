import React, { useMemo } from 'react';
import { Board, BoardTitle, MicroLabel } from '../components/ui/Board';
import { PixelIcon } from '../components/ui/PixelIcon';
import { formatHours, useStudy } from '../contexts/StudyContext';
import { WEEK_MINUTES } from '../data/seed';
import type { SessionOutcome } from '../types/study';

const OUTCOME_STYLE: Record<SessionOutcome, {label: string;className: string;}> = {
  done: { label: 'Done', className: 'border-forest text-forest' },
  continue: { label: 'Continued', className: 'border-gold-deep text-gold-deep' },
  blocked: { label: 'Blocked', className: 'border-maroon text-maroon' }
};

function SecondaryMetric({
  label,
  value,
  unit




}: {label: string;value: string;unit?: string;}) {
  return (
    <div className="border-l-2 border-dashed border-sandDark pl-4 first:border-l-0 first:pl-0">
      <MicroLabel>{label}</MicroLabel>
      <p className="mt-1.5 flex items-baseline gap-1">
        <span className="font-pixel text-[20px] leading-none text-charcoal">
          {value}
        </span>
        {unit && <span className="text-[11px] text-muted">{unit}</span>}
      </p>
    </div>);

}

export function Stats() {
  const { stats, sessions, tasks } = useStudy();

  const week = useMemo(() => {
    const rows = WEEK_MINUTES.map((d) => ({ ...d }));
    if (stats.liveMin > 0) rows[4].minutes += stats.liveMin;
    return rows;
  }, [stats.liveMin]);

  const peak = Math.max(...week.map((d) => d.minutes), 60);

  const byCourse = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((t) => {
      if (t.focusedMin > 0) map.set(t.course, (map.get(t.course) ?? 0) + t.focusedMin);
    });
    const rows = Array.from(map.entries()).
    map(([course, minutes]) => ({ course, minutes })).
    sort((a, b) => b.minutes - a.minutes);
    const total = rows.reduce((s, r) => s + r.minutes, 0) || 1;
    return rows.map((r) => ({ ...r, share: Math.round(r.minutes / total * 100) }));
  }, [tasks]);

  return (
    <div className="thin-scroll h-full w-full overflow-y-auto bg-sand paper">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-5 p-4 sm:p-6">
        <div>
          <BoardTitle size="lg" rule>
            Stats
          </BoardTitle>
          <p className="mt-2 text-[13px] text-muted">
            Only what tells you whether the work is happening.
          </p>
        </div>

        {/* Primary: today. Everything else is deliberately secondary. */}
        <Board>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-5 p-5">
            <div className="min-w-[190px]">
              <MicroLabel className="text-maroon">Focused today</MicroLabel>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-pixel text-[52px] leading-none text-maroon">
                  {stats.todayMin}
                </span>
                <span className="font-pixel text-[13px] uppercase tracking-pixel text-muted">
                  min
                </span>
              </p>
              <div className="mt-3 flex items-center gap-1" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) =>
                <span
                  key={i}
                  className={`h-2 w-3 ${
                  i < Math.round(stats.todayMin / 120 * 12) ?
                  'bg-gold' :
                  'bg-sandDark'}`
                  } />

                )}
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Goal for the day: 2 hours
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
              <SecondaryMetric label="This week" value={formatHours(stats.weekMin)} />
              <SecondaryMetric label="Sessions" value={String(stats.sessions)} />
              <SecondaryMetric label="Study days" value={stats.studyDays} unit="days" />
            </div>
          </div>
        </Board>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <Board>
            <div className="flex h-full flex-col gap-4 p-4">
              <BoardTitle size="sm">This week</BoardTitle>
              <div className="flex flex-1 items-end gap-3 border-b-2 border-maroon/25 pb-2">
                {week.map((day) => {
                  const height = Math.round(day.minutes / peak * 100);
                  return (
                    <div
                      key={day.day}
                      className="flex flex-1 flex-col items-center justify-end gap-2">
                      
                      <span className="font-pixel text-[9px] text-muted">
                        {day.minutes > 0 ? day.minutes : '·'}
                      </span>
                      <div
                        className={`w-full border-2 ${
                        day.minutes > 0 ?
                        'border-[#012C15] bg-forest' :
                        'border-sandDark bg-sand'}`
                        }
                        style={{ height: `${Math.max(height, 4)}%`, minHeight: 6 }}
                        role="img"
                        aria-label={`${day.day}: ${day.minutes} minutes`} />
                      
                      <span className="font-pixel text-[9px] uppercase tracking-pixel text-charcoal">
                        {day.day}
                      </span>
                    </div>);

                })}
              </div>
              <p className="text-[11px] text-muted">
                Thursday was a rest day. That is fine.
              </p>
            </div>
          </Board>

          <Board>
            <div className="flex h-full flex-col gap-3 p-4">
              <BoardTitle size="sm">Course breakdown</BoardTitle>
              <ul className="flex flex-col gap-3">
                {byCourse.map((row) =>
                <li key={row.course}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-pixel text-[10px] uppercase tracking-pixel text-maroon">
                        {row.course}
                      </span>
                      <span className="text-[11px] text-muted">
                        {formatHours(row.minutes)} · {row.share}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-[10px] w-full border border-maroon-deep/30 bg-sand">
                      <div
                      className="h-full bg-maroon"
                      style={{ width: `${row.share}%` }} />
                    
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </Board>
        </div>

        <Board>
          <div className="flex flex-col gap-3 p-4">
            <BoardTitle size="sm">Recent sessions</BoardTitle>
            <ul className="flex flex-col">
              {sessions.slice(0, 7).map((s) => {
                const style = OUTCOME_STYLE[s.outcome];
                return (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b-2 border-dashed border-sandDark py-2.5 last:border-b-0">
                    
                    <span className="w-[76px] shrink-0 font-pixel text-[10px] uppercase tracking-pixel text-maroon">
                      {s.course}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-charcoal">
                      {s.taskTitle}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] text-muted">
                      <PixelIcon name="clock" size={10} />
                      {s.minutes} min
                    </span>
                    <span className="w-[130px] shrink-0 text-[11px] text-muted">
                      {s.endedAt}
                    </span>
                    <span
                      className={`shrink-0 border px-1.5 py-[2px] font-pixel text-[9px] uppercase tracking-pixel ${style.className}`}>
                      
                      {style.label}
                    </span>
                  </li>);

              })}
            </ul>
          </div>
        </Board>
      </div>
    </div>);

}