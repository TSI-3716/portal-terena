import { dbErrorCode, logDbError, StorageUploadError } from "@/lib/db-error";
import { registrarLog } from "@/lib/logger";

/**
 * Registra uma falha de banco/Storage no console do servidor e em log_sistema.
 * Só para código de servidor (actions, páginas); não importe em componente cliente.
 */
export async function registrarErroDb(
  contexto: string,
  error: unknown,
  alvo?: { tabela?: string; registroId?: string | number | null },
) {
  logDbError(contexto, error);

  const original = error instanceof StorageUploadError ? error.original : error;
  const e = (typeof original === "object" && original !== null ? original : {}) as Record<string, unknown>;

  await registrarLog({
    tipo: "erro",
    nivel: "erro",
    mensagem: `Falha ao ${contexto}`,
    tabela: alvo?.tabela,
    registroId: alvo?.registroId,
    detalhes: {
      origem: error instanceof StorageUploadError ? "storage" : "banco",
      codigo: dbErrorCode(original) ?? e.statusCode ?? null,
      erro: typeof e.message === "string" ? e.message : original instanceof Error ? original.message : String(original),
      detalhe: e.details ?? null,
      dica: e.hint ?? null,
    },
  });
}
