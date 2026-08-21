import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState } from
'react';
import {
  SEED_SESSIONS,
  SEED_TASKS,
  SEED_TILS,
  TIMER_MODES } from
'../data/seed';
import type {
  FlowStage,
  Session,
  SessionOutcome,
  Settings,
  Task,
  TaskStatus,
  Til,
  TimerModeId } from
'../types/study';

/** Minutes already logged before this prototype session started. */
const BASE_TODAY_MIN = 52;
const BASE_WEEK_MIN = 222;
const BASE_SESSIONS = 8;

interface TimerState {
  modeId: TimerModeId;
  totalSec: number | null;
  elapsedSec: number;
  running: boolean;
  taskId: string | null;
}

interface NewTaskInput {
  title: string;
  course?: string;
  due?: string | null;
  priority?: Task['priority'];
  estimateMin?: number | null;
  status?: TaskStatus;
}

interface StudyValue {
  tasks: Task[];
  sessions: Session[];
  tils: Til[];
  settings: Settings;
  stage: FlowStage;
  timer: TimerState;
  selectedTaskId: string | null;
  selectedTask: Task | undefined;
  outcome: SessionOutcome | null;
  lastSessionMinutes: number;
  toast: string | null;
  stats: {
    todayMin: number;
    weekMin: number;
    sessions: number;
    studyDays: string;
    liveMin: number;
  };
  todayTasks: Task[];
  selectTask: (id: string) => void;
  addTask: (input: NewTaskInput) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  openSetup: () => void;
  closeSetup: () => void;
  beginSession: (modeId: TimerModeId, customMinutes?: number) => void;
  pause: () => void;
  resume: () => void;
  endSession: () => void;
  chooseOutcome: (outcome: SessionOutcome) => void;
  saveTil: (text: string) => void;
  skipTil: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  dismissToast: () => void;
}

const StudyContext = createContext<StudyValue | null>(null);

