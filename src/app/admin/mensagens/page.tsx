import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { excluirMensagem, marcarMensagemLida } from "@/app/admin/mensagens/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  assuntoLabel,
  contatoOrigemLabel,
  listMensagensAdmin,
} from "@/lib/contato";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mensagens" };

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Campo_Grande",
});

export default async function AdminMensagensPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { filtro: rawFiltro } = await searchParams;
  const filtro = rawFiltro === "nao-lidas" ? "nao-lidas" : "todas";
  const mensagens = await listMensagensAdmin(filtro);

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading
          title="Mensagens"
          description="Mensagens recebidas pelos formulários de contato."
        />
        <div className="flex gap-2">
          <Button
            variant={filtro === "todas" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href="/admin/mensagens">Todas</Link>
          </Button>
          <Button
            variant={filtro === "nao-lidas" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href="/admin/mensagens?filtro=nao-lidas">Não lidas</Link>
          </Button>
        </div>
      </div>

      {mensagens.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {filtro === "nao-lidas"
            ? "Todas as mensagens já foram lidas."
            : "Nenhuma mensagem recebida até agora."}
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border">
          {mensagens.map((mensagem) => (
            <li
              key={mensagem.id_mensagem}
              className={cn("space-y-3 p-4", !mensagem.lida && "bg-accent/40")}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary">
                    {assuntoLabel(mensagem.assunto)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mensagem.nome} · {dateTime.format(new Date(mensagem.criado_em))}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{contatoOrigemLabel[mensagem.origem]}</Badge>
                  <Badge variant={mensagem.lida ? "secondary" : "default"}>
                    {mensagem.lida ? "Lida" : "Nova"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {mensagem.mensagem}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <a
                  href={`mailto:${mensagem.email}`}
                  className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                >
                  <Mail className="size-4" />
                  {mensagem.email}
                </a>
                {mensagem.telefone ? (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="size-4" />
                    {mensagem.telefone}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <form
                  action={marcarMensagemLida.bind(
                    null,
                    mensagem.id_mensagem,
                    !mensagem.lida,
                  )}
                >
                  <Button type="submit" variant="outline" size="sm">
                    {mensagem.lida ? "Marcar como não lida" : "Marcar como lida"}
                  </Button>
                </form>
                <ConfirmButton
                  action={excluirMensagem.bind(null, mensagem.id_mensagem)}
                  message="Excluir esta mensagem?"
                  size="sm"
                >
                  Excluir
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
