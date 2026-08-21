import type { Session, Task, Til, TimerMode } from '../types/study';

export const COURSES = [
{ code: 'MATH 28', title: 'Analytic Geometry & Calculus II' },
{ code: 'CMSC 12', title: 'Intro to Computer Programming' },
{ code: 'STAT 101', title: 'Statistical Methods' },
{ code: 'KAS 1', title: 'Kasaysayan ng Pilipinas' },
{ code: 'BIO 11', title: 'General Biology' }];


export const TIMER_MODES: TimerMode[] = [
{ id: '25-5', label: '25 / 5', caption: 'Classic focus', minutes: 25, breakMinutes: 5 },
{ id: '50-10', label: '50 / 10', caption: 'Long block', minutes: 50, breakMinutes: 10 },
{ id: 'quiet-5', label: 'Quiet 5', caption: 'Just begin', minutes: 5, breakMinutes: null },
{ id: 'custom', label: 'Custom', caption: 'Choose duration', minutes: null, breakMinutes: null },
{ id: 'flow', label: 'Flow', caption: 'Open-ended stopwatch', minutes: null, breakMinutes: null }];


export const SEED_TASKS: Task[] = [
{
  id: 't1',
  title: 'Problem Set 3',
  course: 'MATH 28',
  due: 'Due tomorrow',
  priority: 'high',
  estimateMin: 90,
  status: 'today',
  focusedMin: 25
},
{
  id: 't2',
  title: 'Review arrays',
  course: 'CMSC 12',
  due: null,
  priority: 'normal',
  estimateMin: 45,
  status: 'today',
  focusedMin: 0
},
{
  id: 't3',
  title: 'Exercises 4–8',
  course: 'STAT 101',
  due: 'Due Friday',
  priority: 'normal',
  estimateMin: 60,
  status: 'today',
  focusedMin: 0
},
{
  id: 't4',
  title: 'Lab report — enzyme activity',
  course: 'BIO 11',
  due: 'Due Monday',
  priority: 'high',
  estimateMin: 120,
  status: 'progress',
  focusedMin: 50
},
{
  id: 't5',
  title: 'Read Rizal chapters 9–12',
  course: 'KAS 1',
  due: 'Due next week',
  priority: 'low',
  estimateMin: 90,
  status: 'backlog',
  focusedMin: 0
},
{
  id: 't6',
  title: 'Practice partial fractions',
  course: 'MATH 28',
  due: null,
  priority: 'normal',
  estimateMin: 40,
  status: 'backlog',
  focusedMin: 0
},
{
  id: 't7',
  title: 'Debug loops exercise 6',
  course: 'CMSC 12',
  due: null,
  priority: 'low',
  estimateMin: 30,
  status: 'backlog',
  focusedMin: 0
},
{
  id: 't8',
  title: 'Summarize regression notes',
  course: 'STAT 101',
  due: null,
  priority: 'normal',
  estimateMin: 30,
  status: 'done',
  focusedMin: 50
},
{
  id: 't9',
  title: 'Watch lecture recording 4',
  course: 'BIO 11',
  due: null,
  priority: 'low',
  estimateMin: 25,
  status: 'done',
  focusedMin: 25
}];


export const SEED_SESSIONS: Session[] = [
{
  id: 's1',
  taskId: 't1',
  taskTitle: 'Problem Set 3',
  course: 'MATH 28',
  minutes: 25,
  endedAt: 'Today · 9:40 AM',
  outcome: 'continue'
},
{
  id: 's2',
  taskId: 't8',
  taskTitle: 'Summarize regression notes',
  course: 'STAT 101',
  minutes: 27,
  endedAt: 'Today · 8:05 AM',
  outcome: 'done'
},
{
  id: 's3',
  taskId: 't4',
  taskTitle: 'Lab report — enzyme activity',
  course: 'BIO 11',
  minutes: 50,
  endedAt: 'Yesterday · 7:20 PM',
  outcome: 'continue'
},
{
  id: 's4',
  taskId: 't2',
  taskTitle: 'Review arrays',
  course: 'CMSC 12',
  minutes: 25,
  endedAt: 'Yesterday · 4:15 PM',
  outcome: 'blocked',
  note: 'Stuck on 2D indexing — ask in lab.'
},
{
  id: 's5',
  taskId: 't9',
  taskTitle: 'Watch lecture recording 4',
  course: 'BIO 11',
  minutes: 25,
  endedAt: 'Tuesday · 2:00 PM',
  outcome: 'done'
},
{
  id: 's6',
  taskId: 't6',
  taskTitle: 'Practice partial fractions',
  course: 'MATH 28',
  minutes: 50,
  endedAt: 'Monday · 8:30 PM',
  outcome: 'done'
}];


export const SEED_TILS: Til[] = [
{
  id: 'l1',
  text:
  'Dot product distributivity follows from distributing each vector component before summing — the algebra is just bookkeeping.',
  course: 'MATH 28',
  taskTitle: 'Problem Set 3',
  createdAt: 'Today',
  sessionMinutes: 25
},
{
  id: 'l2',
  text:
  'Array indexing starts at 0 because the index is really an offset from the base address, not a position count.',
  course: 'CMSC 12',
  taskTitle: 'Review arrays',
  createdAt: 'Yesterday',
  sessionMinutes: 25
},
{
  id: 'l3',
  text:
  'A p-value answers "how surprising is this data if nothing is going on" — it never tells you the probability the hypothesis is true.',
  course: 'STAT 101',
  taskTitle: 'Summarize regression notes',
  createdAt: 'Yesterday',
  sessionMinutes: 27
},
{
  id: 'l4',
  text:
  'Enzyme activity peaks then collapses past the optimum temperature because the protein denatures — the curve is not symmetric.',
  course: 'BIO 11',
  taskTitle: 'Lab report — enzyme activity',
  createdAt: 'Tuesday',
  sessionMinutes: 50
},
{
  id: 'l5',
  text:
  'Sa Kasaysayan, mahalaga ang pinagmulan ng dokumento — kung sino ang sumulat ay kasinghalaga ng kung ano ang nakasulat.',
  course: 'KAS 1',
  taskTitle: 'Read Rizal chapters 9–12',
  createdAt: 'Monday',
  sessionMinutes: 25
}];


export const WEEK_MINUTES = [
{ day: 'M', minutes: 50 },
{ day: 'T', minutes: 25 },
{ day: 'W', minutes: 75 },
{ day: 'TH', minutes: 0 },
{ day: 'F', minutes: 52 },
{ day: 'S', minutes: 20 },
{ day: 'SU', minutes: 0 }];