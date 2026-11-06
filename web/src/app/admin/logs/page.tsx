import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  dataHora,
  filtrosQuery,
  FUSO,
  listLogs,
  listUsuariosLog,
  NIVEIS_LOG,
  nivelLabel,
  parseFiltros,
  POR_PAGINA,
  resumoLog,
  SEM_USUARIO,
  TABELAS_LOG,
  TIPOS_LOG,
  tipoLabel,
} from "@/lib/logs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Logs e auditoria" };

const corNivel: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  info: "secondary",
  aviso: "outline",
  erro: "destructive",
};

/** "YYYY-MM-DD" de hoje menos N dias, no fuso do portal. */
function diasAtras(n: number) {
  const d = new Date(Date.now() - n * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(d);
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filtros = parseFiltros(await searchParams);
  const [{ rows, total }, usuarios] = await Promise.all([listLogs(filtros), listUsuariosLog()]);
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const hoje = diasAtras(0);
  const atalhos = [
    { label: "Hoje", de: hoje },
    { label: "7 dias", de: diasAtras(6) },
    { label: "30 dias", de: diasAtras(29) },
  ];
  const temFiltro = Object.entries(filtros).some(([k, v]) => k !== "pagina" && v);

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading
          title="Logs e auditoria"
          description="Inclusões, alterações e exclusões no banco, erros, logins e logouts."
        />
        <Button variant="outline" asChild>
          <a href={`/admin/logs/exportar${filtrosQuery({ ...filtros, pagina: 1 })}`}>
            <Download />
            Exportar CSV
          </a>
        </Button>
      </div>

      <form
        method="get"
        className="mb-4 grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Field>
          <FieldLabel htmlFor="de">De</FieldLabel>
          <Input id="de" name="de" type="date" defaultValue={filtros.de} max={hoje} />
        </Field>
        <Field>
          <FieldLabel htmlFor="ate">Até</FieldLabel>
          <Input id="ate" name="ate" type="date" defaultValue={filtros.ate} max={hoje} />
        </Field>
        <Field>
          <FieldLabel htmlFor="tipo">Tipo de evento</FieldLabel>
          <NativeSelect id="tipo" name="tipo" className="w-full" defaultValue={filtros.tipo ?? ""}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {TIPOS_LOG.map((t) => (
              <NativeSelectOption key={t.value} value={t.value}>
                {t.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="usuario">Usuário</FieldLabel>
          <NativeSelect id="usuario" name="usuario" className="w-full" defaultValue={filtros.usuario ?? ""}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {usuarios.map((email) => (
              <NativeSelectOption key={email} value={email}>
                {email}
              </NativeSelectOption>
            ))}
            <NativeSelectOption value={SEM_USUARIO}>Sem login (visitante/sistema)</NativeSelectOption>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="tabela">Cadastro</FieldLabel>
          <NativeSelect id="tabela" name="tabela" className="w-full" defaultValue={filtros.tabela ?? ""}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {TABELAS_LOG.map((t) => (
              <NativeSelectOption key={t.value} value={t.value}>
                {t.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="nivel">Nível</FieldLabel>
          <NativeSelect id="nivel" name="nivel" className="w-full" defaultValue={filtros.nivel ?? ""}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {NIVEIS_LOG.map((n) => (
              <NativeSelectOption key={n.value} value={n.value}>
                {n.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        {filtros.registro ? <input type="hidden" name="registro" value={filtros.registro} /> : null}
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-3">
          <Button type="submit">Filtrar</Button>
          {temFiltro ? (
            <Button variant="outline" asChild>
              <Link href="/admin/logs">Limpar filtros</Link>
            </Button>
          ) : null}
          <span className="ml-auto flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            Período:
            {atalhos.map((a) => (
              <Button key={a.label} variant="ghost" size="sm" asChild>
                <Link href={`/admin/logs${filtrosQuery({ ...filtros, de: a.de, ate: hoje, pagina: 1 })}`}>
                  {a.label}
                </Link>
              </Button>
            ))}
          </span>
        </div>
      </form>

      <p className="mb-3 text-sm text-muted-foreground">
        {total === 0
          ? temFiltro
            ? "Nenhum evento encontrado com esses filtros."
            : "Nenhum evento registrado ainda."
          : `${total.toLocaleString("pt-BR")} ${total === 1 ? "evento" : "eventos"}${
              filtros.registro ? ` do registro #${filtros.registro}` : ""
            } · página ${filtros.pagina} de ${paginas}`}
      </p>

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Data e hora</th>
                <th className="px-3 py-2 font-medium">Evento</th>
                <th className="px-3 py-2 font-medium">Usuário</th>
                <th className="px-3 py-2 font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((log) => (
                <tr key={log.id} className={cn("align-top hover:bg-muted/30", log.nivel === "erro" && "bg-destructive/5")}>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                    <Link href={`/admin/logs/${log.id}`} className="text-primary underline-offset-4 hover:underline">
                      {dataHora.format(new Date(log.criado_em))}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={corNivel[log.nivel] ?? "secondary"} title={nivelLabel(log.nivel)}>
                        {tipoLabel(log.tipo)}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-2 break-all">
                    {log.usuario_email ?? <span className="text-muted-foreground">sem login</span>}
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/admin/logs/${log.id}`} className="hover:underline">
                      {resumoLog(log) || "—"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {paginas > 1 ? (
        <nav className="mt-4 flex items-center justify-between gap-2" aria-label="Paginação">
          {filtros.pagina > 1 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/logs${filtrosQuery(filtros, { pagina: filtros.pagina - 1 })}`}>Anterior</Link>
            </Button>
          ) : (
            <span />
          )}
          {filtros.pagina < paginas ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/logs${filtrosQuery(filtros, { pagina: filtros.pagina + 1 })}`}>Próxima</Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
