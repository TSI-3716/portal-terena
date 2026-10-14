-- Conteúdo inicial vindo do protótipo HTML. Só insere o que ainda não existe
-- (compara pelo nome/título), então pode ser executada mais de uma vez.
-- Imagens começando com "/" apontam para web/public/images.

-- Aldeias --------------------------------------------------------------------
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

-- Contato da Inamaty Kaxé ----------------------------------------------------
insert into public.contato_aldeia (telefone, email, endereco, horario_atendimento, observacao, id_aldeia)
select null, 'inamatykaxe@portalterena.org.br', 'Terra Indígena Terena - Sidrolândia - MS', null,
       'Cacique, vice-cacique e lideranças: representação da comunidade, informações e encaminhamentos. Telefone a confirmar pela comunidade.',
       a.id_aldeia
from public.aldeia a
where a.nome = 'Inamaty Kaxé'
  and not exists (select 1 from public.contato_aldeia c where c.id_aldeia = a.id_aldeia);

-- Eventos --------------------------------------------------------------------
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

-- Projetos -------------------------------------------------------------------
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

-- Artesanato -----------------------------------------------------------------
insert into public.artesanato (nome, descricao, categoria, imagem, disponivel)
select v.nome, v.descricao, v.categoria, v.imagem, true
from (values
  ('Cesto Terena', 'Cestaria artesanal produzida com técnicas tradicionais.', 'Cestaria', '/images/feira_p1.jpg'),
  ('Colar de Miçangas', 'Adorno inspirado em referências culturais Terena.', 'Bijuterias', '/images/feira_p2.jpg'),
  ('Vaso Cerâmico', 'Peça de cerâmica produzida artesanalmente.', 'Cerâmica', '/images/feira_p3.jpg'),
  ('Balaio Decorativo', 'Peça de tecelagem que valoriza identidade e tradição.', 'Arte Terena', '/images/feira_p4.jpg')
) as v(nome, descricao, categoria, imagem)
where not exists (select 1 from public.artesanato a where a.nome = v.nome);

-- Tipos de conteúdo ----------------------------------------------------------
insert into public.tipo_conteudo (nome, descricao)
values
  ('Notícia', 'Publicações sobre acontecimentos das aldeias.'),
  ('Evento', 'Encontros, feiras, oficinas e celebrações.'),
  ('Projeto', 'Iniciativas comunitárias.'),
  ('Artesanato', 'Peças produzidas pelas artesãs e artesãos.')
on conflict (nome) do nothing;
