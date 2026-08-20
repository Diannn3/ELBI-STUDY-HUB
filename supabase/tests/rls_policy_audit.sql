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
