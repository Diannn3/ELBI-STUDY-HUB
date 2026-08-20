import { db } from '../../db/db';
import type { ActiveTimer } from '../focus/domain/timerTypes';
import type { FocusSession, SessionResult } from '../../db/schema';
import { deriveTimer } from '../focus/domain/deriveTimer';
import { enqueueMutation } from '../../sync/outbox';
import { patchTask } from '../tasks/useTasks';

const USER_ID = 'local-user';

export async function finalizeSession(timer: ActiveTimer, result: SessionResult, endedAt = Date.now()) {
  const d = deriveTimer(timer, endedAt);
  const session: FocusSession = {
    id: crypto.randomUUID(), userId: USER_ID, taskId: timer.taskId, courseId: timer.courseId,
    mode: timer.mode, startedAt: timer.startedAt, plannedEndAt: timer.plannedEndAt, endedAt,
    plannedMinutes: timer.plannedMinutes, actualSeconds: Math.max(1, Math.round(d.elapsedMs / 1000)),
    result, createdAt: endedAt,
  };
  await db.transaction('rw', db.focusSessions, db.activeTimers, async () => {
    await db.focusSessions.add(session);
    await db.activeTimers.clear();
  });
  if (timer.taskId) {
    if (result === 'done') await patchTask(timer.taskId, { status: 'done' });
    if (result === 'blocked') await patchTask(timer.taskId, { status: 'blocked' });
    if (result === 'continue') await patchTask(timer.taskId, { status: 'doing' });
  }
  await enqueueMutation({ entityType: 'focus_session', entityId: session.id, operation: 'upsert', payload: session });
  return session;
}
