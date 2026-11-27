export const LIMITE_DESCRICAO_CARD = 140;
/** Tamanho padrão do resumo exibido nos cards e nos resultados de busca. */
export const RESUMO_MAX = 160;

export function resumirTexto(texto: string, limite = LIMITE_DESCRICAO_CARD): string {
  const limpo = texto.trim();
  if (limpo.length <= limite) return limpo;
  return `${limpo.slice(0, limite).trimEnd()}...`;
}

/**
 * Resumo para exibição: junta espaços e corta no fim da última palavra que
 * cabe, com reticências. Não altera o texto salvo no banco.
 */
export function resumir(texto: string | null | undefined, max = RESUMO_MAX) {
  const limpo = (texto ?? "").replace(/\s+/g, " ").trim();
  if (limpo.length <= max) return limpo;

  const corte = limpo.slice(0, max + 1);
  const ultimoEspaco = corte.lastIndexOf(" ");
  const base = ultimoEspaco > max * 0.6 ? corte.slice(0, ultimoEspaco) : limpo.slice(0, max);
  return `${base.replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** Remove caracteres que quebram o filtro `or` do PostgREST. */
export function termoBusca(value: string | null | undefined) {
  return (value ?? "").trim().replace(/[%_,.()*\\]/g, " ").replace(/\s+/g, " ").trim();
}

/** Fonte informada como URL vira link; texto livre é mostrado como está. */
export function fonteHref(fonte: string | null | undefined) {
  const value = fonte?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Data de hoje (America/Campo_Grande) no formato YYYY-MM-DD. */
export function hojeISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Campo_Grande",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Escolhe `quantidade` itens em destaque, girando a cada dia: todo mundo vê
 * os mesmos destaques no mesmo dia e a seleção muda no dia seguinte.
 */
export function destaquesRotativos<T>(itens: readonly T[], quantidade: number, now = new Date()) {
  if (itens.length <= quantidade) return [...itens];
  const dia = Math.floor(Date.parse(`${hojeISO(now)}T00:00:00Z`) / 86_400_000);
  const inicio = (dia * quantidade) % itens.length;
  return Array.from({ length: quantidade }, (_, i) => itens[(inicio + i) % itens.length]);
}
