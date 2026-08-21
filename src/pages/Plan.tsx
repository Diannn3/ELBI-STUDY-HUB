import React, { useState } from 'react';
import { Board, BoardTitle, MicroLabel } from '../components/ui/Board';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelIcon } from '../components/ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import { COURSES } from '../data/seed';
import type { Task, TaskStatus } from '../types/study';

const COLUMNS: {id: TaskStatus;label: string;}[] = [
{ id: 'backlog', label: 'Backlog' },
{ id: 'progress', label: 'In progress' },
{ id: 'done', label: 'Done' }];


const ORDER: TaskStatus[] = ['backlog', 'today', 'progress', 'done'];

function TaskCard({
  task,
  onMove,
  onEdit,
  onRemove,
  onFocus,
  selected,
  onSelect








}: {task: Task;onMove: (dir: -1 | 1) => void;onEdit: (title: string) => void;onRemove: () => void;onFocus: () => void;selected: boolean;onSelect: () => void;}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const commit = () => {
    if (draft.trim()) onEdit(draft.trim());else
    setDraft(task.title);
    setEditing(false);
  };

  return (
    <li
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
      onClick={onSelect}
      className={`group relative cursor-grab border-2 bg-cream px-3 py-2.5 transition-colors duration-150 ease-out active:cursor-grabbing ${
      selected ?
      'border-maroon-deep bg-gold-pale' :
      'border-sandDark hover:border-maroon/40'}`
      }>
      
      {selected &&
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[4px] bg-gold" />
      }
      <div className="flex items-start justify-between gap-2">
        <span className="font-pixel text-[10px] uppercase tracking-pixel text-maroon">
          {task.course}
        </span>
        <span className="flex items-center gap-1 text-muted/60">
          {task.priority === 'high' &&
          <span className="text-maroon" aria-label="High priority">
              <PixelIcon name="bang" size={9} />
            </span>
          }
          <PixelIcon name="drag" size={9} />
        </span>
      </div>

      {editing ?
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(task.title);
            setEditing(false);
          }
        }}
        className="mt-1 w-full border-2 border-maroon bg-cream px-1.5 py-1 text-[13px] text-charcoal focus:outline-none" /> :


      <p
        className={`mt-1 text-[13px] font-medium leading-snug ${
        task.status === 'done' ?
        'text-muted line-through decoration-muted/60' :
        'text-charcoal'}`
        }>
        
          {task.title}
        </p>
      }

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
        {task.due && <span>{task.due}</span>}
        {task.estimateMin && <span>est {task.estimateMin}m</span>}
        {task.focusedMin > 0 &&
        <span className="text-forest">{task.focusedMin}m focused</span>
        }
      </div>

      <div className="mt-2 flex items-center gap-1 border-t-2 border-dashed border-sandDark pt-2 opacity-0 transition-opacity duration-150 ease-out focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(-1);
          }}
          className="min-h-[26px] border-2 border-sandDark px-1.5 font-pixel text-[9px] uppercase tracking-pixel text-muted hover:border-maroon hover:text-maroon">
          
          ←<span className="sr-only">Move {task.title} left</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(1);
          }}
          className="min-h-[26px] border-2 border-sandDark px-1.5 font-pixel text-[9px] uppercase tracking-pixel text-muted hover:border-maroon hover:text-maroon">
          
          →<span className="sr-only">Move {task.title} right</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="min-h-[26px] border-2 border-sandDark px-1.5 font-pixel text-[9px] uppercase tracking-pixel text-muted hover:border-maroon hover:text-maroon">
          
          edit<span className="sr-only"> {task.title}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFocus();
          }}
          className="min-h-[26px] border-2 border-forest px-1.5 font-pixel text-[9px] uppercase tracking-pixel text-forest hover:bg-forest hover:text-cream">
          
          focus<span className="sr-only"> on {task.title}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-auto min-h-[26px] px-1 text-muted/70 hover:text-maroon">
          
          <PixelIcon name="close" size={9} />
          <span className="sr-only">Delete {task.title}</span>
        </button>
      </div>
    </li>);

}