export function StudyProvider({ children }: {children: React.ReactNode;}) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [tils, setTils] = useState<Til[]>(SEED_TILS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>('t1');
  const [stage, setStage] = useState<FlowStage>('campus');
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);
  const [lastSessionMinutes, setLastSessionMinutes] = useState(25);
  const [toast, setToast] = useState<string | null>(null);
  const [liveMin, setLiveMin] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    reducedMotion: false,
    notifications: true,
    ambienceOn: true,
    volume: 45,
    cloudSync: false,
    highContrastText: false,
    defaultMode: '25-5',
    customMinutes: 35
  });
  const [timer, setTimer] = useState<TimerState>({
    modeId: '25-5',
    totalSec: 25 * 60,
    elapsedSec: 0,
    running: false,
    taskId: null
  });

  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  // ---- timer tick ----
  useEffect(() => {
    if (!timer.running) return;
    const id = window.setInterval(() => {
      setTimer((prev) => {
        if (!prev.running) return prev;
        const next = prev.elapsedSec + 1;
        if (prev.totalSec !== null && next >= prev.totalSec) {
          return { ...prev, elapsedSec: prev.totalSec, running: false };
        }
        return { ...prev, elapsedSec: next };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer.running]);

  // ---- natural completion ----
  useEffect(() => {
    if (
    stage === 'focus' &&
    !timer.running &&
    timer.totalSec !== null &&
    timer.elapsedSec >= timer.totalSec)
    {
      setLastSessionMinutes(Math.max(1, Math.round(timer.totalSec / 60)));
      setStage('wrap');
    }
  }, [stage, timer.running, timer.elapsedSec, timer.totalSec]);

  const selectTask = useCallback((id: string) => setSelectedTaskId(id), []);

  const addTask = useCallback((input: NewTaskInput) => {
    const task: Task = {
      id: `t${Date.now()}`,
      title: input.title,
      course: input.course || 'UNFILED',
      due: input.due ?? null,
      priority: input.priority ?? 'normal',
      estimateMin: input.estimateMin ?? null,
      status: input.status ?? 'today',
      focusedMin: 0
    };
    setTasks((prev) => [...prev, task]);
    setSelectedTaskId(task.id);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openSetup = useCallback(() => setStage('setup'), []);
  const closeSetup = useCallback(() => setStage('campus'), []);

  const beginSession = useCallback(
    (modeId: TimerModeId, customMinutes?: number) => {
      const mode = TIMER_MODES.find((m) => m.id === modeId);
      let totalSec: number | null = null;
      if (modeId === 'custom') totalSec = (customMinutes ?? 35) * 60;else
      if (mode?.minutes) totalSec = mode.minutes * 60;

      setTimer({
        modeId,
        totalSec,
        elapsedSec: 0,
        running: true,
        taskId: selectedTaskId
      });
      if (selectedTaskId) updateTask(selectedTaskId, { status: 'progress' });
      setOutcome(null);
      setStage('focus');
    },
    [selectedTaskId, updateTask]
  );

  const pause = useCallback(
    () => setTimer((p) => ({ ...p, running: false })),
    []
  );
  const resume = useCallback(
    () => setTimer((p) => ({ ...p, running: true })),
    []
  );

  const endSession = useCallback(() => {
    setTimer((p) => ({ ...p, running: false }));
    setLastSessionMinutes(Math.max(1, Math.round(timer.elapsedSec / 60)));
    setStage('wrap');
  }, [timer.elapsedSec]);

  const recordSession = useCallback(
    (chosen: SessionOutcome, minutes: number) => {
      const task = tasks.find((t) => t.id === (timer.taskId ?? selectedTaskId));
      const session: Session = {
        id: `s${Date.now()}`,
        taskId: task?.id ?? 'unknown',
        taskTitle: task?.title ?? 'Untitled',
        course: task?.course ?? 'UNFILED',
        minutes,
        endedAt: 'Today · just now',
        outcome: chosen
      };
      setSessions((prev) => [session, ...prev]);
      setLiveMin((prev) => prev + minutes);
      if (task) {
        updateTask(task.id, {
          focusedMin: task.focusedMin + minutes,
          status: chosen === 'done' ? 'done' : 'progress'
        });
      }
    },
    [tasks, timer.taskId, selectedTaskId, updateTask]
  );

  const chooseOutcome = useCallback(
    (chosen: SessionOutcome) => {
      const minutes = Math.max(1, lastSessionMinutes);
      setOutcome(chosen);
      recordSession(chosen, minutes);

      if (chosen === 'done') {
        setStage('til');
        return;
      }
      if (chosen === 'continue') {
        showToast(`Session saved · ${minutes} min`);
        setStage('setup');
        return;
      }
      showToast(`Session saved · ${minutes} min · marked blocked`);
      setStage('campus');
    },
    [lastSessionMinutes, recordSession, showToast]
  );

  const saveTil = useCallback(
    (text: string) => {
      const task = tasks.find((t) => t.id === (timer.taskId ?? selectedTaskId));
      const til: Til = {
        id: `l${Date.now()}`,
        text,
        course: task?.course ?? 'UNFILED',
        taskTitle: task?.title ?? 'Untitled',
        createdAt: 'Today',
        sessionMinutes: lastSessionMinutes
      };
      setTils((prev) => [til, ...prev]);
      showToast(`Session saved · ${lastSessionMinutes} min · TIL saved`);
      setStage('campus');
    },
    [tasks, timer.taskId, selectedTaskId, lastSessionMinutes, showToast]
  );

  const skipTil = useCallback(() => {
    showToast(`Session saved · ${lastSessionMinutes} min`);
    setStage('campus');
  }, [lastSessionMinutes, showToast]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  const todayTasks = useMemo(
    () =>
    tasks.filter((t) => t.status === 'today' || t.status === 'progress'),
    [tasks]
  );

  const stats = useMemo(
    () => ({
      todayMin: BASE_TODAY_MIN + liveMin,
      weekMin: BASE_WEEK_MIN + liveMin,
      sessions: BASE_SESSIONS + (sessions.length - SEED_SESSIONS.length),
      studyDays: '4 / 5',
      liveMin
    }),
    [liveMin, sessions.length]
  );

  const value: StudyValue = {
    tasks,
    sessions,
    tils,
    settings,
    stage,
    timer,
    selectedTaskId,
    selectedTask,
    outcome,
    lastSessionMinutes,
    toast,
    stats,
    todayTasks,
    selectTask,
    addTask,
    updateTask,
    moveTask,
    removeTask,
    openSetup,
    closeSetup,
    beginSession,
    pause,
    resume,
    endSession,
    chooseOutcome,
    saveTil,
    skipTil,
    updateSettings,
    dismissToast
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside StudyProvider');
  return ctx;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}