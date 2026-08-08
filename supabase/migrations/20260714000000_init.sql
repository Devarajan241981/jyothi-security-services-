-- JSS (Jyothi Security Services) — initial schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type enquiry_status as enum ('new', 'contacted', 'converted', 'closed');
create type application_status as enum ('new', 'reviewed', 'shortlisted', 'rejected', 'hired');
create type guard_status as enum ('active', 'inactive', 'on_leave');
create type guard_gender as enum ('male', 'female', 'other');
create type shift_type as enum ('day', 'night', 'both');
create type client_status as enum ('active', 'inactive');
create type assignment_status as enum ('active', 'completed', 'cancelled');
create type attendance_status as enum ('present', 'absent', 'leave', 'late');
create type payment_status as enum ('pending', 'paid');
create type calendar_event_type as enum ('assignment', 'salary', 'meeting', 'important');

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public enquiry form submissions ("Request Security Guards")
-- ---------------------------------------------------------------------------
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  premises_type text not null,
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text,
  location text not null,
  guard_count int not null default 1,
  guard_type text,
  preferred_age text,
  languages text[] not null default '{}',
  shift shift_type,
  additional_requirements text,
  status enquiry_status not null default 'new',
  email_sent boolean not null default false,
  email_error text
);

create index enquiries_created_at_idx on enquiries (created_at desc);
create index enquiries_status_idx on enquiries (status);

-- ---------------------------------------------------------------------------
-- Public job applications ("Become a Security Guard")
-- ---------------------------------------------------------------------------
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  age int not null,
  phone text not null,
  address text not null,
  experience text,
  languages text[] not null default '{}',
  aadhaar_path text,
  status application_status not null default 'new',
  email_sent boolean not null default false,
  email_error text
);

create index job_applications_created_at_idx on job_applications (created_at desc);
create index job_applications_status_idx on job_applications (status);

-- ---------------------------------------------------------------------------
-- Clients (schools, industries, factories, companies, apartments, ...)
-- ---------------------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  type text not null,
  contact_person text,
  phone text,
  email text,
  address text,
  location text,
  contract_start date,
  contract_end date,
  status client_status not null default 'active',
  notes text
);

create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

create index clients_type_idx on clients (type);
create index clients_status_idx on clients (status);

-- ---------------------------------------------------------------------------
-- Security guards (employee registry)
-- ---------------------------------------------------------------------------
create table guards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  guard_code text not null unique,
  full_name text not null,
  phone text not null,
  gender guard_gender not null default 'male',
  age int,
  languages text[] not null default '{}',
  experience_years numeric(4, 1) default 0,
  address text,
  aadhaar_number text,
  aadhaar_path text,
  photo_path text,
  joining_date date not null default current_date,
  salary numeric(10, 2),
  shift shift_type not null default 'day',
  current_client_id uuid references clients (id) on delete set null,
  current_location text,
  status guard_status not null default 'active'
);

create trigger guards_set_updated_at
  before update on guards
  for each row execute function set_updated_at();

create index guards_status_idx on guards (status);
create index guards_client_idx on guards (current_client_id);

-- ---------------------------------------------------------------------------
-- Assignments (guard <-> client shift bookings)
-- ---------------------------------------------------------------------------
create table assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guard_id uuid not null references guards (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  shift shift_type not null default 'day',
  location text,
  start_date date not null default current_date,
  end_date date,
  status assignment_status not null default 'active'
);

create index assignments_guard_idx on assignments (guard_id);
create index assignments_client_idx on assignments (client_id);
create index assignments_status_idx on assignments (status);

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------
create table attendance (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guard_id uuid not null references guards (id) on delete cascade,
  attendance_date date not null default current_date,
  status attendance_status not null default 'present',
  notes text,
  unique (guard_id, attendance_date)
);

create index attendance_date_idx on attendance (attendance_date);
create index attendance_guard_idx on attendance (guard_id);

