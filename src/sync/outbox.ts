import { db } from '../db/db';
import type { SyncMutation } from '../db/schema';

export async function enqueueMutation(mutation: Omit<SyncMutation, 'id' | 'createdAt' | 'attemptCount'>) {
  const createdAt = Date.now();
  const id = `${mutation.entityType}:${mutation.entityId}:${createdAt}:${crypto.randomUUID()}`;
  await db.syncOutbox.add({ ...mutation, id, createdAt, attemptCount: 0 });
  return id;
}
