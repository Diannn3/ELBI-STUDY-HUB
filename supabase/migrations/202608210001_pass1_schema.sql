-- Elbi Study Hub — Pass 1 schema. Migration-first, local-first sync target.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  display_name text,
  created_at bigint not null default (extract(epoch from clock_timestamp()) * 1000)::bigint,
  updated_at bigint not null default (extract(epoch from clock_timestamp()) * 1000)::bigint
);

create table if not exists public.courses (
  id text primary key,
  user_id uuid not null,
  code text not null,
  title text not null,
  color text not null default '#8bbf6e',
  created_at bigint not null,
  updated_at bigint not null,
  deleted_at bigint
);

create table if not exists public.tasks (
  id text primary key,
  user_id uuid not null,
  course_id text,
  title text not null check (char_length(title) between 1 and 240),
  status text not null check (status in ('todo','doing','done','blocked')),
  today smallint not null default 1 check (today in (0,1)),
  priority text check (priority is null or priority in ('low','med','high')),
  due_at bigint,
  created_at bigint not null,
  updated_at bigint not null,
  deleted_at bigint
);

create table if not exists public.focus_sessions (
  id text primary key,
  user_id uuid not null,
  task_id text,
  course_id text,
  mode text not null check (mode in ('pomodoro25','focus50','quiet5','custom','stopwatch')),
  started_at bigint not null,
  planned_end_at bigint,
  ended_at bigint not null,
  planned_minutes integer,
  actual_seconds integer not null check (actual_seconds >= 0),
  result text not null check (result in ('done','continue','blocked','ended_early')),
  created_at bigint not null
);

create table if not exists public.til_notes (
  id text primary key,
  user_id uuid not null,
  session_id text,
  course_id text,
  content text not null check (char_length(content) between 1 and 2000),
  created_at bigint not null,
  updated_at bigint not null,
  deleted_at bigint
);

create table if not exists public.user_preferences (
  id text primary key,
  user_id uuid not null,
  ambience text not null check (ambience in ('rain','night','library','off')),
  ambience_volume double precision not null check (ambience_volume between 0 and 1),
  reduced_motion boolean not null default false,
  persistent_storage_prompted boolean not null default false,
  updated_at bigint not null
);

create index if not exists courses_user_idx on public.courses(user_id, updated_at);
create index if not exists tasks_user_today_idx on public.tasks(user_id, today, status, updated_at);
create index if not exists focus_sessions_user_ended_idx on public.focus_sessions(user_id, ended_at desc);
create index if not exists til_notes_user_created_idx on public.til_notes(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.til_notes enable row level security;
alter table public.user_preferences enable row level security;

-- One policy per operation keeps intent explicit and makes future audits easier.
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy "courses_select_own" on public.courses for select to authenticated using ((select auth.uid()) = user_id);
create policy "courses_insert_own" on public.courses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "courses_update_own" on public.courses for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "courses_delete_own" on public.courses for delete to authenticated using ((select auth.uid()) = user_id);

create policy "tasks_select_own" on public.tasks for select to authenticated using ((select auth.uid()) = user_id);
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "tasks_update_own" on public.tasks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "tasks_delete_own" on public.tasks for delete to authenticated using ((select auth.uid()) = user_id);

create policy "focus_select_own" on public.focus_sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy "focus_insert_own" on public.focus_sessions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "focus_update_own" on public.focus_sessions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "focus_delete_own" on public.focus_sessions for delete to authenticated using ((select auth.uid()) = user_id);

create policy "til_select_own" on public.til_notes for select to authenticated using ((select auth.uid()) = user_id);
create policy "til_insert_own" on public.til_notes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "til_update_own" on public.til_notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "til_delete_own" on public.til_notes for delete to authenticated using ((select auth.uid()) = user_id);

create policy "prefs_select_own" on public.user_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy "prefs_insert_own" on public.user_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "prefs_update_own" on public.user_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "prefs_delete_own" on public.user_preferences for delete to authenticated using ((select auth.uid()) = user_id);
