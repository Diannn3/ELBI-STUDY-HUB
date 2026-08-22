import type { SyncMutation } from '../db/schema';

const keyMap: Record<string, string> = {
  userId: 'user_id', courseId: 'course_id', taskId: 'task_id', sessionId: 'session_id',
  dueAt: 'due_at', createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
  startedAt: 'started_at', plannedEndAt: 'planned_end_at', endedAt: 'ended_at',
  plannedMinutes: 'planned_minutes', actualSeconds: 'actual_seconds',
  ambienceVolume: 'ambience_volume', reducedMotion: 'reduced_motion', hudTheme: 'hud_theme',
  scenePreset: 'scene_preset', motionMode: 'motion_mode',
  persistentStoragePrompted: 'persistent_storage_prompted',
};

export function toCloudPayload(mutation: SyncMutation, authUserId: string) {
  const payload = mutation.payload as Record<string, unknown> | null;
  if (!payload) return { id: mutation.entityId, user_id: authUserId };
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === 'userId') continue;
    out[keyMap[key] ?? key] = value;
  }
  out.user_id = authUserId;
  return out;
}
