create table if not exists public.material_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  semester text not null,
  subject text,
  request_text text not null,
  status text not null default 'new' check (status in ('new','in_progress','done')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('broken_link','incorrect_info')),
  resource_id uuid references public.study_resources(id) on delete set null,
  subject_code text,
  details text not null,
  status text not null default 'new' check (status in ('new','in_progress','done')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor text not null default 'admin',
  action text not null,
  target_type text not null,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists material_requests_status_created_idx on public.material_requests(status,created_at desc);
create index if not exists content_reports_status_created_idx on public.content_reports(status,created_at desc);
create index if not exists admin_audit_created_idx on public.admin_audit_log(created_at desc);
alter table public.material_requests enable row level security;
alter table public.content_reports enable row level security;
alter table public.admin_audit_log enable row level security;
revoke all on public.material_requests, public.content_reports, public.admin_audit_log from anon, authenticated;
grant all on public.material_requests, public.content_reports, public.admin_audit_log to service_role;