export function Plan() {
  const {
    tasks,
    moveTask,
    updateTask,
    removeTask,
    addTask,
    selectTask,
    selectedTaskId,
    openSetup
  } = useStudy();
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState(COURSES[0].code);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  const shift = (task: Task, dir: -1 | 1) => {
    const idx = ORDER.indexOf(task.status);
    const next = ORDER[Math.min(ORDER.length - 1, Math.max(0, idx + dir))];
    moveTask(task.id, next);
  };

  const todayTasks = tasks.filter(
    (t) => t.status === 'today' || t.status === 'progress'
  );

  return (
    <div className="thin-scroll h-full w-full overflow-y-auto bg-sand paper">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <BoardTitle size="lg" rule>
              Plan
            </BoardTitle>
            <p className="mt-2 text-[13px] text-muted">
              Everything you are carrying this term. Drag a card, or use the arrows
              and keyboard.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTitle.trim()) return;
              addTask({
                title: newTitle.trim(),
                course: newCourse,
                status: 'backlog'
              });
              setNewTitle('');
            }}
            className="flex items-stretch gap-2">
            
            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              aria-label="Course"
              className="min-h-[40px] border-2 border-maroon-deep bg-cream px-2 font-pixel text-[10px] uppercase tracking-pixel text-maroon focus:outline-none">
              
              {COURSES.map((c) =>
              <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              )}
            </select>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add to backlog"
              aria-label="New task title"
              className="min-h-[40px] w-[210px] border-2 border-maroon-deep bg-cream px-2.5 text-[13px] text-charcoal placeholder:text-muted/70 focus:outline-none" />
            
            <PixelButton type="submit" variant="primary" size="md" disabled={!newTitle.trim()}>
              <PixelIcon name="plus" size={10} />
              Add
            </PixelButton>
          </form>
        </div>

        {/* TODAY strip */}
        <Board tone="cream">
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BoardTitle size="sm">Today</BoardTitle>
                <span className="font-pixel text-[9px] text-muted">
                  {todayTasks.length} queued
                </span>
              </div>
              <PixelButton variant="primary" size="sm" pixelLabel onClick={openSetup}>
                Start focus
              </PixelButton>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver('today');
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                if (id) moveTask(id, 'today');
                setDragOver(null);
              }}
              className={`grid gap-2 border-2 border-dashed p-2 sm:grid-cols-2 lg:grid-cols-3 ${
              dragOver === 'today' ?
              'border-gold bg-gold-pale/40' :
              'border-sandDark'}`
              }>
              
              {todayTasks.map((task) =>
              <button
                key={task.id}
                type="button"
                onClick={() => selectTask(task.id)}
                className={`relative border-2 px-3 py-2 text-left transition-colors duration-150 ease-out ${
                task.id === selectedTaskId ?
                'border-maroon-deep bg-gold-pale' :
                'border-sandDark bg-cream hover:border-maroon/40'}`
                }>
                
                  {task.id === selectedTaskId &&
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[4px] bg-gold" />

                }
                  <span className="font-pixel text-[10px] uppercase tracking-pixel text-maroon">
                    {task.course}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium text-charcoal">
                    {task.title}
                  </span>
                </button>
              )}
              {todayTasks.length === 0 &&
              <p className="p-2 text-[12px] text-muted">
                  Drop a card here to work on it today.
                </p>
              }
            </div>
          </div>
        </Board>

        {/* Columns */}
        <div className="grid gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.id);
            return (
              <Board key={col.id} tone={col.id === 'done' ? 'sand' : 'cream'}>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(col.id);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain');
                    if (id) moveTask(id, col.id);
                    setDragOver(null);
                  }}
                  className={`flex h-full min-h-[280px] flex-col gap-3 p-3 transition-colors duration-150 ease-out ${
                  dragOver === col.id ? 'bg-gold-pale/50' : ''}`
                  }>
                  
                  <div className="flex items-center justify-between border-b-2 border-maroon/25 pb-2">
                    <BoardTitle size="sm">{col.label}</BoardTitle>
                    <span className="font-pixel text-[10px] text-muted">
                      {items.length}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {items.map((task) =>
                    <TaskCard
                      key={task.id}
                      task={task}
                      selected={task.id === selectedTaskId}
                      onSelect={() => selectTask(task.id)}
                      onMove={(dir) => shift(task, dir)}
                      onEdit={(title) => updateTask(task.id, { title })}
                      onRemove={() => removeTask(task.id)}
                      onFocus={() => {
                        selectTask(task.id);
                        openSetup();
                      }} />

                    )}
                    {items.length === 0 &&
                    <li className="border-2 border-dashed border-sandDark px-3 py-4 text-[12px] text-muted">
                        Nothing here.
                      </li>
                    }
                  </ul>
                  <p className="mt-auto pt-2">
                    <MicroLabel>
                      {items.reduce((sum, t) => sum + t.focusedMin, 0)} min focused
                    </MicroLabel>
                  </p>
                </div>
              </Board>);

          })}
        </div>
      </div>
    </div>);

}