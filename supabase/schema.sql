-- Gabarita: tabela de correções vinculadas a usuários do Supabase Auth.
-- Execute este arquivo no SQL Editor do seu projeto Supabase.

create table if not exists public.corrections (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  title text not null default '',
  start_question integer not null check (start_question between 1 and 9999),
  answer_key jsonb not null check (jsonb_typeof(answer_key) = 'array'),
  answers jsonb not null check (jsonb_typeof(answers) = 'array'),
  subjects jsonb not null check (jsonb_typeof(subjects) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  check (jsonb_array_length(answer_key) between 1 and 200),
  check (jsonb_array_length(answer_key) = jsonb_array_length(answers)),
  check (jsonb_array_length(answer_key) = jsonb_array_length(subjects))
);

create index if not exists corrections_user_updated_at_idx
  on public.corrections (user_id, updated_at desc);

alter table public.corrections enable row level security;

-- Apenas usuários autenticados podem acessar a tabela.
revoke all on table public.corrections from anon, authenticated;
grant select, insert, update, delete on table public.corrections to authenticated;

drop policy if exists "Users can read their own corrections" on public.corrections;
create policy "Users can read their own corrections"
  on public.corrections
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own corrections" on public.corrections;
create policy "Users can insert their own corrections"
  on public.corrections
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own corrections" on public.corrections;
create policy "Users can update their own corrections"
  on public.corrections
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own corrections" on public.corrections;
create policy "Users can delete their own corrections"
  on public.corrections
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
