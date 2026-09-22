-- Monthly budget categories (e.g. "Dépenses fixes", "Crédit Master")
create table public.sections (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null default 'Nouvelle catégorie',
  color text not null default 'emerald',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Line items within a monthly section
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  user_id text not null,
  label text not null default '',
  amount numeric(12,2) not null default 0,
  due_day text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Annual/yearly expenses, not tied to a monthly section
create table public.annual_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  label text not null default '',
  amount numeric(12,2) not null default 0,
  due_date text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sections_user_id_idx on public.sections(user_id);
create index entries_user_id_idx on public.entries(user_id);
create index entries_section_id_idx on public.entries(section_id);
create index annual_entries_user_id_idx on public.annual_entries(user_id);

alter table public.sections enable row level security;
alter table public.entries enable row level security;
alter table public.annual_entries enable row level security;

-- RLS policies scoped to the Clerk user id exposed via auth.jwt()->>'sub'
-- (requires Supabase Third-Party Auth to be configured with the Clerk integration)
create policy "sections_owner_all" on public.sections
  for all
  using (user_id = (select auth.jwt()->>'sub'))
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "entries_owner_all" on public.entries
  for all
  using (user_id = (select auth.jwt()->>'sub'))
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "annual_entries_owner_all" on public.annual_entries
  for all
  using (user_id = (select auth.jwt()->>'sub'))
  with check (user_id = (select auth.jwt()->>'sub'));
