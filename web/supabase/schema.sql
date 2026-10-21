-- Esquema de referência do Portal Terena (fornecido pela equipe, sem duplicatas).
-- As tabelas já existem no projeto Supabase; este arquivo serve de documentação.
-- A tabela public.usuario é referenciada por noticia.id_usuario e não está aqui.

create table public.aldeia (
  id_aldeia integer generated always as identity not null,
  nome character varying(150) not null,
  descricao text null,
  localizacao character varying(255) null,
  imagem character varying(500) null,
  data_fundacao date null,
  constraint pk_aldeia primary key (id_aldeia)
);

create table public.artesanato (
  id_artesanato integer generated always as identity not null,
  nome character varying(200) not null,
  descricao text null,
  categoria character varying(100) null,
  imagem character varying(500) null,
  preco numeric(12, 2) null,
  disponivel boolean not null default true,
  constraint pk_artesanato primary key (id_artesanato)
);

create table public.contato_aldeia (
  id_contato integer generated always as identity not null,
  telefone character varying(30) null,
  email character varying(150) null,
  endereco character varying(255) null,
  horario_atendimento character varying(150) null,
  observacao text null,
  id_aldeia integer not null,
  constraint pk_contato_aldeia primary key (id_contato),
  constraint fk_contato_aldeia foreign key (id_aldeia) references aldeia (id_aldeia)
    on update cascade on delete cascade
);
create index if not exists idx_contato_aldeia on public.contato_aldeia (id_aldeia);

create table public.evento (
  id_evento integer generated always as identity not null,
  titulo character varying(200) not null,
  descricao text null,
  data_evento date null,
  local character varying(200) null,
  imagem character varying(500) null,
  status character varying(30) null,
  constraint pk_evento primary key (id_evento)
);

create table public.mensagem_contato (
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

create table public.noticia (
  id_noticia integer generated always as identity not null,
  titulo character varying(250) not null,
  resumo text null,
  conteudo text null,
  imagem character varying(500) null,
  data_publicacao timestamp without time zone null,
  status character varying(30) null,
  id_usuario integer not null,
  id_evento integer not null,
  id_aldeia integer not null,
  constraint pk_noticia primary key (id_noticia),
  constraint fk_noticia_aldeia foreign key (id_aldeia) references aldeia (id_aldeia)
    on update cascade on delete restrict,
  constraint fk_noticia_evento foreign key (id_evento) references evento (id_evento)
    on update cascade on delete restrict,
  constraint fk_noticia_usuario foreign key (id_usuario) references usuario (id_usuario)
    on update cascade on delete restrict
);
create index if not exists idx_noticia_usuario on public.noticia (id_usuario);
create index if not exists idx_noticia_evento on public.noticia (id_evento);
create index if not exists idx_noticia_aldeia on public.noticia (id_aldeia);
create index if not exists noticia_publicadas_idx on public.noticia (data_publicacao desc)
  where ((status)::text = 'publicado'::text);

create table public.projeto (
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

create table public.tipo_conteudo (
  id_tipo integer generated always as identity not null,
  nome character varying(100) not null,
  descricao text null,
  constraint pk_tipo_conteudo primary key (id_tipo),
  constraint uq_tipo_conteudo_nome unique (nome)
);
