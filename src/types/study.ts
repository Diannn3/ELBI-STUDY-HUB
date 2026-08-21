export type TaskStatus = 'backlog' | 'today' | 'progress' | 'done';

export type Priority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  course: string;
  due: string | null;
  priority: Priority;
  estimateMin: number | null;
  status: TaskStatus;
  focusedMin: number;
}

export type SessionOutcome = 'done' | 'continue' | 'blocked';

export interface Session {
  id: string;
  taskId: string;
  taskTitle: string;
  course: string;
  minutes: number;
  endedAt: string;
  outcome: SessionOutcome;
  note?: string;
}

export interface Til {
  id: string;
  text: string;
  course: string;
  taskTitle: string;
  createdAt: string;
  sessionMinutes: number;
}

export type TimerModeId = '25-5' | '50-10' | 'quiet-5' | 'custom' | 'flow';

export interface TimerMode {
  id: TimerModeId;
  label: string;
  caption: string;
  minutes: number | null;
  breakMinutes: number | null;
}

export interface Settings {
  reducedMotion: boolean;
  notifications: boolean;
  ambienceOn: boolean;
  volume: number;
  cloudSync: boolean;
  highContrastText: boolean;
  defaultMode: TimerModeId;
  customMinutes: number;
}

export type FlowStage = 'campus' | 'setup' | 'focus' | 'wrap' | 'til';