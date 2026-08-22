-- Pass 1.7: scene/HUD/motion preferences. Existing rows receive the approved light/bright/subtle defaults.
alter table public.user_preferences add column if not exists hud_theme text not null default 'light';
alter table public.user_preferences add column if not exists scene_preset text not null default 'bright';
alter table public.user_preferences add column if not exists motion_mode text not null default 'subtle';

do $$ begin
  alter table public.user_preferences add constraint user_preferences_hud_theme_check check (hud_theme in ('light','dark','auto'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.user_preferences add constraint user_preferences_scene_preset_check check (scene_preset in ('bright','local','rainy'));
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.user_preferences add constraint user_preferences_motion_mode_check check (motion_mode in ('full','subtle','reduced'));
exception when duplicate_object then null; end $$;
