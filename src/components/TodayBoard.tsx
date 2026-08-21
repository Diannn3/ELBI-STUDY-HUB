import React, { useState } from 'react';
import { Board, BoardTitle, MicroLabel } from './ui/Board';
import { PixelButton } from './ui/PixelButton';
import { PixelIcon } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import { COURSES } from '../data/seed';
import type { Task } from '../types/study';

function TaskRow({
  task,
  selected,
  onSelect




}: {task: Task;selected: boolean;onSelect: () => void;}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative flex w-full items-start gap-3 border-2 px-3 py-2.5 text-left transition-colors duration-150 ease-out ${
      selected ?
      'border-maroon-deep bg-gold-pale' :
      'border-sandDark bg-cream hover:border-maroon/40 hover:bg-sand'}`
      }>
      
      {selected &&
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[5px] bg-gold" />

      }
      <span
        aria-hidden="true"
        className={`mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center border-2 ${
        selected ?
        'border-maroon-deep bg-maroon text-gold' :
        'border-muted/60 bg-cream text-transparent'}`
        }>
        
        <PixelIcon name="check" size={8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-pixel text-[11px] uppercase tracking-pixel text-maroon">
            {task.course}
          </span>
          {task.status === 'progress' &&
          <span className="inline-flex items-center gap-1 border border-forest px-1 py-[1px] text-[9px] font-semibold uppercase tracking-pixel text-forest">
              <span className="h-[5px] w-[5px] bg-forest" />
              in progress
            </span>
          }
        </span>
        <span
          className={`mt-1 block truncate text-[14px] leading-snug ${
          selected ? 'font-semibold text-charcoal' : 'font-medium text-charcoal'}`
          }>
          
          {task.title}
        </span>
        {task.due &&
        <span className="mt-1 block text-[11px] text-muted">{task.due}</span>
        }
      </span>
      {task.priority === 'high' &&
      <span
        className="mt-[2px] text-maroon"
        title="High priority"
        aria-label="High priority">
        
          <PixelIcon name="bang" size={11} />
        </span>
      }
    </button>);

}

export function TodayBoard({ className = '' }: {className?: string;}) {
  const { todayTasks, selectedTaskId, selectTask, addTask, openSetup } = useStudy();
  const [title, setTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [course, setCourse] = useState(COURSES[0].code);
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normal');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      course: showDetails ? course : COURSES[0].code,
      due: due.trim() ? due.trim() : null,
      priority
    });
    setTitle('');
    setDue('');
    setPriority('normal');
    setShowDetails(false);
  };

  return (
    <Board
      as="aside"
      ornaments
      className={`w-full ${className}`}
      aria-label="Today">
      
      <div className="thin-scroll flex max-h-full flex-col gap-4 overflow-y-auto p-4">
        <BoardTitle size="lg" rule className="text-center">
          Today
        </BoardTitle>

        <div
          role="radiogroup"
          aria-label="Choose the task to focus on"
          className="flex flex-col gap-2">
          
          {todayTasks.map((task) =>
          <TaskRow
            key={task.id}
            task={task}
            selected={task.id === selectedTaskId}
            onSelect={() => selectTask(task.id)} />

          )}
          {todayTasks.length === 0 &&
          <p className="border-2 border-dashed border-sandDark px-3 py-4 text-center text-[12px] text-muted">
              Nothing queued. Add one thing below and start.
            </p>
          }
        </div>

        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 border-2 border-sandDark bg-sand px-2 focus-within:border-maroon">
            <span className="text-muted">
              <PixelIcon name="plus" size={11} />
            </span>
            <label className="sr-only" htmlFor="quick-task">
              What do you need to work on?
            </label>
            <input
              id="quick-task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to work on?"
              className="min-h-[38px] w-full bg-transparent text-[13px] text-charcoal placeholder:text-muted/80 focus:outline-none" />
            
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="shrink-0 border-l-2 border-sandDark pl-2 font-pixel text-[9px] uppercase tracking-pixel text-muted transition-colors duration-150 ease-out hover:text-maroon">
              
              {showDetails ? 'less' : 'more'}
            </button>
          </div>

          {showDetails &&
          <div className="grid grid-cols-2 gap-2 border-2 border-dashed border-sandDark bg-sand/60 p-2">
              <label className="col-span-1 flex flex-col gap-1">
                <MicroLabel>Course</MicroLabel>
                <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="min-h-[32px] border-2 border-sandDark bg-cream px-1.5 text-[12px] text-charcoal focus:border-maroon focus:outline-none">
                
                  {COURSES.map((c) =>
                <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                )}
                </select>
              </label>
              <label className="col-span-1 flex flex-col gap-1">
                <MicroLabel>Due</MicroLabel>
                <input
                value={due}
                onChange={(e) => setDue(e.target.value)}
                placeholder="Due Friday"
                className="min-h-[32px] border-2 border-sandDark bg-cream px-1.5 text-[12px] text-charcoal placeholder:text-muted/70 focus:border-maroon focus:outline-none" />
              
              </label>
              <fieldset className="col-span-2 flex items-center gap-2">
                <legend className="sr-only">Priority</legend>
                <MicroLabel className="mr-1">Priority</MicroLabel>
                {(['low', 'normal', 'high'] as const).map((p) =>
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                aria-pressed={priority === p}
                className={`min-h-[28px] border-2 px-2 font-pixel text-[9px] uppercase tracking-pixel transition-colors duration-150 ease-out ${
                priority === p ?
                'border-forest bg-forest text-cream' :
                'border-sandDark bg-cream text-muted hover:border-maroon/40'}`
                }>
                
                    {p}
                  </button>
              )}
              </fieldset>
            </div>
          }

          <PixelButton
            type="submit"
            variant="sand"
            size="sm"
            fullWidth
            disabled={!title.trim()}>
            
            <PixelIcon name="plus" size={10} />
            Add task
          </PixelButton>
        </form>

        <PixelButton
          type="button"
          variant="primary"
          size="lg"
          pixelLabel
          fullWidth
          onClick={openSetup}>
          
          Start focus
        </PixelButton>
      </div>
    </Board>);

}