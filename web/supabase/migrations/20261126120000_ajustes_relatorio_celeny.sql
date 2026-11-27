-- Ajustes do relatório de testes da equipe (itens 05 a 27, 26/11/2026).
--
-- Não apaga colunas nem dados. Pode ser executada mais de uma vez.
--
--   1. Datas automáticas (criado_em / atualizado_em) em notícia, aldeia e
--      conteudo_aldeia (item 07).
--   2. Coluna "fonte" em notícia, aldeia e conteudo_aldeia (itens 08, 15, 17).
--   3. Notícia x aldeia passa a ser N:N (noticia_aldeia). A coluna antiga
--      noticia.id_aldeia fica, opcional, só por compatibilidade (item 13).
--   4. Excluir uma aldeia não apaga nem trava notícias e conteúdos: o vínculo é
--      desfeito (itens 06 e 12).
--   5. tipo_conteudo ganha slug, categoria-pai e ordem. Cultura (com as cinco
--      subcategorias) e Juventude viram módulos do painel (itens 14 a 17).
--   6. conteudo_aldeia ganha resumo, status e fonte; aldeia vira opcional.
--   7. Artesanato: preço e disponibilidade saem do cadastro. As colunas ficam
--      no banco com os valores antigos; o portal mostra todas as peças (item 24).
--   8. Fonte também em evento, projeto e artesanato (item 27).
--   9. imagem_galeria: várias imagens por registro, além da capa (itens 25/27).

-- 1. Datas automáticas -----------------------------------------------------------
create or replace function public.carimbar_atualizacao()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Só carimba quando algo mudou, para não gerar log de UPDATE vazio.
  if tg_op = 'UPDATE' and new is not distinct from old then
    return new;
  end if;
  new.atualizado_em := now();
  if tg_op = 'INSERT' and new.criado_em is null then
    new.criado_em := now();
  end if;
  return new;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array['noticia', 'aldeia', 'conteudo_aldeia'] loop
    execute format(
      'alter table public.%I add column if not exists criado_em timestamptz not null default now()', t);
    execute format(
      'alter table public.%I add column if not exists atualizado_em timestamptz not null default now()', t);
    execute format('drop trigger if exists carimbar_atualizacao on public.%I', t);
    execute format(
      'create trigger carimbar_atualizacao before insert or update on public.%I
         for each row execute function public.carimbar_atualizacao()', t);
  end loop;
end $$;

-- Notícias antigas: a data de cadastro mais fiel que existe é a de publicação.
update public.noticia
set criado_em = data_publicacao::timestamptz
where data_publicacao is not null
  and data_publicacao::timestamptz < criado_em;

-- 2. Fonte ------------------------------------------------------------------------
alter table public.noticia add column if not exists fonte character varying(500);
alter table public.aldeia add column if not exists fonte character varying(500);
alter table public.conteudo_aldeia add column if not exists fonte character varying(500);

-- 3. Notícia N:N aldeia -----------------------------------------------------------
do $$
declare
  v_tipo text;
begin
  select format_type(a.atttypid, a.atttypmod) into v_tipo
  from pg_attribute a
  where a.attrelid = 'public.noticia'::regclass
    and a.attname = 'id_noticia'
    and not a.attisdropped;

  if to_regclass('public.noticia_aldeia') is null then
    execute format(
      'create table public.noticia_aldeia (
         id_noticia %s not null,
         id_aldeia integer not null,
         criado_em timestamptz not null default now(),
         constraint pk_noticia_aldeia primary key (id_noticia, id_aldeia),
         constraint fk_noticia_aldeia_noticia foreign key (id_noticia)
           references public.noticia (id_noticia) on update cascade on delete cascade,
         constraint fk_noticia_aldeia_aldeia foreign key (id_aldeia)
           references public.aldeia (id_aldeia) on update cascade on delete cascade
       )', v_tipo);
  end if;
end $$;

create index if not exists idx_noticia_aldeia_aldeia on public.noticia_aldeia (id_aldeia);

-- Copia o vínculo antigo (uma aldeia por notícia) para a tabela nova.
insert into public.noticia_aldeia (id_noticia, id_aldeia)
select n.id_noticia, n.id_aldeia
from public.noticia n
where n.id_aldeia is not null
on conflict do nothing;

-- A coluna antiga deixa de ser obrigatória (notícia geral do povo Terena).
alter table public.noticia alter column id_aldeia drop not null;

alter table public.noticia_aldeia enable row level security;

drop policy if exists publico_select_noticia_aldeia on public.noticia_aldeia;
create policy publico_select_noticia_aldeia
  on public.noticia_aldeia for select to anon, authenticated using (true);

drop policy if exists admin_all_noticia_aldeia on public.noticia_aldeia;
create policy admin_all_noticia_aldeia
  on public.noticia_aldeia for all to authenticated using (true) with check (true);

revoke all on public.noticia_aldeia from anon, authenticated;
grant select on public.noticia_aldeia to anon;
grant select, insert, update, delete on public.noticia_aldeia to authenticated;

drop trigger if exists auditoria on public.noticia_aldeia;
create trigger auditoria after insert or update or delete on public.noticia_aldeia
  for each row execute function public.auditar_alteracao('id_noticia');

-- 4. Excluir aldeia desfaz o vínculo, sem apagar conteúdo -------------------------
alter table public.noticia drop constraint if exists fk_noticia_aldeia;
alter table public.noticia
  add constraint fk_noticia_aldeia foreign key (id_aldeia)
  references public.aldeia (id_aldeia) on update cascade on delete set null;

alter table public.conteudo_aldeia alter column id_aldeia drop not null;
alter table public.conteudo_aldeia drop constraint if exists fk_conteudo_aldeia;
alter table public.conteudo_aldeia
  add constraint fk_conteudo_aldeia foreign key (id_aldeia)
  references public.aldeia (id_aldeia) on update cascade on delete set null;

-- 5. Tipos de conteúdo: slug, categoria-pai e ordem -------------------------------
alter table public.tipo_conteudo add column if not exists slug character varying(100);
alter table public.tipo_conteudo add column if not exists id_tipo_pai integer;
alter table public.tipo_conteudo add column if not exists ordem smallint not null default 0;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'uq_tipo_conteudo_slug') then
    alter table public.tipo_conteudo add constraint uq_tipo_conteudo_slug unique (slug);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'fk_tipo_conteudo_pai') then
    alter table public.tipo_conteudo
      add constraint fk_tipo_conteudo_pai foreign key (id_tipo_pai)
      references public.tipo_conteudo (id_tipo) on update cascade on delete restrict;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_tipo_conteudo_pai') then
    alter table public.tipo_conteudo
      add constraint ck_tipo_conteudo_pai check (id_tipo_pai is null or id_tipo_pai <> id_tipo);
  end if;
