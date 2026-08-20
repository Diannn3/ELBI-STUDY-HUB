import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import type { Task } from '../../db/schema';
import { enqueueMutation } from '../../sync/outbox';

const USER_ID = 'local-user';

export function useTodayTasks() {
  return useLiveQuery(
    () => db.tasks.where('userId').equals(USER_ID).filter(t => t.today === 1 && !t.deletedAt).sortBy('createdAt'),
    [],
    [],
  );
}

export function useTask(taskId?: string) {
  return useLiveQuery(() => taskId ? db.tasks.get(taskId) : undefined, [taskId]);
}

export async function createTask(title: string, courseId?: string) {
  const now = Date.now();
  const task: Task = {
    id: crypto.randomUUID(), userId: USER_ID, courseId, title: title.trim(), status: 'todo', today: 1,
    createdAt: now, updatedAt: now,
  };
  await db.tasks.add(task);
  await enqueueMutation({ entityType: 'task', entityId: task.id, operation: 'upsert', payload: task });
  return task;
}

export async function patchTask(taskId: string, patch: Partial<Task>) {
  const updatedAt = Date.now();
  await db.tasks.update(taskId, { ...patch, updatedAt });
  const task = await db.tasks.get(taskId);
  if (task) await enqueueMutation({ entityType: 'task', entityId: task.id, operation: 'upsert', payload: task });
  return task;
}
