import { db } from '../../db/db';
import type { TILNote } from '../../db/schema';
import { enqueueMutation } from '../../sync/outbox';

export async function saveTIL(input: { sessionId?: string; courseId?: string; content: string; userId?: string }) {
  const now = Date.now();
  const note: TILNote = {
    id: crypto.randomUUID(), userId: input.userId ?? 'local-user', sessionId: input.sessionId,
    courseId: input.courseId, content: input.content.trim(), createdAt: now, updatedAt: now,
  };
  await db.tilNotes.add(note);
  await enqueueMutation({ entityType: 'til_note', entityId: note.id, operation: 'upsert', payload: note });
  return note;
}