-- ---------------------------------------------------------------------------
-- Salary
-- ---------------------------------------------------------------------------
create table salaries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guard_id uuid not null references guards (id) on delete cascade,
  salary_month date not null, -- first day of the month
  base_salary numeric(10, 2) not null default 0,
  bonus numeric(10, 2) not null default 0,
  deduction numeric(10, 2) not null default 0,
  net_salary numeric(10, 2) generated always as (base_salary + bonus - deduction) stored,
  payment_status payment_status not null default 'pending',
  payment_date date,
  receipt_number text,
  unique (guard_id, salary_month)
);

create index salaries_month_idx on salaries (salary_month);
create index salaries_guard_idx on salaries (guard_id);

-- ---------------------------------------------------------------------------
-- Calendar events (assignments, salary dates, meetings, important events)
-- ---------------------------------------------------------------------------
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  event_date date not null,
  event_type calendar_event_type not null default 'meeting'
);

create index calendar_events_date_idx on calendar_events (event_date);

-- ---------------------------------------------------------------------------
-- Gallery images
-- ---------------------------------------------------------------------------
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_path text not null,
  category text not null,
  caption text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create index gallery_images_category_idx on gallery_images (category);

-- ---------------------------------------------------------------------------
-- Testimonials (managed replacement for the static sample testimonials)
-- ---------------------------------------------------------------------------
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  quote text not null,
  avatar_path text,
  sort_order int not null default 0,
  is_published boolean not null default false
);

-- ---------------------------------------------------------------------------
-- Site settings (singleton row, id is always 1)
-- ---------------------------------------------------------------------------
create table site_settings (
  id int primary key default 1 check (id = 1),
  updated_at timestamptz not null default now(),
  company_name text not null default 'Jyothi Security Services',
  logo_path text,
  contact_numbers jsonb not null default '[]'::jsonb,
  emergency_number text,
  emails jsonb not null default '[]'::jsonb,
  whatsapp_number text,
  office_address text,
  social_media jsonb not null default '{}'::jsonb,
  hero_images jsonb not null default '[]'::jsonb,
  supported_languages text[] not null default '{en,kn,hi,te}'
);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

insert into site_settings (id) values (1);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table enquiries enable row level security;
alter table job_applications enable row level security;
alter table clients enable row level security;
alter table guards enable row level security;
alter table assignments enable row level security;
alter table attendance enable row level security;
alter table salaries enable row level security;
alter table calendar_events enable row level security;
alter table gallery_images enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;

-- Public (anon) can INSERT enquiries/applications from the website forms,
-- but can never read, update, or delete them back out.
create policy "anon can submit enquiries" on enquiries
  for insert to anon with check (true);

create policy "anon can submit applications" on job_applications
  for insert to anon with check (true);

-- Anyone (including anon) can read published gallery/testimonials for the
-- public site; everything else requires an authenticated admin session.
create policy "public can read published gallery" on gallery_images
  for select to anon, authenticated using (is_published = true);

create policy "public can read published testimonials" on testimonials
  for select to anon, authenticated using (is_published = true);

create policy "public can read site settings" on site_settings
  for select to anon, authenticated using (true);

-- Authenticated (admin) users have full access to every table.
create policy "admin full access enquiries" on enquiries
  for all to authenticated using (true) with check (true);
create policy "admin full access applications" on job_applications
  for all to authenticated using (true) with check (true);
create policy "admin full access clients" on clients
  for all to authenticated using (true) with check (true);
create policy "admin full access guards" on guards
  for all to authenticated using (true) with check (true);
create policy "admin full access assignments" on assignments
  for all to authenticated using (true) with check (true);
create policy "admin full access attendance" on attendance
  for all to authenticated using (true) with check (true);
create policy "admin full access salaries" on salaries
  for all to authenticated using (true) with check (true);
create policy "admin full access calendar_events" on calendar_events
  for all to authenticated using (true) with check (true);
create policy "admin full access gallery_images" on gallery_images
  for all to authenticated using (true) with check (true);
