"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCloudPayload = toCloudPayload;
const keyMap = {
    userId: 'user_id', courseId: 'course_id', taskId: 'task_id', sessionId: 'session_id',
    dueAt: 'due_at', createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    startedAt: 'started_at', plannedEndAt: 'planned_end_at', endedAt: 'ended_at',
    plannedMinutes: 'planned_minutes', actualSeconds: 'actual_seconds',
    ambienceVolume: 'ambience_volume', reducedMotion: 'reduced_motion',
    persistentStoragePrompted: 'persistent_storage_prompted',
};
function toCloudPayload(mutation, authUserId) {
    const payload = mutation.payload;
    if (!payload)
        return { id: mutation.entityId, user_id: authUserId };
    const out = {};
    for (const [key, value] of Object.entries(payload)) {
        if (key === 'userId')
            continue;
        out[keyMap[key] ?? key] = value;
    }
    out.user_id = authUserId;
    return out;
}
