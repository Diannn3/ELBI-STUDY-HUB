import type { ActiveTimer, TimerMode } from '../features/focus/domain/timerTypes';

export type TaskStatus = 'todo' | 'doing' | 'done' | 'blocked';
export type SessionResult = 'done' | 'continue' | 'blocked' | 'ended_early';

export interface Course {
  id: string;
  userId: string;
  code: string;
  title: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export interface Task {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  status: TaskStatus;
  today: 0 | 1;
  priority?: 'low' | 'med' | 'high';
  dueAt?: number;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  courseId?: string;
  mode: TimerMode;
  startedAt: number;
  plannedEndAt?: number;
  endedAt: number;
  plannedMinutes?: number;
  actualSeconds: number;
  result: SessionResult;
  createdAt: number;
}

export interface TILNote {
  id: string;
  userId: string;
  sessionId?: string;
  courseId?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

export type HudTheme = 'light' | 'dark' | 'auto';
export type ScenePreset = 'bright' | 'local' | 'rainy';
export type MotionMode = 'full' | 'subtle' | 'reduced';

export interface UserPreferences {
  id: string;
  userId: string;
  ambience: 'rain' | 'night' | 'library' | 'off';
  ambienceVolume: number;
  reducedMotion: boolean;
  hudTheme: HudTheme;
  scenePreset: ScenePreset;
  motionMode: MotionMode;
  persistentStoragePrompted: boolean;
  updatedAt: number;
}

export interface SyncMutation {
  id: string;
  entityType: 'course' | 'task' | 'focus_session' | 'til_note' | 'preferences';
  entityId: string;
  operation: 'upsert' | 'delete';
  payload: unknown;
  createdAt: number;
  attemptCount: number;
  lastError?: string;
}

export interface SyncMeta {
  key: string;
  value: string;
  updatedAt: number;
}

export type { ActiveTimer };
