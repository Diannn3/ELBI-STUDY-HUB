import { useState } from 'react';
import { PixelButton } from '../../components/pixel/PixelButton';
import { PixelInput } from '../../components/pixel/PixelInput';
import { PixelPanel } from '../../components/pixel/PixelPanel';
import { createTask, useTodayTasks } from './useTasks';
import { useUIStore } from '../../app/store';

export function TodayPanel() {
  const tasks = useTodayTasks();
  const selectedTaskId = useUIStore(s => s.selectedTaskId);
  const selectTask = useUIStore(s => s.selectTask);
  const setFocusModalOpen = useUIStore(s => s.setFocusModalOpen);
  const [title, setTitle] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const task = await createTask(title);
    setTitle(''); selectTask(task.id);
  }

  return <PixelPanel className="today-panel" title={<><span>TODAY</span><span className="panel-count">{tasks.filter(t => t.status !== 'done').length}</span></>}>
    <div className="task-list" role="listbox" aria-label="Today's tasks">
      {tasks.filter(t => t.status !== 'done').map(task => <button
        key={task.id}
        className={`task-row ${selectedTaskId === task.id ? 'is-selected' : ''}`}
        role="option" aria-selected={selectedTaskId === task.id}
        onClick={() => selectTask(task.id)}>
        <span className={`task-check task-check--${task.status}`} aria-hidden="true" />
        <span className="task-copy"><strong>{task.title}</strong><small>{task.status === 'blocked' ? 'Blocked' : task.status === 'doing' ? 'In progress' : 'Ready'}</small></span>
        {task.priority ? <span className={`priority priority--${task.priority}`}>{task.priority}</span> : null}
      </button>)}
      {!tasks.length ? <div className="empty-state">Add one thing worth finishing today.</div> : null}
    </div>
    <form className="quick-task" onSubmit={submit}>
      <PixelInput aria-label="Quick task title" placeholder="+ Quick task" value={title} onChange={e => setTitle(e.target.value)} />
    </form>
    <PixelButton variant="primary" disabled={!selectedTaskId} onClick={() => setFocusModalOpen(true)}>START FOCUS <span aria-hidden="true">&gt;</span></PixelButton>
  </PixelPanel>;
}
