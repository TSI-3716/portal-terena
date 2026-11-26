import type { Projeto } from "@/lib/database";
import { hojeISO } from "@/lib/text";

export type SituacaoProjeto = "planejado" | "em_andamento" | "concluido";

/**
 * Situação exibida no portal (item 18 do relatório):
 * - "planejado" continua vindo do campo situação;
 * - concluído só com data de término já alcançada;
 * - sem data de término (ou com término no futuro) é "em andamento",
 *   mesmo que o campo situação diga "concluído".
 */
export function situacaoProjeto(
  projeto: Pick<Projeto, "status" | "data_fim">,
  hoje = hojeISO(),
): SituacaoProjeto {
  if (projeto.status === "planejado") return "planejado";
  const fim = projeto.data_fim?.slice(0, 10);
  if (fim && fim <= hoje) return "concluido";
  return "em_andamento";
}

export function contarSituacoes(projetos: Pick<Projeto, "status" | "data_fim">[], hoje = hojeISO()) {
  const total: Record<SituacaoProjeto, number> = { planejado: 0, em_andamento: 0, concluido: 0 };
  for (const projeto of projetos) total[situacaoProjeto(projeto, hoje)] += 1;
  return total;
}

/** Regras do cadastro: concluído exige término; término não vem antes do início. */
export function validarProjeto(data: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const inicio = typeof data.data_inicio === "string" ? data.data_inicio : null;
  const fim = typeof data.data_fim === "string" ? data.data_fim : null;

  if (data.status === "concluido" && !fim) {
    errors.data_fim = "Informe a data de término para marcar como concluído";
  }
  if (inicio && fim && fim < inicio) {
    errors.data_fim = "O término não pode ser antes do início";
  }
  return errors;
}
