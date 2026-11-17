-- public.usuario e auth.users passam a ser a mesma pessoa.
-- Iguais: id_usuario = auth.users.id, email = email, senha = encrypted_password.
-- Só existiam em usuario: nome e perfil. Vão para auth.users.raw_user_meta_data.
-- A notícia nova grava o id de quem está logado. A aldeia continua obrigatória.

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'usuario'
  ) then
    update auth.users as au
    set raw_user_meta_data =
      coalesce(au.raw_user_meta_data, '{}'::jsonb)
      || jsonb_strip_nulls(jsonb_build_object('nome', usr.nome, 'perfil', usr.perfil))
    from public.usuario as usr
    where lower(au.email) = lower(usr.email);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'noticia'
      and column_name = 'id_usuario'
      and data_type = 'integer'
  ) then
    alter table public.noticia add column if not exists id_usuario_auth uuid;

    update public.noticia as noticia
    set id_usuario_auth = au.id
    from public.usuario as usr
    join auth.users as au on lower(au.email) = lower(usr.email)
    where noticia.id_usuario = usr.id_usuario
      and noticia.id_usuario_auth is null;

    alter table public.noticia drop constraint if exists fk_noticia_usuario;
    drop index if exists public.idx_noticia_usuario;
    alter table public.noticia drop column id_usuario;
    alter table public.noticia rename column id_usuario_auth to id_usuario;

    alter table public.noticia
      add constraint fk_noticia_usuario
      foreign key (id_usuario) references auth.users (id)
      on update cascade on delete restrict;

    create index if not exists idx_noticia_usuario on public.noticia (id_usuario);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'noticia'
      and column_name = 'id_usuario'
      and is_nullable = 'YES'
  ) and not exists (
    select 1 from public.noticia where id_usuario is null
  ) then
    alter table public.noticia alter column id_usuario set not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'noticia'
      and column_name = 'id_evento'
  ) then
    alter table public.noticia alter column id_evento drop not null;
  end if;
end $$;

drop table if exists public.usuario;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'noticia'
      and column_name = 'id_usuario'
      and udt_name = 'uuid'
  ) then
    drop policy if exists authenticated_insert_noticia on public.noticia;
    create policy authenticated_insert_noticia
      on public.noticia
      for insert
      to authenticated
      with check (id_usuario = auth.uid());
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

drop policy if exists public_select_assets on storage.objects;
create policy public_select_assets
  on storage.objects
  for select
  to public
  using (bucket_id = 'assets');

drop policy if exists authenticated_insert_assets on storage.objects;
create policy authenticated_insert_assets
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'assets');
