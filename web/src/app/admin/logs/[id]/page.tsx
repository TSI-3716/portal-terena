import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoList } from "@/components/content-blocks";
import { dataHora, getLog, nivelLabel, tabelaLabel, tipoLabel } from "@/lib/logs";

export const metadata: Metadata = { title: "Detalhe do log" };

const IGNORAR = new Set(["atualizado_em", "atualizado_por"]);

function valor(v: unknown) {
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">vazio</span>;
  if (typeof v === "object") return <code className="text-xs break-all">{JSON.stringify(v)}</code>;
  return <span className="break-words whitespace-pre-wrap">{String(v)}</span>;
}

export default async function LogDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const log = await getLog(Number(id));
  if (!log) notFound();

  const campos =
    log.tipo === "update"
      ? (log.campos_alterados ?? []).filter((c) => !IGNORAR.has(c))
      : Object.keys(log.dados_depois ?? log.dados_antes ?? {});

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title={`Evento #${log.id}`} description={dataHora.format(new Date(log.criado_em))} />
        <div className="flex flex-wrap gap-2">
          {log.tabela && log.registro_id ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/logs?tabela=${log.tabela}&registro=${encodeURIComponent(log.registro_id)}`}>
                Histórico deste registro
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link href="/admin/logs">Voltar aos logs</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              {tipoLabel(log.tipo)}
              <Badge variant={log.nivel === "erro" ? "destructive" : "secondary"}>{nivelLabel(log.nivel)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList
              items={[
                { label: "Usuário", value: log.usuario_email ?? "Sem login (visitante ou sistema)" },
                { label: "Origem", value: log.origem === "banco" ? "Banco de dados (trigger)" : log.origem === "auth" ? "Autenticação" : "Aplicação" },
                ...(log.tabela ? [{ label: "Cadastro", value: `${tabelaLabel(log.tabela)}${log.registro_id ? ` #${log.registro_id}` : ""}` }] : []),
                ...(log.rota ? [{ label: "Página", value: log.rota }] : []),
                ...(log.mensagem ? [{ label: "Mensagem", value: log.mensagem }] : []),
              ]}
            />
          </CardContent>
        </Card>

        {log.origem === "banco" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                {log.tipo === "update" ? "Campos alterados" : log.tipo === "insert" ? "Dados incluídos" : "Dados excluídos"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="py-1.5 pr-3 font-medium">Campo</th>
                      {log.tipo !== "insert" ? <th className="py-1.5 pr-3 font-medium">Antes</th> : null}
                      {log.tipo !== "delete" ? <th className="py-1.5 font-medium">Depois</th> : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y align-top">
                    {campos.map((campo) => (
                      <tr key={campo}>
                        <td className="py-1.5 pr-3 font-mono text-xs text-primary">{campo}</td>
                        {log.tipo !== "insert" ? (
                          <td className="py-1.5 pr-3 text-destructive/90">{valor(log.dados_antes?.[campo])}</td>
                        ) : null}
                        {log.tipo !== "delete" ? <td className="py-1.5">{valor(log.dados_depois?.[campo])}</td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Detalhes técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              {log.detalhes ? (
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
                  {JSON.stringify(log.detalhes, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">Sem detalhes adicionais.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
