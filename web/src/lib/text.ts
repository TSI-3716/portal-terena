

export const LIMITE_DESCRICAO_CARD = 140;

export function resumirTexto(texto: string, limite = LIMITE_DESCRICAO_CARD): string {
  const limpo = texto.trim();
  if (limpo.length <= limite) return limpo;
  return `${limpo.slice(0, limite).trimEnd()}...`;
}