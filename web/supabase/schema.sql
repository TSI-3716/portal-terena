-- Esquema de referência do Portal Terena: estrutura atual do banco Supabase
-- (exportada pela equipe em 06/11/2026). Serve de documentação; não execute.
-- noticia.id_usuario é o usuário do Auth (auth.users.id).
-- projeto e artesanato não têm coluna id_aldeia; projeto se liga a aldeia por projeto_aldeia.

CREATE TABLE public.evento (
  id_evento integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo character varying NOT NULL,
  descricao text,
  data_evento date,
  local character varying,
  imagem character varying,
  status character varying,
  CONSTRAINT evento_pkey PRIMARY KEY (id_evento)
);
CREATE TABLE public.aldeia (
  id_aldeia integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  descricao text,
  localizacao character varying,
  imagem character varying,
  data_fundacao date,
  CONSTRAINT aldeia_pkey PRIMARY KEY (id_aldeia)
);
CREATE TABLE public.tipo_conteudo (
  id_tipo integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL UNIQUE,
  descricao text,
  CONSTRAINT tipo_conteudo_pkey PRIMARY KEY (id_tipo)
);
CREATE TABLE public.conteudo_aldeia (
  id_conteudo integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo character varying NOT NULL,
  descricao text,
  tipo character varying,
  imagem character varying,
  data_publicacao date,
  destaque boolean NOT NULL DEFAULT false,
  id_tipo integer NOT NULL,
  id_aldeia integer NOT NULL,
  CONSTRAINT conteudo_aldeia_pkey PRIMARY KEY (id_conteudo),
  CONSTRAINT fk_conteudo_aldeia FOREIGN KEY (id_aldeia) REFERENCES public.aldeia(id_aldeia),
  CONSTRAINT fk_conteudo_tipo FOREIGN KEY (id_tipo) REFERENCES public.tipo_conteudo(id_tipo)
);
CREATE TABLE public.artesanato (
  id_artesanato integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  descricao text,
  categoria character varying,
  imagem character varying,
  preco numeric,
  disponivel boolean NOT NULL DEFAULT true,
  CONSTRAINT artesanato_pkey PRIMARY KEY (id_artesanato)
);
CREATE TABLE public.noticia (
  id_noticia integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo character varying NOT NULL,
  resumo text,
  conteudo text,
  imagem character varying,
  data_publicacao timestamp without time zone,
  status character varying,
  id_evento integer,
  id_aldeia integer NOT NULL,
  id_usuario uuid NOT NULL,
  CONSTRAINT noticia_pkey PRIMARY KEY (id_noticia),
  CONSTRAINT fk_noticia_evento FOREIGN KEY (id_evento) REFERENCES public.evento(id_evento),
  CONSTRAINT fk_noticia_aldeia FOREIGN KEY (id_aldeia) REFERENCES public.aldeia(id_aldeia),
  CONSTRAINT fk_noticia_usuario FOREIGN KEY (id_usuario) REFERENCES auth.users(id)
);
CREATE TABLE public.contato_aldeia (
  id_contato integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  telefone character varying,
  email character varying,
  endereco character varying,
  horario_atendimento character varying,
  observacao text,
  id_aldeia integer NOT NULL,
  CONSTRAINT contato_aldeia_pkey PRIMARY KEY (id_contato),
  CONSTRAINT fk_contato_aldeia FOREIGN KEY (id_aldeia) REFERENCES public.aldeia(id_aldeia)
);
CREATE TABLE public.projeto (
  id_projeto integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  titulo character varying NOT NULL,
  descricao text,
  objetivo text,
  data_inicio date,
  data_fim date,
  status character varying,
  imagem character varying,
  CONSTRAINT projeto_pkey PRIMARY KEY (id_projeto)
);
CREATE TABLE public.projeto_aldeia (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_projeto integer NOT NULL,
  id_aldeia integer NOT NULL,
  papel character varying,
  observacao text,
  CONSTRAINT projeto_aldeia_pkey PRIMARY KEY (id),
  CONSTRAINT fk_projeto_aldeia_projeto FOREIGN KEY (id_projeto) REFERENCES public.projeto(id_projeto),
  CONSTRAINT fk_projeto_aldeia_aldeia FOREIGN KEY (id_aldeia) REFERENCES public.aldeia(id_aldeia)
);
CREATE TABLE public.mensagem_contato (
  id_mensagem uuid NOT NULL DEFAULT gen_random_uuid(),
  origem text NOT NULL DEFAULT 'portal'::text CHECK (origem = ANY (ARRAY['portal'::text, 'inamaty-kaxe'::text])),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  assunto text NOT NULL,
  mensagem text NOT NULL,
  autorizacao boolean NOT NULL DEFAULT false,
  lida boolean NOT NULL DEFAULT false,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT mensagem_contato_pkey PRIMARY KEY (id_mensagem)
);