-- KTU Connect Max external catalogue ingestion and verified notices.
-- External repositories are discovery sources; records remain staged until reviewed.
create table if not exists public.external_content_sources (
 id uuid primary key default gen_random_uuid(), name text not null,
 source_type text not null check (source_type in ('repository','website','api','manual')),
 base_url text not null unique, description text, enabled boolean not null default true,
 last_checked_at timestamptz, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.content_import_batches (
 id uuid primary key default gen_random_uuid(),
 source_id uuid references public.external_content_sources(id) on delete set null,
 import_type text not null check (import_type in ('notes','pyq','syllabus','subject_catalogue','timetable','notice','activity_points')),
 status text not null default 'queued' check (status in ('queued','processing','needs_review','completed','failed','cancelled')),
 source_reference text, total_records integer not null default 0 check (total_records >= 0),
 accepted_records integer not null default 0 check (accepted_records >= 0),
 duplicate_records integer not null default 0 check (duplicate_records >= 0),
 rejected_records integer not null default 0 check (rejected_records >= 0),
 error_summary text, started_at timestamptz, completed_at timestamptz,
 created_by text not null default 'admin', created_at timestamptz not null default now()
);
create table if not exists public.content_import_records (
 id uuid primary key default gen_random_uuid(),
 batch_id uuid not null references public.content_import_batches(id) on delete cascade,
 source_id uuid references public.external_content_sources(id) on delete set null,
 record_hash text not null,
 record_type text not null check (record_type in ('resource','subject','module','timetable','notice','activity_rule')),
 source_url text, payload jsonb not null,
 status text not null default 'pending' check (status in ('pending','accepted','duplicate','rejected','published')),
 review_notes text, target_table text, target_id text, reviewed_by text, reviewed_at timestamptz,
 created_at timestamptz not null default now(), unique (batch_id, record_hash)
);
create index if not exists content_import_batches_status_idx on public.content_import_batches(status, created_at desc);
create index if not exists content_import_records_review_idx on public.content_import_records(status, created_at desc);
create index if not exists content_import_records_hash_idx on public.content_import_records(source_id, record_hash);

create table if not exists public.academic_notices (
 id uuid primary key default gen_random_uuid(), title text not null, summary text,
 notice_url text not null, document_url text,
 source_id uuid references public.external_content_sources(id) on delete set null,
 source_published_at timestamptz, scheme_year integer check (scheme_year is null or scheme_year in (2019, 2024)),
 branch_code text, semester smallint check (semester is null or semester between 1 and 12),
 notice_category text not null default 'general',
 verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected','superseded')),
 verified_by text, verified_at timestamptz, verification_notes text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists academic_notices_public_idx on public.academic_notices(verification_status, source_published_at desc);

-- Values are not seeded until checked against the matching official KTU handbook.
create table if not exists public.activity_point_rules (
 id uuid primary key default gen_random_uuid(),
 scheme_year integer not null check (scheme_year in (2019, 2024)),
 group_code text not null, activity_key text not null, activity_name text not null,
 points_per_unit numeric(8,2) not null check (points_per_unit >= 0),
 max_units numeric(8,2), max_points numeric(8,2), evidence_required text,
 source_url text not null, source_page text,
 verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected')),
 verified_by text, verified_at timestamptz, created_at timestamptz not null default now(),
 unique (scheme_year, activity_key)
);
alter table public.external_content_sources enable row level security;
alter table public.content_import_batches enable row level security;
alter table public.content_import_records enable row level security;
alter table public.academic_notices enable row level security;
alter table public.activity_point_rules enable row level security;
revoke all on public.external_content_sources, public.content_import_batches,
 public.content_import_records, public.academic_notices, public.activity_point_rules from anon, authenticated;
grant all on public.external_content_sources, public.content_import_batches,
 public.content_import_records, public.academic_notices, public.activity_point_rules to service_role;
