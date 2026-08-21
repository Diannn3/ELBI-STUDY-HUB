import React, { useMemo, useState } from 'react';
import { PixelIcon } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import { COURSES } from '../data/seed';
import type { Task } from '../types/study';

function TaskRow({
  task,
  selected,
  onSelect
}: {
  task: Task;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`today-task ${selected ? 'is-selected' : ''}`}
    >
      <span className="today-task__check" aria-hidden="true">
        {selected ? <span /> : null}
      </span>
      <span className="today-task__copy">
        <strong>{task.course}</strong>
        <span>{task.title}</span>
        {task.due ? <small>{task.due}</small> : null}
      </span>
      <span className="today-task__note" aria-hidden="true">
        <PixelIcon name="note" size={18} />
      </span>
    </button>
  );
}

export function TodayBoard() {
  const { todayTasks, selectedTaskId, selectTask, addTask, openSetup } = useStudy();
  const [title, setTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [course, setCourse] = useState(COURSES[0].code);
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('normal');

  const visibleTasks = useMemo(() => todayTasks.slice(0, 3), [todayTasks]);

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
    <aside className="today-board" aria-label="Today">
      <div className="today-board__cap" aria-hidden="true">
        <span /><span />
      </div>
      <span className="today-board__ornament today-board__ornament--tl" aria-hidden="true" />
      <span className="today-board__ornament today-board__ornament--tr" aria-hidden="true" />
      <span className="today-board__ornament today-board__ornament--bl" aria-hidden="true" />
      <span className="today-board__ornament today-board__ornament--br" aria-hidden="true" />

      <div className="today-board__inner">
        <div className="today-board__title-wrap">
          <h2 className="today-board__title">TODAY</h2>
          <div className="today-board__rule" aria-hidden="true">
            <i /><b /><i />
          </div>
        </div>

        <div className="today-board__tasks" role="radiogroup" aria-label="Choose a task to focus on">
          {visibleTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={task.id === selectedTaskId}
              onSelect={() => selectTask(task.id)}
            />
          ))}
          {visibleTasks.length === 0 ? (
            <p className="today-board__empty">Nothing queued. Add one thing and start.</p>
          ) : null}
        </div>

        <form className="today-board__form" onSubmit={submit}>
          <div className="today-board__input-row">
            <label className="sr-only" htmlFor="quick-task">What do you need to work on?</label>
            <input
              id="quick-task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to work on?"
            />
            <button
              type="button"
              className="today-board__edit"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              title="Task details"
            >
              <span className="pixel-pencil" aria-hidden="true" />
              <span className="sr-only">Task details</span>
            </button>
          </div>

          {showDetails ? (
            <div className="today-board__details">
              <label>
                <span>Course</span>
                <select value={course} onChange={(e) => setCourse(e.target.value)}>
                  {COURSES.map((c) => <option key={c.code}>{c.code}</option>)}
                </select>
              </label>
              <label>
                <span>Due</span>
                <input value={due} onChange={(e) => setDue(e.target.value)} placeholder="Due Friday" />
              </label>
              <div className="today-board__priority" role="group" aria-label="Priority">
                {(['low', 'normal', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={priority === p ? 'is-active' : ''}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <button className="today-board__add" type="submit" disabled={!title.trim()}>
            <span aria-hidden="true">＋</span> Add task
          </button>
        </form>

        <button className="today-board__focus" type="button" onClick={openSetup}>
          <span>START FOCUS</span>
        </button>
      </div>
    </aside>
  );
}
