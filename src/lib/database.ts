/**
 * Tipos das tabelas do Supabase (ver supabase/schema.sql).
 * Colunas "numeric" chegam como number; "date"/"timestamp" chegam como string.
 */

export type Aldeia = {
  id_aldeia: number;
  nome: string;
  descricao: string | null;
  localizacao: string | null;
  imagem: string | null;
  data_fundacao: string | null;
};

export type ContatoAldeia = {
  id_contato: number;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  horario_atendimento: string | null;
  observacao: string | null;
  id_aldeia: number;
};

export type Artesanato = {
  id_artesanato: number;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  imagem: string | null;
  preco: number | null;
  disponivel: boolean;
};

export type Evento = {
  id_evento: number;
  titulo: string;
  descricao: string | null;
  data_evento: string | null;
  local: string | null;
  imagem: string | null;
  status: string | null;
};

export type Projeto = {
  id_projeto: number;
  titulo: string;
  descricao: string | null;
  objetivo: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  status: string | null;
  imagem: string | null;
};

export type Noticia = {
  id_noticia: number;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  imagem: string | null;
  data_publicacao: string | null;
  status: string | null;
  id_usuario: number;
  id_evento: number;
  id_aldeia: number;
};

export type TipoConteudo = {
  id_tipo: number;
  nome: string;
  descricao: string | null;
};

/** Vocabulário das colunas "status" (varchar livre no banco). */
export const noticiaStatus = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
] as const;

export const eventoStatus = [
  { value: "agendado", label: "Agendado" },
  { value: "realizado", label: "Realizado" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export const projetoStatus = [
  { value: "planejado", label: "Planejado" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluído" },
] as const;

export function statusLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
) {
  if (!value) return undefined;
  return options.find((option) => option.value === value)?.label ?? value;
}
