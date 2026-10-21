-- Conteúdo do portal que ainda não existia no app em web/:
-- aldeias, contatos, eventos, projetos, tipos e mensagens de contato.
-- Não altera notícia nem artesanato: esses cadastros já usam id uuid.

create table if not exists public.aldeia (
  id_aldeia integer generated always as identity not null,
  nome character varying(150) not null,
  descricao text null,
  localizacao character varying(255) null,
  imagem character varying(500) null,
  data_fundacao date null,
  constraint pk_aldeia primary key (id_aldeia)
);

create table if not exists public.contato_aldeia (
  id_contato integer generated always as identity not null,
  telefone character varying(30) null,
  email character varying(150) null,
  endereco character varying(255) null,
  horario_atendimento character varying(150) null,
  observacao text null,
  id_aldeia integer not null,
  constraint pk_contato_aldeia primary key (id_contato),
  constraint fk_contato_aldeia foreign key (id_aldeia) references public.aldeia (id_aldeia)
    on update cascade on delete cascade
);
create index if not exists idx_contato_aldeia on public.contato_aldeia (id_aldeia);

create table if not exists public.evento (
  id_evento integer generated always as identity not null,
  titulo character varying(200) not null,
  descricao text null,
  data_evento date null,
  local character varying(200) null,
  imagem character varying(500) null,
  status character varying(30) null,
  constraint pk_evento primary key (id_evento)
);

create table if not exists public.projeto (
  id_projeto integer generated always as identity not null,
  titulo character varying(200) not null,
  descricao text null,
  objetivo text null,
  data_inicio date null,
  data_fim date null,
  status character varying(50) null,
  imagem character varying(500) null,
  constraint pk_projeto primary key (id_projeto)
);

create table if not exists public.tipo_conteudo (
  id_tipo integer generated always as identity not null,
  nome character varying(100) not null,
  descricao text null,
  constraint pk_tipo_conteudo primary key (id_tipo),
  constraint uq_tipo_conteudo_nome unique (nome)
);

create table if not exists public.mensagem_contato (
  id_mensagem uuid not null default gen_random_uuid(),
  origem text not null default 'portal',
  nome text not null,
  email text not null,
  telefone text null,
  assunto text not null,
  mensagem text not null,
  autorizacao boolean not null default false,
  lida boolean not null default false,
  criado_em timestamp with time zone not null default now(),
  constraint mensagem_contato_pkey primary key (id_mensagem),
  constraint mensagem_contato_origem_check check (origem in ('portal', 'inamaty-kaxe')),
  constraint mensagem_contato_tamanhos_check check (
    char_length(nome) between 3 and 120
    and char_length(email) between 3 and 254
    and char_length(coalesce(telefone, '')) <= 30
    and char_length(assunto) between 1 and 150
    and char_length(mensagem) between 10 and 5000
  )
);
create index if not exists mensagem_contato_criado_idx on public.mensagem_contato (criado_em desc);

-- Leitura pública; escrita só para quem está logado.
do $$
declare
  t text;
begin
  foreach t in array array['aldeia', 'contato_aldeia', 'evento', 'projeto', 'tipo_conteudo']
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

-- Conteúdo inicial do protótipo. Pode rodar de novo: só insere o que falta.
insert into public.aldeia (nome, descricao, localizacao, imagem)
select v.nome, v.descricao, v.localizacao, v.imagem
from (values
  ('Inamaty Kaxé',
   'A história da Inamaty Kaxé é contada a partir da relação entre território, comunidade e cultura. O cotidiano reúne famílias, práticas comunitárias, educação e a transmissão de conhecimentos entre gerações.',
   'Sidrolândia - MS', '/images/inamaty_hero.jpg'),
  ('Aldeia Bananal',
   'Tradição cultural, atividades comunitárias e valorização das tradições ancestrais.',
   'Sidrolândia - MS', '/images/aldeias_1.jpg'),
  ('Aldeia Buriti',
   'Conhecida pela produção de artesanato e preservação da língua e costumes Terena.',
   'Aquidauana - MS', '/images/aldeias_2.jpg'),
  ('Aldeia Lagoinha',
   'Aldeia com forte ligação com a natureza e celebrações culturais.',
   'Nioaque - MS', '/images/aldeias_3.jpg')
) as v(nome, descricao, localizacao, imagem)
where not exists (select 1 from public.aldeia a where a.nome = v.nome);

