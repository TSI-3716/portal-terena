import { SiteCard } from "@/components/site-card";
import { type Evento, eventoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { resolveImageUrl } from "@/lib/storage";

export function EventoCard({ evento }: { evento: Evento }) {
  const situacao = statusLabel(eventoStatus, evento.status);

  return (
    <SiteCard
      search={`${evento.titulo} ${evento.descricao ?? ""} ${evento.local ?? ""}`}
      meta={formatDate(evento.data_evento) || undefined}
      title={evento.titulo}
      description={evento.descricao ?? ""}
      imageSrc={resolveImageUrl(evento.imagem)}
      imageAlt={evento.titulo}
      hrefLabel="Ver detalhes"
      details={
        evento.local || situacao ? (
          <>
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
          </>
        ) : undefined
      }
    />
  );
}