end $$;

create index if not exists idx_tipo_conteudo_pai on public.tipo_conteudo (id_tipo_pai);

-- Tipo novo sem slug ganha um a partir do nome ("Língua Terena" -> "lingua-terena").
create or replace function public.tipo_conteudo_slug()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_base text;
  v_slug text;
  n integer := 1;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  v_base := trim(both '-' from regexp_replace(
    lower(translate(new.nome,
      'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇáàâãäéèêëíìîïóòôõöúùûüç',
      'AAAAAEEEEIIIIOOOOOUUUUCaaaaaeeeeiiiiooooouuuuc')),
    '[^a-z0-9]+', '-', 'g'));
  if v_base = '' then v_base := 'tipo'; end if;

  v_slug := v_base;
  while exists (select 1 from public.tipo_conteudo where slug = v_slug and id_tipo is distinct from new.id_tipo) loop
    n := n + 1;
    v_slug := v_base || '-' || n;
  end loop;

  new.slug := v_slug;
  return new;
end $$;

drop trigger if exists tipo_conteudo_slug on public.tipo_conteudo;
create trigger tipo_conteudo_slug before insert or update on public.tipo_conteudo
  for each row execute function public.tipo_conteudo_slug();

-- Reaproveita "Cultura"/"Juventude" se já foram cadastrados com outro formato.
update public.tipo_conteudo set slug = 'cultura'
where lower(trim(nome)) = 'cultura' and (slug is null or slug = '')
  and not exists (select 1 from public.tipo_conteudo where slug = 'cultura');
update public.tipo_conteudo set slug = 'juventude'
where lower(trim(nome)) = 'juventude' and (slug is null or slug = '')
  and not exists (select 1 from public.tipo_conteudo where slug = 'juventude');

insert into public.tipo_conteudo (nome, descricao, slug, ordem)
select v.nome, v.descricao, v.slug, v.ordem
from (values
  ('Cultura', 'Memória, história, língua, tradições e calendário cultural.', 'cultura', 1),
  ('Juventude', 'Protagonismo, formação e oportunidades da juventude Terena.', 'juventude', 2)
) as v(nome, descricao, slug, ordem)
where not exists (select 1 from public.tipo_conteudo t where t.slug = v.slug)
  and not exists (select 1 from public.tipo_conteudo t where lower(trim(t.nome)) = lower(v.nome));

insert into public.tipo_conteudo (nome, descricao, slug, ordem, id_tipo_pai)
select v.nome, v.descricao, v.slug, v.ordem, pai.id_tipo
from (values
  ('Memória Viva', 'Sabedoria e ensinamentos dos anciãos, guardiões da memória Terena.', 'memoria-viva', 1),
  ('História Terena', 'Origens, trajetória e marcos históricos do povo Terena.', 'historia-terena', 2),
  ('Língua Terena', 'Palavras, expressões e fortalecimento da língua Terena.', 'lingua-terena', 3),
  ('Tradições e Saberes', 'Costumes, rituais, danças, cantos e conhecimentos tradicionais.', 'tradicoes-e-saberes', 4),
  ('Calendário Cultural', 'Eventos e celebrações que marcam o ciclo cultural Terena.', 'calendario-cultural', 5)
) as v(nome, descricao, slug, ordem)
cross join (select id_tipo from public.tipo_conteudo where slug = 'cultura') as pai
where not exists (select 1 from public.tipo_conteudo t where t.slug = v.slug)
  and not exists (select 1 from public.tipo_conteudo t where lower(trim(t.nome)) = lower(v.nome));

