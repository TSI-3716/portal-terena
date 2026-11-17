-- Configurações do portal (contatos do rodapé) e auditoria do sistema.
--
-- 1. public.configuracao: linha única (id = 1) com os dados de contato e redes
--    sociais exibidos no rodapé e na página de contato. Leitura pública,
--    alteração só para usuários logados.
-- 2. public.log_sistema: registro imutável de eventos.
--    - origem "banco": INSERT/UPDATE/DELETE capturados por trigger em todas as
--      tabelas de conteúdo, com os dados antes/depois e os campos alterados;
--    - origem "app"/"auth": erros, login, falha de login e logout, gravados pelo
--      app através da função registrar_log().
--    Ninguém altera nem apaga logs pela API (sem políticas de UPDATE/DELETE).
-- Pode ser executada mais de uma vez.

-- 1. Configuração -------------------------------------------------------------
create table if not exists public.configuracao (
  id smallint primary key default 1,
  email_contato character varying(254),
  telefone character varying(30),
  whatsapp character varying(30),
  endereco character varying(255),
  cidade_uf character varying(120),
  horario_atendimento character varying(150),
  prazo_resposta character varying(150),
  instagram_url character varying(500),
  facebook_url character varying(500),
  youtube_url character varying(500),
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users (id) on delete set null,
  constraint configuracao_linha_unica check (id = 1)
);

-- Valores atuais do rodapé. O telefone é o provisório apontado no item I01:
-- troque pelo número oficial em /admin/configuracoes.
insert into public.configuracao (id, email_contato, telefone, cidade_uf, horario_atendimento, prazo_resposta)
values (1, 'contato@portalterena.org.br', '(67) 99999-9999', 'Campo Grande - MS',
        'Segunda a sexta, das 8h às 17h', 'Respondemos em até 48h úteis.')
on conflict (id) do nothing;

create or replace function public.configuracao_carimbo()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.atualizado_em := now();
  new.atualizado_por := auth.uid();
  return new;
end $$;

drop trigger if exists configuracao_carimbo on public.configuracao;
create trigger configuracao_carimbo
  before update on public.configuracao
  for each row execute function public.configuracao_carimbo();

alter table public.configuracao enable row level security;

drop policy if exists publico_select_configuracao on public.configuracao;
create policy publico_select_configuracao
  on public.configuracao for select to anon, authenticated using (true);

drop policy if exists admin_update_configuracao on public.configuracao;
create policy admin_update_configuracao
  on public.configuracao for update to authenticated using (true) with check (id = 1);

-- O Supabase concede tudo por padrão em tabela nova (inclusive TRUNCATE, que
-- ignora RLS). Revoga e concede só o necessário.
revoke all on public.configuracao from anon, authenticated;
grant select on public.configuracao to anon;
grant select, update on public.configuracao to authenticated;

-- 2. Log do sistema -------------------------------------------------------------
create table if not exists public.log_sistema (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  tipo text not null,
  nivel text not null default 'info',
  origem text not null default 'app',
  tabela text,
  registro_id text,
  usuario_id uuid,
  usuario_email text,
  mensagem text,
  dados_antes jsonb,
  dados_depois jsonb,
  campos_alterados text[],
  detalhes jsonb,
  rota text,
  constraint log_sistema_tipo_check check (
    tipo in ('insert', 'update', 'delete', 'erro', 'login', 'login_falha', 'logout')
  ),
  constraint log_sistema_nivel_check check (nivel in ('info', 'aviso', 'erro')),
  constraint log_sistema_origem_check check (origem in ('banco', 'app', 'auth'))
);

create index if not exists log_sistema_criado_idx on public.log_sistema (criado_em desc);
create index if not exists log_sistema_tipo_idx on public.log_sistema (tipo, criado_em desc);
create index if not exists log_sistema_usuario_idx on public.log_sistema (usuario_email, criado_em desc);
create index if not exists log_sistema_tabela_idx on public.log_sistema (tabela, registro_id);

alter table public.log_sistema enable row level security;

drop policy if exists admin_select_log_sistema on public.log_sistema;
create policy admin_select_log_sistema
  on public.log_sistema for select to authenticated using (true);

-- Sem políticas de INSERT/UPDATE/DELETE: a gravação só acontece pelo trigger e
-- pela função registrar_log(), que rodam como dono da tabela.
revoke all on public.log_sistema from anon, authenticated;
grant select on public.log_sistema to authenticated;

-- Trigger de auditoria do CRUD ---------------------------------------------------
-- Argumentos: 1) coluna da chave primária; 2) colunas a ocultar (dados pessoais),
-- separadas por vírgula.
create or replace function public.auditar_alteracao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pk text := tg_argv[0];
  v_ocultar text[] := case when tg_nargs > 1 then string_to_array(tg_argv[1], ',') else '{}' end;
  v_antes jsonb;
  v_depois jsonb;
  v_campos text[];
  v_coluna text;
