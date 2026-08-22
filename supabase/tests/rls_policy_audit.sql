-- Static audit query for local Supabase. Expected: 24 policies (6 tables x 4 operations).
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles','courses','tasks','focus_sessions','til_notes','user_preferences')
order by tablename, cmd;

-- Every Pass-1 table must have RLS forced on at query boundary.
select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('profiles','courses','tasks','focus_sessions','til_notes','user_preferences')
order by relname;

-- Pass 1.7 preferences remain protected by the existing per-user policies.
select column_name from information_schema.columns where table_schema='public' and table_name='user_preferences' and column_name in ('hud_theme','scene_preset','motion_mode') order by column_name;
