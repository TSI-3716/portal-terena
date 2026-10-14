create table if not exists public.artesanato (
  id_artesanato uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null,
  categoria text not null,
  imagem text,
  preco numeric(10, 2) not null,
  disponivel boolean not null default true
);

create index if not exists artesanato_disponiveis_idx
  on public.artesanato (nome)
  where disponivel = true;

alter table public.artesanato enable row level security;

drop policy if exists anon_select_artesanato_disponivel on public.artesanato;
create policy anon_select_artesanato_disponivel
  on public.artesanato
  for select
  to anon
  using (disponivel = true);

drop policy if exists authenticated_select_artesanato on public.artesanato;
create policy authenticated_select_artesanato
  on public.artesanato
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_insert_artesanato on public.artesanato;
create policy authenticated_insert_artesanato
  on public.artesanato
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_artesanato on public.artesanato;
create policy authenticated_update_artesanato
  on public.artesanato
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_delete_artesanato on public.artesanato;
create policy authenticated_delete_artesanato
  on public.artesanato
  for delete
  to authenticated
  using (true);

grant select on public.artesanato to anon;
grant select, insert, update, delete on public.artesanato to authenticated;

drop policy if exists authenticated_insert_assets on storage.objects;
create policy authenticated_insert_assets
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'assets'
    and coalesce(array_length(storage.foldername(name), 1), 0) > 0
  );

drop policy if exists authenticated_update_assets on storage.objects;
create policy authenticated_update_assets
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'assets'
    and coalesce(array_length(storage.foldername(name), 1), 0) > 0
  )
  with check (
    bucket_id = 'assets'
    and coalesce(array_length(storage.foldername(name), 1), 0) > 0
  );

drop policy if exists authenticated_delete_assets on storage.objects;
create policy authenticated_delete_assets
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'assets'
    and coalesce(array_length(storage.foldername(name), 1), 0) > 0
  );
