-- Admin notifications: New Client Request, New Job Application (event-driven,
-- stored + markable as read) plus Attendance/Salary reminders (computed live
-- from current data each time the admin panel loads — no cron needed).

create type notification_type as enum ('new_enquiry', 'new_application');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type notification_type not null,
  title text not null,
  message text,
  link text,
  is_read boolean not null default false
);

create index notifications_created_at_idx on notifications (created_at desc);
create index notifications_is_read_idx on notifications (is_read);

alter table notifications enable row level security;

create policy "admin full access notifications" on notifications
  for all to authenticated using (true) with check (true);

grant all on public.notifications to authenticated;

create or replace function notify_new_enquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (type, title, message, link)
  values (
    'new_enquiry',
    'New Client Request',
    new.company_name || ' requested ' || new.guard_count || ' guard(s) in ' || new.location,
    '/admin/enquiries'
  );
  return new;
end;
$$;

create trigger enquiries_notify_insert
  after insert on enquiries
  for each row execute function notify_new_enquiry();

create or replace function notify_new_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (type, title, message, link)
  values (
    'new_application',
    'New Job Application',
    new.full_name || ' applied to join as a security guard',
    '/admin/applications'
  );
  return new;
end;
$$;

create trigger job_applications_notify_insert
  after insert on job_applications
  for each row execute function notify_new_application();
