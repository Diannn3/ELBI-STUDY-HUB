import { db } from '../db/db';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { SyncMutation } from '../db/schema';
import { toCloudPayload } from './serialize';

const tableFor = {
  course: 'courses', task: 'tasks', focus_session: 'focus_sessions', til_note: 'til_notes', preferences: 'user_preferences',
} as const;

async function sendMutation(m: SyncMutation, authUserId: string) {
  if (!supabase) return false;
  const table = tableFor[m.entityType];
  if (m.operation === 'delete') {
    const { error } = await supabase.from(table).update({ deleted_at: Date.now() }).eq('id', m.entityId).eq('user_id', authUserId);
    if (error) throw error;
    return true;
  }
  const { error } = await supabase.from(table).upsert(toCloudPayload(m, authUserId));
  if (error) throw error;
  return true;
}

export async function replayOutbox() {
  if (!isSupabaseConfigured || !supabase || !navigator.onLine) return { sent: 0, remaining: await db.syncOutbox.count(), reason: 'offline-or-unconfigured' };
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { sent: 0, remaining: await db.syncOutbox.count(), reason: 'not-authenticated' };
  const batch = await db.syncOutbox.orderBy('createdAt').limit(50).toArray();
  let sent = 0;
  for (const m of batch) {
    try {
      if (await sendMutation(m, user.id)) { await db.syncOutbox.delete(m.id); sent += 1; }
    } catch (caught) {
      await db.syncOutbox.update(m.id, { attemptCount: m.attemptCount + 1, lastError: caught instanceof Error ? caught.message : String(caught) });
      break;
    }
  }
  return { sent, remaining: await db.syncOutbox.count(), reason: undefined };
}
