import { create } from 'zustand';
import type { Task } from '../db/schema';

export type AppView = 'home' | 'focus' | 'wrap';

interface UIState {
  view: AppView;
  focusModalOpen: boolean;
  selectedTaskId?: string;
  completedSessionId?: string;
  selectTask: (id?: string) => void;
  setView: (view: AppView) => void;
  setFocusModalOpen: (open: boolean) => void;
  setCompletedSessionId: (id?: string) => void;
  chooseTask: (task: Task) => void;
}

export const useUIStore = create<UIState>((set) => ({
  view: 'home',
  focusModalOpen: false,
  selectedTaskId: undefined,
  completedSessionId: undefined,
  selectTask: (selectedTaskId) => set({ selectedTaskId }),
  setView: (view) => set({ view }),
  setFocusModalOpen: (focusModalOpen) => set({ focusModalOpen }),
  setCompletedSessionId: (completedSessionId) => set({ completedSessionId }),
  chooseTask: (task) => set({ selectedTaskId: task.id, focusModalOpen: true }),
}));
