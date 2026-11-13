create table if not exists public.important_topic_patterns (
  id uuid primary key default gen_random_uuid(),
  subject_code text not null unique,
  subject_title text not null,
  paper_count integer not null default 0 check (paper_count >= 0),
  evidence text not null,
  topics jsonb not null default '[]'::jsonb,
  interpretation_label text not null default 'Past-paper patterns, not predictions',
  source_file text not null default 'src/data/important-topics.json',
  updated_at timestamptz not null default now()
);
alter table public.important_topic_patterns enable row level security;
grant select on public.important_topic_patterns to anon, authenticated;
create policy "Public read past-paper topic patterns"
  on public.important_topic_patterns for select to anon, authenticated using (true);