insert into public.contato_aldeia (telefone, email, endereco, horario_atendimento, observacao, id_aldeia)
select null, 'inamatykaxe@portalterena.org.br', 'Terra Indígena Terena - Sidrolândia - MS', null,
       'Cacique, vice-cacique e lideranças: representação da comunidade, informações e encaminhamentos. Telefone a confirmar pela comunidade.',
       a.id_aldeia
from public.aldeia a
where a.nome = 'Inamaty Kaxé'
  and not exists (select 1 from public.contato_aldeia c where c.id_aldeia = a.id_aldeia);

insert into public.evento (titulo, descricao, data_evento, local, imagem, status)
select v.titulo, v.descricao, v.data_evento::date, v.local, v.imagem, v.status
from (values
  ('Feira Cultural Terena 2024', 'Artesanato, apresentações culturais, culinária tradicional e muito mais.',
   '2024-05-24', 'Aldeias Terena', '/images/feira_1.jpg', 'realizado'),
  ('Feira das Mulheres Artesãs', 'Valorizando o trabalho das mulheres Terena e sua força criativa.',
   '2024-05-10', 'Aldeias Terena', '/images/feira_2.jpg', 'realizado'),
  ('Encontro de Artesãos Terena', 'Troca de saberes, técnicas e fortalecimento da cultura Terena.',
   '2024-06-07', 'Aldeias Terena', '/images/feira_3.jpg', 'realizado'),
  ('Oficina de Artesanato Terena', 'Trançados e grafismos tradicionais.',
   '2024-05-25', 'Casa de Cultura · 14h00', null, 'realizado'),
  ('Oficina de Artesanato', 'Encontro para troca de saberes e fortalecimento da cultura.',
   '2024-06-08', 'Inamaty Kaxé', null, 'realizado'),
  ('Torneio de Esportes Tradicionais', 'Convivência, participação e valorização das práticas comunitárias.',
   '2024-06-22', 'Inamaty Kaxé', null, 'realizado')
) as v(titulo, descricao, data_evento, local, imagem, status)
where not exists (select 1 from public.evento e where e.titulo = v.titulo);

insert into public.projeto (titulo, descricao, objetivo, status, imagem)
select v.titulo, v.descricao, v.objetivo, v.status, v.imagem
from (values
  ('Proteção das Nascentes', 'Recuperação de nascentes e preservação dos recursos hídricos.',
   'Preservar os recursos hídricos do território.', 'em_andamento', '/images/projetos_1.jpg'),
  ('Formação de Jovens Líderes', 'Formação para liderança comunitária, cidadania e valorização cultural.',
   'Preparar jovens para a liderança comunitária.', 'em_andamento', '/images/projetos_2.jpg'),
  ('Artesanato Terena', 'Capacitação de artesãos e fortalecimento da produção.',
   'Gerar renda valorizando a produção artesanal.', 'concluido', '/images/projetos_3.jpg'),
  ('Fortalecimento Cultural', 'Atividades voltadas à valorização da identidade, memória e cultura Terena.',
   'Valorizar a identidade e a memória Terena.', 'em_andamento', null),
  ('Bem Viver e Comunidade', 'Iniciativas relacionadas à alimentação, convivência e qualidade de vida.',
   'Promover alimentação saudável e convivência.', 'planejado', null),
  ('Território e Meio Ambiente', 'Cuidados com os recursos naturais e valorização do território.',
   'Cuidar dos recursos naturais do território.', 'planejado', null)
) as v(titulo, descricao, objetivo, status, imagem)
where not exists (select 1 from public.projeto p where p.titulo = v.titulo);

insert into public.tipo_conteudo (nome, descricao)
values
  ('Notícia', 'Publicações sobre acontecimentos das aldeias.'),
  ('Evento', 'Encontros, feiras, oficinas e celebrações.'),
  ('Projeto', 'Iniciativas comunitárias.'),
  ('Artesanato', 'Peças produzidas pelas artesãs e artesãos.')
on conflict (nome) do nothing;
