"use server";

import { registrarLog } from "@/lib/logger";

/** Chamado pela página de erro (app/error.tsx) para registrar a falha no log. */
export async function registrarErroPagina(erro: {
  mensagem?: string;
  digest?: string;
  rota?: string;
}) {
  await registrarLog({
    tipo: "erro",
    nivel: "erro",
    mensagem: "Erro ao carregar página",
    rota: erro.rota?.slice(0, 300),
    detalhes: {
      origem: "pagina",
      erro: erro.mensagem?.slice(0, 1000) ?? null,
      // O digest liga este registro ao erro completo no log do servidor.
      digest: erro.digest ?? null,
    },
  });
}
