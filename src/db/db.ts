import Dexie, { type EntityTable } from 'dexie';
import type {
  ActiveTimer,
  Course,
  FocusSession,
  SyncMeta,
  SyncMutation,
  Task,
  TILNote,
  UserPreferences,
} from './schema';

export class ElbiStudyDB extends Dexie {
  courses!: EntityTable<Course, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  focusSessions!: EntityTable<FocusSession, 'id'>;
  tilNotes!: EntityTable<TILNote, 'id'>;
  activeTimers!: EntityTable<ActiveTimer, 'id'>;
  preferences!: EntityTable<UserPreferences, 'id'>;
  syncOutbox!: EntityTable<SyncMutation, 'id'>;
  syncMeta!: EntityTable<SyncMeta, 'key'>;

  constructor() {
    super('ElbiStudyDB');
    this.version(1).stores({
      courses: 'id, userId, code, updatedAt, deletedAt',
      tasks: 'id, userId, courseId, status, today, updatedAt, deletedAt',
      focusSessions: 'id, userId, taskId, courseId, startedAt, endedAt',
      tilNotes: 'id, userId, sessionId, courseId, createdAt, updatedAt, deletedAt',
      activeTimers: 'id, taskId, courseId, status, updatedAt',
      preferences: 'id, userId, updatedAt',
      syncOutbox: 'id, entityType, entityId, createdAt, attemptCount',
      syncMeta: 'key, updatedAt',
    });
    this.version(2).stores({
      courses: 'id, userId, code, updatedAt, deletedAt',
      tasks: 'id, userId, courseId, status, today, updatedAt, deletedAt',
      focusSessions: 'id, userId, taskId, courseId, startedAt, endedAt',
      tilNotes: 'id, userId, sessionId, courseId, createdAt, updatedAt, deletedAt',
      activeTimers: 'id, taskId, courseId, status, updatedAt',
      preferences: 'id, userId, hudTheme, scenePreset, motionMode, updatedAt',
      syncOutbox: 'id, entityType, entityId, createdAt, attemptCount',
      syncMeta: 'key, updatedAt',
    }).upgrade(async tx => {
      await tx.table('preferences').toCollection().modify((prefs: Record<string, unknown>) => {
        if (!prefs.hudTheme) prefs.hudTheme = 'light';
        if (!prefs.scenePreset) prefs.scenePreset = 'bright';
        if (!prefs.motionMode) prefs.motionMode = prefs.reducedMotion ? 'reduced' : 'subtle';
      });
    });
  }
}

export const db = new ElbiStudyDB();

export async function ensureSeedData(userId = 'local-user') {
  const courseCount = await db.courses.where('userId').equals(userId).count();
  if (courseCount === 0) {
    const now = Date.now();
    await db.courses.bulkAdd([
      { id: 'course-math', userId, code: 'MATH 28', title: 'Mathematical Analysis', color: '#7FAF72', createdAt: now, updatedAt: now },
      { id: 'course-stat', userId, code: 'STAT 101', title: 'Introduction to Statistics', color: '#D49A63', createdAt: now, updatedAt: now },
    ]);
  }

  const taskCount = await db.tasks.where('userId').equals(userId).count();
  if (taskCount === 0) {
    const now = Date.now();
    await db.tasks.bulkAdd([
      { id: 'task-math-ps3', userId, courseId: 'course-math', title: 'Problem Set 3', status: 'todo', today: 1, priority: 'high', createdAt: now, updatedAt: now },
      { id: 'task-stat-review', userId, courseId: 'course-stat', title: 'Review probability notes', status: 'todo', today: 1, priority: 'med', createdAt: now, updatedAt: now },
    ]);
  }
}
