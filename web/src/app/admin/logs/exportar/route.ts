import { dataHora, listLogs, parseFiltros, resumoLog, tipoLabel } from "@/lib/logs";

/** Limite de linhas por exportação, para não sobrecarregar o servidor. */
const MAX_LINHAS = 5000;

function celula(v: unknown) {
  const texto = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  // Ponto e vírgula é o separador do Excel em pt-BR; aspas e quebras são escapadas.
  return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export async function GET(request: Request) {
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const filtros = { ...parseFiltros(sp), pagina: 1 };
  const { rows, total } = await listLogs(filtros, MAX_LINHAS);

  const cabecalho = ["id", "data_hora", "tipo", "nivel", "origem", "usuario", "tabela", "registro", "descricao", "campos_alterados", "rota", "detalhes"];
  const linhas = rows.map((log) =>
    [
      log.id,
      dataHora.format(new Date(log.criado_em)),
      tipoLabel(log.tipo),
      log.nivel,
      log.origem,
      log.usuario_email ?? "sem login",
      log.tabela,
      log.registro_id,
      resumoLog(log),
      log.campos_alterados?.join(", "),
      log.rota,
      log.detalhes,
    ]
      .map(celula)
      .join(";"),
  );

  const hoje = new Date().toISOString().slice(0, 10);
  // BOM para o Excel reconhecer UTF-8 (acentos).
  const csv = "\uFEFF" + [cabecalho.join(";"), ...linhas].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="logs-portal-terena-${hoje}.csv"`,
      "X-Total-Registros": String(total),
      "X-Registros-Exportados": String(rows.length),
      "Cache-Control": "no-store",
    },
  });
}
