-- Políticas de acesso (RLS) para o esquema do Portal Terena.
-- Visitantes (anon) leem o conteúdo público; usuários logados administram tudo.
-- Idempotente: pode ser executada mais de uma vez.

-- Conteúdo público: leitura aberta, escrita só para logados ---------------------
do $$
declare
  t text;
begin
  foreach t in array array['aldeia', 'artesanato', 'contato_aldeia', 'evento', 'projeto', 'tipo_conteudo']
  loop
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

-- Notícias: visitantes só veem as publicadas ------------------------------------
alter table public.noticia enable row level security;

drop policy if exists anon_select_noticia_publicada on public.noticia;
create policy anon_select_noticia_publicada
  on public.noticia for select to anon
  using (status = 'publicado');

drop policy if exists admin_all_noticia on public.noticia;
create policy admin_all_noticia
  on public.noticia for all to authenticated
  using (true) with check (true);

grant select on public.noticia to anon;
grant select, insert, update, delete on public.noticia to authenticated;

-- Mensagens de contato: visitantes só inserem; logados leem e gerenciam ----------
alter table public.mensagem_contato enable row level security;

drop policy if exists anon_insert_mensagem_contato on public.mensagem_contato;
create policy anon_insert_mensagem_contato
  on public.mensagem_contato for insert to anon, authenticated
  with check (autorizacao = true and lida = false);

drop policy if exists admin_select_mensagem_contato on public.mensagem_contato;
create policy admin_select_mensagem_contato
  on public.mensagem_contato for select to authenticated using (true);

drop policy if exists admin_update_mensagem_contato on public.mensagem_contato;
create policy admin_update_mensagem_contato
  on public.mensagem_contato for update to authenticated using (true) with check (true);

drop policy if exists admin_delete_mensagem_contato on public.mensagem_contato;
create policy admin_delete_mensagem_contato
  on public.mensagem_contato for delete to authenticated using (true);

grant insert on public.mensagem_contato to anon;
grant select, insert, update, delete on public.mensagem_contato to authenticated;

-- Usuário: o painel descobre o id_usuario do autor da notícia pelo e-mail do login.
-- Só cria a política se a tabela tiver a coluna email.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'usuario' and column_name = 'email'
  ) then
    execute 'alter table public.usuario enable row level security';
    execute 'drop policy if exists usuario_select_proprio on public.usuario';
    execute $p$
      create policy usuario_select_proprio on public.usuario
        for select to authenticated
        using (lower(email) = lower(auth.jwt() ->> 'email'))
    $p$;
    execute 'grant select on public.usuario to authenticated';
  end if;
end $$;

-- Storage: imagens enviadas pelo painel ficam no bucket público "assets" ----------
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

drop policy if exists authenticated_insert_assets on storage.objects;
create policy authenticated_insert_assets
  on storage.objects for insert to authenticated
  with check (bucket_id = 'assets' and coalesce(array_length(storage.foldername(name), 1), 0) > 0);

drop policy if exists authenticated_update_assets on storage.objects;
create policy authenticated_update_assets
  on storage.objects for update to authenticated
  using (bucket_id = 'assets' and coalesce(array_length(storage.foldername(name), 1), 0) > 0)
  with check (bucket_id = 'assets' and coalesce(array_length(storage.foldername(name), 1), 0) > 0);

drop policy if exists authenticated_delete_assets on storage.objects;
create policy authenticated_delete_assets
  on storage.objects for delete to authenticated
  using (bucket_id = 'assets' and coalesce(array_length(storage.foldername(name), 1), 0) > 0);