begin
  if tg_op in ('UPDATE', 'DELETE') then v_antes := to_jsonb(old); end if;
  if tg_op in ('INSERT', 'UPDATE') then v_depois := to_jsonb(new); end if;

  if tg_op = 'UPDATE' then
    select array_agg(chave order by chave) into v_campos
    from jsonb_object_keys(v_depois) as chave
    where v_antes -> chave is distinct from v_depois -> chave;

    -- UPDATE que não mudou nada não gera log.
    if v_campos is null then return new; end if;
  end if;

  foreach v_coluna in array v_ocultar loop
    if v_antes ? v_coluna then v_antes := jsonb_set(v_antes, array[v_coluna], '"[oculto]"'); end if;
    if v_depois ? v_coluna then v_depois := jsonb_set(v_depois, array[v_coluna], '"[oculto]"'); end if;
  end loop;

  insert into public.log_sistema (
    tipo, nivel, origem, tabela, registro_id, usuario_id, usuario_email,
    dados_antes, dados_depois, campos_alterados
  ) values (
    lower(tg_op), 'info', 'banco', tg_table_name,
    coalesce(v_depois, v_antes) ->> v_pk,
    auth.uid(), auth.jwt() ->> 'email',
    v_antes, v_depois, v_campos
  );

  return coalesce(new, old);
end $$;

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('aldeia', 'id_aldeia', null),
      ('artesanato', 'id_artesanato', null),
      ('contato_aldeia', 'id_contato', null),
      ('conteudo_aldeia', 'id_conteudo', null),
      ('evento', 'id_evento', null),
      ('noticia', 'id_noticia', null),
      ('projeto', 'id_projeto', null),
      ('projeto_aldeia', 'id', null),
      ('tipo_conteudo', 'id_tipo', null),
      ('configuracao', 'id', null),
      -- Mensagens de contato: dados pessoais do visitante não vão para o log.
      ('mensagem_contato', 'id_mensagem', 'nome,email,telefone,mensagem')
    ) as t(tabela, pk, ocultar)
  loop
    if to_regclass('public.' || r.tabela) is null then
      raise notice 'Tabela public.% não existe, auditoria ignorada.', r.tabela;
      continue;
    end if;

    execute format('drop trigger if exists auditoria on public.%I', r.tabela);
    execute format(
      'create trigger auditoria after insert or update or delete on public.%I
         for each row execute function public.auditar_alteracao(%L%s)',
      r.tabela, r.pk, case when r.ocultar is null then '' else format(', %L', r.ocultar) end
    );
  end loop;
end $$;

-- Eventos do app (erros, login, logout) -------------------------------------------
create or replace function public.registrar_log(
  p_tipo text,
  p_nivel text default 'info',
  p_mensagem text default null,
  p_detalhes jsonb default null,
  p_tabela text default null,
  p_registro_id text default null,
  p_rota text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_detalhes jsonb := p_detalhes;
begin
  -- O app não grava eventos de banco: esses vêm só do trigger.
  if p_tipo not in ('erro', 'login', 'login_falha', 'logout') then
    raise exception 'Tipo de log inválido: %', p_tipo;
  end if;

  -- Visitante (sem login) só registra erro e tentativa de login.
  if auth.uid() is null and p_tipo not in ('erro', 'login_falha') then
    raise exception 'Tipo de log não permitido sem login: %', p_tipo;
  end if;

  if v_detalhes is not null and pg_column_size(v_detalhes) > 16384 then
    v_detalhes := jsonb_build_object('aviso', 'detalhes truncados por tamanho');
  end if;

  insert into public.log_sistema (
    tipo, nivel, origem, tabela, registro_id, usuario_id, usuario_email,
    mensagem, detalhes, rota
  ) values (
    p_tipo,
    case when p_nivel in ('info', 'aviso', 'erro') then p_nivel else 'info' end,
    case when p_tipo in ('login', 'login_falha', 'logout') then 'auth' else 'app' end,
    left(p_tabela, 100),
    left(p_registro_id, 100),
    auth.uid(),
    auth.jwt() ->> 'email',
    left(p_mensagem, 2000),
    v_detalhes,
    left(p_rota, 300)
  );
end $$;

revoke all on function public.registrar_log(text, text, text, jsonb, text, text, text) from public;
grant execute on function public.registrar_log(text, text, text, jsonb, text, text, text) to anon, authenticated;

-- Usuários que aparecem no log (para o filtro da tela de auditoria).
create or replace function public.listar_usuarios_log()
returns table (usuario_email text)
language sql
stable
set search_path = public
as $$
  select distinct l.usuario_email
  from public.log_sistema l
  where l.usuario_email is not null
  order by 1;
$$;

revoke all on function public.listar_usuarios_log() from public, anon;
grant execute on function public.listar_usuarios_log() to authenticated;

-- Retenção: apaga logs mais antigos que N dias. Só o service_role executa;
-- não é chamada pelo app. Ex.: select public.limpar_logs_antigos(365);
create or replace function public.limpar_logs_antigos(p_dias integer default 365)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
begin
  if p_dias < 30 then raise exception 'Mantenha pelo menos 30 dias de log.'; end if;
  delete from public.log_sistema where criado_em < now() - make_interval(days => p_dias);
  get diagnostics v_total = row_count;
  return v_total;
end $$;

revoke all on function public.limpar_logs_antigos(integer) from public, anon, authenticated;
