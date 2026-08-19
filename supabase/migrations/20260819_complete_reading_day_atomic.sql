create or replace function public.complete_reading_day_atomic(p_user_id uuid)
returns public.streaks
language plpgsql
security invoker
set search_path = public
as $$
declare
  auth_clerk_user_id text;
  auth_user_id uuid;
  auth_user_timezone text;
  target_date date;
  target_day_number integer;
  active_plan_id uuid;
  required_morning_count integer;
  required_evening_count integer;
  completed_morning_count integer;
  completed_evening_count integer;
  current_row public.streaks%rowtype;
  next_current_streak integer;
begin
  auth_clerk_user_id := nullif(auth.jwt() ->> 'sub', '');
  if auth_clerk_user_id is null then
    raise exception 'Unable to resolve authenticated Clerk user id.';
  end if;

  select u.id, coalesce(nullif(trim(u.timezone), ''), 'UTC')
    into auth_user_id, auth_user_timezone
  from public.users u
  where u.clerk_user_id = auth_clerk_user_id
    and u.is_active = true
  limit 1;

  if not found then
    raise exception 'No active user mapping found for authenticated identity.';
  end if;

  if p_user_id is distinct from auth_user_id then
    raise exception 'Unauthorized streak completion attempt for user_id=%.', p_user_id;
  end if;

  target_date := (now() at time zone auth_user_timezone)::date;

  select brp.id,
         greatest(1, least(brp.total_days, ((target_date - brp.group_plan_start_date::date) + 1)::integer))
    into active_plan_id, target_day_number
  from public.bible_reading_plan brp
  where brp.is_active = true
  order by brp.group_plan_start_date desc
  limit 1;

  if active_plan_id is null then
    raise exception 'No active Bible reading plan available for streak completion.';
  end if;

  select
    count(*) filter (where rs.session = 'morning'),
    count(*) filter (where rs.session = 'evening')
    into required_morning_count, required_evening_count
  from public.reading_schedule rs
  where rs.plan_id = active_plan_id
    and rs.day_number = target_day_number;

  if required_morning_count = 0 or required_evening_count = 0 then
    raise exception 'Both morning and evening readings must be assigned before streak completion.';
  end if;

  select
    count(distinct rs.id) filter (where rs.session = 'morning' and urp.completed = true),
    count(distinct rs.id) filter (where rs.session = 'evening' and urp.completed = true)
    into completed_morning_count, completed_evening_count
  from public.reading_schedule rs
  left join public.user_reading_progress urp
    on urp.schedule_id = rs.id
    and urp.user_id = auth_user_id
    and urp.completed = true
    and urp.completed_at is not null
    and (urp.completed_at at time zone auth_user_timezone)::date = target_date
  where rs.plan_id = active_plan_id
    and rs.day_number = target_day_number;

  if completed_morning_count < required_morning_count
     or completed_evening_count < required_evening_count then
    raise exception 'Morning and evening reading progress is incomplete for %.', target_date;
  end if;

  insert into public.streaks (
    user_id,
    current_streak,
    longest_streak,
    last_read_date,
    total_days_completed,
    created_at,
    updated_at
  )
  values (
    auth_user_id,
    1,
    1,
    target_date,
    1,
    now(),
    now()
  )
  on conflict (user_id) do nothing;

  select *
    into current_row
  from public.streaks
  where user_id = auth_user_id
  for update;

  if not found then
    raise exception 'Unable to load streak row for user_id=% after upsert.', auth_user_id;
  end if;

  if current_row.last_read_date = target_date then
    return current_row;
  end if;

  if current_row.last_read_date is not null and current_row.last_read_date = (target_date - 1) then
    next_current_streak := current_row.current_streak + 1;
  else
    next_current_streak := 1;
  end if;

  update public.streaks
  set
    current_streak = next_current_streak,
    longest_streak = greatest(current_row.longest_streak, next_current_streak),
    last_read_date = target_date,
    total_days_completed = current_row.total_days_completed + 1,
    updated_at = now()
  where id = current_row.id
  returning * into current_row;

  return current_row;
end;
$$;
