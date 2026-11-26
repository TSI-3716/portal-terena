/** Menu principal (item 21 do relatório). Notícias fica no rodapé e na página inicial. */
export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/aldeias", label: "Aldeias" },
  { href: "/cultura", label: "Cultura" },
  { href: "/projetos", label: "Projetos" },
  { href: "/artesanato", label: "Artesanato" },
  { href: "/eventos", label: "Eventos" },
  { href: "/juventude", label: "Juventude" },
  { href: "/contato", label: "Contato" },
] as const;

/** Rodapé: o menu principal (menos Contato, que tem coluna própria) e Notícias. */
export const footerLinks = [
  ...navLinks.filter((link) => link.href !== "/contato"),
  { href: "/noticias", label: "Notícias" },
] as const;

export const inamatyLinks = [
  { href: "/aldeias/inamaty-kaxe", label: "Início da Aldeia" },
  { href: "/aldeias/inamaty-kaxe/sobre", label: "Sobre a Aldeia" },
  { href: "/aldeias/inamaty-kaxe/historia", label: "História" },
  { href: "/aldeias/inamaty-kaxe/anciaos", label: "Anciãos(ãs)" },
  { href: "/aldeias/inamaty-kaxe/cultura", label: "Cultura" },
  { href: "/aldeias/inamaty-kaxe/noticias", label: "Notícias" },
  { href: "/aldeias/inamaty-kaxe/projetos", label: "Projetos" },
  { href: "/aldeias/inamaty-kaxe/juventude", label: "Juventude" },
  { href: "/aldeias/inamaty-kaxe/artesanato", label: "Artesanato" },
  { href: "/aldeias/inamaty-kaxe/eventos", label: "Eventos" },
  { href: "/aldeias/inamaty-kaxe/localizacao", label: "Localização" },
  { href: "/aldeias/inamaty-kaxe/galeria", label: "Galeria" },
  { href: "/aldeias/inamaty-kaxe/contato", label: "Contato" },
] as const;

export const inamatyFooterLinks = [
  { href: "/aldeias/inamaty-kaxe", label: "Início" },
  { href: "/aldeias/inamaty-kaxe/historia", label: "História" },
  { href: "/aldeias/inamaty-kaxe/cultura", label: "Cultura" },
  { href: "/aldeias/inamaty-kaxe/juventude", label: "Juventude" },
  { href: "/aldeias/inamaty-kaxe/galeria", label: "Galeria" },
  { href: "/aldeias/inamaty-kaxe/contato", label: "Contato" },
] as const;

/** Categorias da Cultura (slugs criados pela migration 20261126120000). */
export const culturaLinks = [
  { href: "/cultura/memoria-viva", label: "Memória Viva / Anciãos" },
  { href: "/cultura/historia-terena", label: "História Terena" },
  { href: "/cultura/lingua-terena", label: "Língua Terena" },
  { href: "/cultura/tradicoes-e-saberes", label: "Tradições e Saberes" },
  { href: "/cultura/calendario-cultural", label: "Calendário Cultural" },
] as const;
