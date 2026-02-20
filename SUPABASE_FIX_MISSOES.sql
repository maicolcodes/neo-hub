alter table public.missoes enable row level security;

drop policy if exists "neo_allow_insert_missoes" on public.missoes;
create policy "neo_allow_insert_missoes"
on public.missoes
for insert
to authenticated
with check (true);

drop policy if exists "neo_allow_select_missoes" on public.missoes;
create policy "neo_allow_select_missoes"
on public.missoes
for select
to authenticated
using (true);
