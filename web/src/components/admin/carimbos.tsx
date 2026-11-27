import { formatDateTime } from "@/lib/format";

/** Datas automáticas do registro (cadastro e última alteração), só para leitura. */
export function Carimbos({
  criadoEm,
  atualizadoEm,
}: {
  criadoEm?: unknown;
  atualizadoEm?: unknown;
}) {
  const criado = typeof criadoEm === "string" ? formatDateTime(criadoEm) : "";
  const atualizado = typeof atualizadoEm === "string" ? formatDateTime(atualizadoEm) : "";
  if (!criado && !atualizado) return null;

  return (
    <p className="mb-6 text-xs text-muted-foreground">
      {criado ? <>Cadastrado em {criado}</> : null}
      {criado && atualizado ? " · " : null}
      {atualizado ? <>Última alteração em {atualizado}</> : null}
    </p>
  );
}
