create table if not exists public.noticia (
  id_noticia uuid primary key default gen_random_uuid(),
  titulo text not null,
  resumo text not null,
  conteudo text not null,
  imagem text,
  data_publicacao date not null default current_date,
  status text not null default 'rascunho',
  constraint noticia_status_check check (status in ('rascunho', 'publicado'))
);

create index if not exists noticia_publicadas_idx
  on public.noticia (data_publicacao desc)
  where status = 'publicado';

alter table public.noticia enable row level security;

drop policy if exists anon_select_noticia_publicada on public.noticia;
create policy anon_select_noticia_publicada
  on public.noticia
  for select
  to anon
  using (status = 'publicado');

drop policy if exists authenticated_select_noticia on public.noticia;
create policy authenticated_select_noticia
  on public.noticia
  for select
  to authenticated
  using (true);

drop policy if exists authenticated_insert_noticia on public.noticia;
create policy authenticated_insert_noticia
  on public.noticia
  for insert
  to authenticated
  with check (true);

drop policy if exists authenticated_update_noticia on public.noticia;
create policy authenticated_update_noticia
  on public.noticia
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists authenticated_delete_noticia on public.noticia;
create policy authenticated_delete_noticia
  on public.noticia
  for delete
  to authenticated
  using (true);

grant select on public.noticia to anon;
grant select, insert, update, delete on public.noticia to authenticated;

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