-- Se alguma subcategoria já existia com o mesmo nome, só liga à Cultura.
update public.tipo_conteudo t
set id_tipo_pai = pai.id_tipo
from (select id_tipo from public.tipo_conteudo where slug = 'cultura') as pai
where lower(trim(t.nome)) in ('memória viva', 'história terena', 'língua terena',
                              'tradições e saberes', 'calendário cultural')
  and t.id_tipo_pai is null
  and t.id_tipo <> pai.id_tipo;

-- 6. Conteúdos (Cultura e Juventude) ------------------------------------------------
alter table public.conteudo_aldeia add column if not exists resumo text;
alter table public.conteudo_aldeia add column if not exists status character varying(30) not null default 'publicado';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ck_conteudo_aldeia_status') then
    alter table public.conteudo_aldeia
      add constraint ck_conteudo_aldeia_status check (status in ('rascunho', 'publicado'));
  end if;
end $$;

create index if not exists idx_conteudo_tipo on public.conteudo_aldeia (id_tipo);
create index if not exists idx_conteudo_aldeia on public.conteudo_aldeia (id_aldeia);

-- Visitante vê só o que está publicado; logado administra tudo.
drop policy if exists publico_select_conteudo_aldeia on public.conteudo_aldeia;
create policy publico_select_conteudo_aldeia
  on public.conteudo_aldeia for select to anon using (status = 'publicado');

drop policy if exists admin_select_conteudo_aldeia on public.conteudo_aldeia;
create policy admin_select_conteudo_aldeia
  on public.conteudo_aldeia for select to authenticated using (true);

-- 7. Artesanato: todas as peças cadastradas aparecem no portal --------------------
drop policy if exists anon_select_artesanato_disponivel on public.artesanato;
drop policy if exists anon_select_artesanato on public.artesanato;
create policy anon_select_artesanato
  on public.artesanato for select to anon using (true);

-- 8. Fonte em todos os cadastros de conteúdo (item 27) ----------------------------
alter table public.evento add column if not exists fonte character varying(500);
alter table public.projeto add column if not exists fonte character varying(500);
alter table public.artesanato add column if not exists fonte character varying(500);

-- 9. Galeria: várias imagens por registro (itens 25 e 27) -------------------------
-- A coluna "imagem" de cada tabela continua sendo a capa. As imagens extras
-- ficam aqui, apontando para o registro por (entidade, id_registro).
create table if not exists public.imagem_galeria (
  id bigint generated always as identity primary key,
  entidade text not null,
  id_registro text not null,
  caminho character varying(500) not null,
  legenda character varying(200),
  ordem smallint not null default 0,
  criado_em timestamptz not null default now(),
  constraint ck_imagem_galeria_entidade check (
    entidade in ('noticia', 'aldeia', 'evento', 'projeto', 'artesanato', 'conteudo')
  )
);

create index if not exists idx_imagem_galeria_registro
  on public.imagem_galeria (entidade, id_registro, ordem);

alter table public.imagem_galeria enable row level security;

drop policy if exists publico_select_imagem_galeria on public.imagem_galeria;
create policy publico_select_imagem_galeria
  on public.imagem_galeria for select to anon, authenticated using (true);

drop policy if exists admin_all_imagem_galeria on public.imagem_galeria;
create policy admin_all_imagem_galeria
  on public.imagem_galeria for all to authenticated using (true) with check (true);

revoke all on public.imagem_galeria from anon, authenticated;
grant select on public.imagem_galeria to anon;
grant select, insert, update, delete on public.imagem_galeria to authenticated;

drop trigger if exists auditoria on public.imagem_galeria;
create trigger auditoria after insert or update or delete on public.imagem_galeria
  for each row execute function public.auditar_alteracao('id');

-- Registro excluído leva junto as linhas da galeria (os arquivos do Storage
-- são removidos pelo app).
create or replace function public.limpar_galeria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.imagem_galeria
  where entidade = tg_argv[0]
    and id_registro = (to_jsonb(old) ->> tg_argv[1]);
  return old;
end $$;

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('noticia', 'noticia', 'id_noticia'),
      ('aldeia', 'aldeia', 'id_aldeia'),
      ('evento', 'evento', 'id_evento'),
      ('projeto', 'projeto', 'id_projeto'),
      ('artesanato', 'artesanato', 'id_artesanato'),
      ('conteudo_aldeia', 'conteudo', 'id_conteudo')
    ) as t(tabela, entidade, pk)
  loop
    execute format('drop trigger if exists limpar_galeria on public.%I', r.tabela);
    execute format(
      'create trigger limpar_galeria after delete on public.%I
         for each row execute function public.limpar_galeria(%L, %L)',
      r.tabela, r.entidade, r.pk);
  end loop;
end $$;
