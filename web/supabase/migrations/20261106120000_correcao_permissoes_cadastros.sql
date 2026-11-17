-- A01/A02 do relatório de testes (05/11/2026): cadastros do painel não gravavam.
--
-- As tabelas do banco atual não foram criadas pelas migrations deste repositório
-- (as PKs se chamam aldeia_pkey, evento_pkey... e não pk_aldeia), então não há
-- garantia de que as políticas RLS de 20261021120000_conteudo_portal.sql estejam
-- aplicadas. Tabela com RLS ligado e sem política recusa o INSERT (código 42501).
--
-- Esta migration NÃO altera colunas, tipos nem chaves estrangeiras. Ela só:
--   1. garante RLS + políticas + grants nas tabelas usadas pelo painel;
--   2. ressincroniza as sequências das colunas identity (evita 23505 em pkey
--      quando dados foram importados com id explícito);
--   3. garante o bucket "assets" e suas políticas no Storage.
-- Pode ser executada mais de uma vez.

-- 1. Conteúdo público: leitura aberta, escrita para usuários logados -----------
do $$
declare
  t text;
begin
  foreach t in array array[
    'aldeia', 'contato_aldeia', 'evento', 'projeto', 'tipo_conteudo',
    'projeto_aldeia', 'conteudo_aldeia'
  ]
  loop
    if to_regclass('public.' || t) is null then
      raise notice 'Tabela public.% não existe, ignorada.', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', 'publico_select_' || t, t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      'publico_select_' || t, t
    );

    execute format('drop policy if exists %I on public.%I', 'admin_all_' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      'admin_all_' || t, t
    );

    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- Artesanato: visitante vê só o que está disponível; logado administra tudo.
do $$
begin
  if to_regclass('public.artesanato') is null then return; end if;

  alter table public.artesanato enable row level security;

  drop policy if exists anon_select_artesanato_disponivel on public.artesanato;
  create policy anon_select_artesanato_disponivel
    on public.artesanato for select to anon using (disponivel = true);

  drop policy if exists authenticated_select_artesanato on public.artesanato;
  create policy authenticated_select_artesanato
    on public.artesanato for select to authenticated using (true);

  drop policy if exists authenticated_insert_artesanato on public.artesanato;
  create policy authenticated_insert_artesanato
    on public.artesanato for insert to authenticated with check (true);

  drop policy if exists authenticated_update_artesanato on public.artesanato;
  create policy authenticated_update_artesanato
    on public.artesanato for update to authenticated using (true) with check (true);

  drop policy if exists authenticated_delete_artesanato on public.artesanato;
  create policy authenticated_delete_artesanato
    on public.artesanato for delete to authenticated using (true);

  grant select on public.artesanato to anon;
  grant select, insert, update, delete on public.artesanato to authenticated;
end $$;

-- Notícia: visitante vê só as publicadas; a notícia nova grava o autor logado
-- (id_usuario uuid -> auth.users, conforme o schema atual).
do $$
begin
  if to_regclass('public.noticia') is null then return; end if;

  alter table public.noticia enable row level security;

  drop policy if exists anon_select_noticia_publicada on public.noticia;
  create policy anon_select_noticia_publicada
    on public.noticia for select to anon using (status = 'publicado');

  drop policy if exists authenticated_select_noticia on public.noticia;
  create policy authenticated_select_noticia
    on public.noticia for select to authenticated using (true);

  drop policy if exists authenticated_insert_noticia on public.noticia;
  create policy authenticated_insert_noticia
    on public.noticia for insert to authenticated with check (id_usuario = auth.uid());

  drop policy if exists authenticated_update_noticia on public.noticia;
  create policy authenticated_update_noticia
    on public.noticia for update to authenticated using (true) with check (true);

  drop policy if exists authenticated_delete_noticia on public.noticia;
  create policy authenticated_delete_noticia
    on public.noticia for delete to authenticated using (true);

  grant select on public.noticia to anon;
  grant select, insert, update, delete on public.noticia to authenticated;
end $$;

-- 2. Sequências das colunas identity alinhadas ao maior id existente -----------
do $$
declare
  r record;
  seq text;
  maior bigint;
begin
  for r in
    select c.table_name, c.column_name
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.is_identity = 'YES'
      and c.table_name in (
        'aldeia', 'contato_aldeia', 'evento', 'projeto', 'tipo_conteudo',
        'projeto_aldeia', 'conteudo_aldeia', 'artesanato', 'noticia'
      )
  loop
    seq := pg_get_serial_sequence(format('public.%I', r.table_name), r.column_name);
    if seq is null then continue; end if;

    execute format('select max(%I) from public.%I', r.column_name, r.table_name) into maior;
    if maior is null then
      perform setval(seq::regclass, 1, false);
    else
      perform setval(seq::regclass, maior, true);
    end if;
  end loop;
end $$;

-- 3. Storage: bucket público "assets" e escrita para usuários logados ----------
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

drop policy if exists public_select_assets on storage.objects;
create policy public_select_assets
  on storage.objects for select to public
  using (bucket_id = 'assets');

drop policy if exists authenticated_insert_assets on storage.objects;
create policy authenticated_insert_assets
  on storage.objects for insert to authenticated
  with check (bucket_id = 'assets');

drop policy if exists authenticated_update_assets on storage.objects;
create policy authenticated_update_assets
  on storage.objects for update to authenticated
  using (bucket_id = 'assets') with check (bucket_id = 'assets');

drop policy if exists authenticated_delete_assets on storage.objects;
create policy authenticated_delete_assets
  on storage.objects for delete to authenticated
  using (bucket_id = 'assets');