create policy "admin full access testimonials" on testimonials
  for all to authenticated using (true) with check (true);
create policy "admin full access site_settings" on site_settings
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Base privileges. RLS policies above only filter *which* rows a role can
-- touch — Postgres still requires the underlying GRANT for the operation
-- itself (SELECT/INSERT/...) before RLS is ever evaluated. Without these,
-- every anon insert and every authenticated admin write fails with
-- "new row violates row-level security policy", even though the policy
-- above is written correctly.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, insert on public.enquiries to anon;
grant all on public.enquiries to authenticated;

grant select, insert on public.job_applications to anon;
grant all on public.job_applications to authenticated;

grant select on public.gallery_images to anon;
grant all on public.gallery_images to authenticated;

grant select on public.testimonials to anon;
grant all on public.testimonials to authenticated;

grant select on public.site_settings to anon;
grant all on public.site_settings to authenticated;

grant all on public.clients, public.guards, public.assignments, public.attendance, public.salaries, public.calendar_events to authenticated;

-- ---------------------------------------------------------------------------
-- Public write RPCs. On some projects, a direct anon `.insert()` against
-- enquiries/job_applications via the REST API has been observed to fail
-- with "new row violates row-level security policy" even with a verified,
-- correct INSERT policy and GRANT in place (reproducible even against a
-- brand-new, unrelated test table). Routing the write through a narrowly
-- scoped SECURITY DEFINER function is the standard Postgres/Supabase
-- workaround and is what the app's server actions call instead of
-- `.from(...).insert(...)` for these two public-facing tables.
-- ---------------------------------------------------------------------------
create or replace function public.submit_enquiry(
  p_premises_type text,
  p_company_name text,
  p_contact_person text,
  p_phone text,
  p_location text,
  p_guard_count int,
  p_guard_type text,
  p_languages text[],
  p_shift text,
  p_email text default null,
  p_preferred_age text default null,
  p_additional_requirements text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into enquiries (
    premises_type, company_name, contact_person, phone, location,
    guard_count, guard_type, languages, shift,
    email, preferred_age, additional_requirements
  )
  values (
    p_premises_type, p_company_name, p_contact_person, p_phone, p_location,
    p_guard_count, p_guard_type, p_languages, p_shift::shift_type,
    p_email, p_preferred_age, p_additional_requirements
  )
  returning id into new_id;
  return new_id;
end;
$$;

grant execute on function public.submit_enquiry(text, text, text, text, text, int, text, text[], text, text, text, text) to anon;

create or replace function public.submit_job_application(
  p_full_name text,
  p_age int,
  p_phone text,
  p_address text,
  p_experience text default null,
  p_languages text[] default '{}',
  p_aadhaar_path text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into job_applications (full_name, age, phone, address, experience, languages, aadhaar_path)
  values (p_full_name, p_age, p_phone, p_address, p_experience, p_languages, p_aadhaar_path)
  returning id into new_id;
  return new_id;
end;
$$;

grant execute on function public.submit_job_application(text, int, text, text, text, text[], text) to anon;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('applications', 'applications', false),
  ('guards', 'guards', false),
  ('gallery', 'gallery', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Public can upload (not read) Aadhaar/resume files during job applications.
create policy "anon can upload application files"
  on storage.objects for insert to anon
  with check (bucket_id = 'applications');

create policy "admin can read application files"
  on storage.objects for select to authenticated
  using (bucket_id = 'applications');

create policy "admin manages guard photos"
  on storage.objects for all to authenticated
  using (bucket_id = 'guards') with check (bucket_id = 'guards');

create policy "admin manages gallery"
  on storage.objects for all to authenticated
  using (bucket_id = 'gallery') with check (bucket_id = 'gallery');

create policy "public can view gallery"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gallery');

create policy "admin manages site assets"
  on storage.objects for all to authenticated
  using (bucket_id = 'site-assets') with check (bucket_id = 'site-assets');

create policy "public can view site assets"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-assets');
