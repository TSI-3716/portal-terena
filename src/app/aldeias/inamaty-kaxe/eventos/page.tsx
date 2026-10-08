import type { Metadata } from "next";
import { ContentCard } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { listEventos } from "@/lib/conteudo";
import { eventoStatus, statusLabel } from "@/lib/database";
import { formatDayMonth } from "@/lib/format";

export const metadata: Metadata = { title: "Eventos | Inamaty Kaxé" };

export default async function InamatyEventosPage() {
  const eventos = await listEventos();

  return (
    <>
      <PageHeading
        title="Eventos da Aldeia"
        description="Momentos de encontro, cultura e participação comunitária."
      />
      <PageSection contained={false} className="pt-4">
        {eventos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum evento cadastrado no momento.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {eventos.map((evento) => {
              const situacao = statusLabel(eventoStatus, evento.status);
              const detalhes = [evento.descricao, evento.local].filter(Boolean).join(" ");
              return (
                <div
                  key={evento.id_evento}
                  data-search={`${evento.titulo} ${detalhes}`}
                >
                  <ContentCard
                    className="h-full"
                    meta={formatDayMonth(evento.data_evento) || situacao}
                    title={evento.titulo}
                  >
                    {evento.descricao ? <p>{evento.descricao}</p> : null}
                    {evento.local ? (
                      <p>
                        <strong className="text-primary">Local:</strong> {evento.local}
                      </p>
                    ) : null}
                    {situacao ? (
                      <p>
                        <strong className="text-primary">Situação:</strong> {situacao}
                      </p>
                    ) : null}
                  </ContentCard>
                </div>
              );
            })}
          </div>
        )}
      </PageSection>
    </>
  );
}
