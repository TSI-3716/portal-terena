/**
 * Menu do painel. Lista estática (sem imports) porque também é usada pelo
 * menu lateral, que roda no navegador. Os slugs batem com lib/admin/resources.ts.
 */
export const adminSections = [
  {
    href: "/admin/noticias",
    title: "Notícias",
    description: "Publicar, editar e remover as notícias do portal.",
  },
  {
    href: "/admin/mensagens",
    title: "Mensagens",
    description: "Ler e organizar as mensagens enviadas pelos formulários de contato.",
  },
  {
    href: "/admin/aldeias",
    title: "Aldeias",
    description: "Nome, localização, descrição e foto de cada aldeia.",
  },
  {
    href: "/admin/contatos-aldeia",
    title: "Contatos das aldeias",
    description: "Telefone, e-mail, endereço e horário de atendimento.",
  },
  {
    href: "/admin/eventos",
    title: "Eventos",
    description: "Feiras, oficinas e celebrações exibidos no portal.",
  },
  {
    href: "/admin/projetos",
    title: "Projetos",
    description: "Iniciativas da comunidade e sua situação.",
  },
  {
    href: "/admin/artesanato",
    title: "Artesanato",
    description: "Peças da Feira & Artesanato, com categoria e preço.",
  },
  {
    href: "/admin/tipos-conteudo",
    title: "Tipos de conteúdo",
    description: "Classificação geral dos conteúdos do portal.",
  },
] as const;
