import React, { useMemo, useState } from 'react';
import { Board, BoardTitle, MicroLabel } from '../components/ui/Board';
import { PixelIcon } from '../components/ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';

export function Learn() {
  const { tils } = useStudy();
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('ALL');

  const courses = useMemo(
    () => ['ALL', ...Array.from(new Set(tils.map((t) => t.course)))],
    [tils]
  );

  const filtered = tils.filter((t) => {
    const matchesQuery =
    !query.trim() ||
    t.text.toLowerCase().includes(query.toLowerCase()) ||
    t.taskTitle.toLowerCase().includes(query.toLowerCase());
    const matchesCourse = course === 'ALL' || t.course === course;
    return matchesQuery && matchesCourse;
  });

  const groups = filtered.reduce<Record<string, typeof filtered>>((acc, til) => {
    acc[til.createdAt] = acc[til.createdAt] || [];
    acc[til.createdAt].push(til);
    return acc;
  }, {});

  return (
    <div className="thin-scroll h-full w-full overflow-y-auto bg-sand paper">
      <div className="mx-auto flex max-w-[900px] flex-col gap-5 p-4 sm:p-6">
        <div>
          <BoardTitle size="lg" rule>
            Learn
          </BoardTitle>
          <p className="mt-2 text-[13px] text-muted">
            Your card archive — one line kept from each finished block.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 border-2 border-maroon-deep bg-cream px-2">
            <span className="text-muted">
              <PixelIcon name="search" size={11} />
            </span>
            <label className="sr-only" htmlFor="til-search">
              Search your TIL entries
            </label>
            <input
              id="til-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries"
              className="min-h-[38px] w-full bg-transparent text-[13px] text-charcoal placeholder:text-muted/70 focus:outline-none" />
            
          </div>
          <div
            role="group"
            aria-label="Filter by course"
            className="flex flex-wrap items-center gap-1">
            
            {courses.map((c) =>
            <button
              key={c}
              type="button"
              onClick={() => setCourse(c)}
              aria-pressed={course === c}
              className={`min-h-[34px] border-2 px-2.5 font-pixel text-[10px] uppercase tracking-pixel transition-colors duration-150 ease-out ${
              course === c ?
              'border-maroon-deep bg-maroon text-cream' :
              'border-sandDark bg-cream text-muted hover:border-maroon/45 hover:text-maroon'}`
              }>
              
                {c}
              </button>
            )}
          </div>
        </div>

        {Object.entries(groups).map(([day, items]) =>
        <section key={day} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MicroLabel className="text-maroon">{day}</MicroLabel>
              <span className="h-[2px] flex-1 bg-sandDark" />
              <span className="font-pixel text-[9px] text-muted">
                {items.length}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((til) =>
            <Board key={til.id} tone="cream">
                  <div className="flex h-full flex-col gap-2 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-pixel text-[10px] uppercase tracking-pixel text-maroon">
                        {til.course}
                      </span>
                      <span className="text-gold-deep">
                        <PixelIcon name="diamond" size={7} />
                      </span>
                    </div>
                    <p className="ruled flex-1 text-[13px] leading-7 text-charcoal">
                      {til.text}
                    </p>
                    <p className="mt-auto border-t-2 border-dashed border-sandDark pt-2 text-[11px] text-muted">
                      {til.taskTitle} · {til.sessionMinutes} min block
                    </p>
                  </div>
                </Board>
            )}
            </div>
          </section>
        )}

        {filtered.length === 0 &&
        <p className="border-2 border-dashed border-sandDark bg-cream px-4 py-8 text-center text-[13px] text-muted">
            No entries match that. Finish a focus block and keep one line.
          </p>
        }
      </div>
    </div>);

}