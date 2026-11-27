import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConteudoDetalhe, InfoLinha } from "@/components/conteudo-detalhe";
import { getEvento } from "@/lib/conteudo";
import { eventoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { listGaleria } from "@/lib/galeria";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  return { title: evento?.titulo ?? "Evento" };
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  if (!evento || evento.status === "cancelado") notFound();
  const galeria = await listGaleria("evento", evento.id_evento);

  return (
    <ConteudoDetalhe
      categoria="Evento"
      titulo={evento.titulo}
      imagem={resolveImageUrl(evento.imagem)}
      info={
        <div className="space-y-1">
          <InfoLinha label="Data">{formatDate(evento.data_evento)}</InfoLinha>
          <InfoLinha label="Local">{evento.local}</InfoLinha>
          <InfoLinha label="Situação">{statusLabel(eventoStatus, evento.status)}</InfoLinha>
        </div>
      }
      galeria={galeria}
      fonte={evento.fonte}
      voltar={{ href: "/eventos", label: "Voltar para eventos" }}
    >
      {evento.descricao}
    </ConteudoDetalhe>
  );
}
