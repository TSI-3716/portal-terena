/**
 * Módulos de conteúdo baseados em tipo_conteudo (itens 14 a 17 do relatório).
 * O slug é o do tipo raiz no banco; as subcategorias vêm de tipo_conteudo.id_tipo_pai.
 * Sem imports de servidor: também é usado no formulário (cliente).
 */
export const secoes = {
  cultura: {
    slug: "cultura",
    titulo: "Cultura",
    rota: "/cultura",
    admin: "/admin/cultura",
    descricaoAdmin: "Memória Viva, História, Língua, Tradições e Saberes, Calendário Cultural.",
  },
  juventude: {
    slug: "juventude",
    titulo: "Juventude",
    rota: "/juventude",
    admin: "/admin/juventude",
    descricaoAdmin: "Publicações da juventude Terena, no formato das notícias.",
  },
} as const;

export type SecaoSlug = keyof typeof secoes;

export function isSecaoSlug(value: string): value is SecaoSlug {
  return value in secoes;
}

/**
 * Link público de um conteúdo. Na Cultura o caminho inclui a categoria
 * (/cultura/lingua-terena/12); na Juventude é direto (/juventude/12).
 */
export function conteudoHref(secao: SecaoSlug, id: number | string, categoria?: string | null) {
  if (secao === "cultura" && categoria && categoria !== "cultura") {
    return `/cultura/${categoria}/${id}`;
  }
  return `${secoes[secao].rota}/${id}`;
}
