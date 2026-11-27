import type { Metadata } from "next";
import { BuscaForm } from "@/components/busca-form";
import { EventoCard } from "@/components/evento-card";
import { Hero } from "@/components/hero";
import { Listagem, Vazio } from "@/components/listagem";
import { CardGrid } from "@/components/site-card";
import { listEventos } from "@/lib/conteudo";
import { eventoStatus } from "@/lib/database";
import { staticImage } from "@/lib/images";
import { destaquesRotativos } from "@/lib/text";

export const metadata: Metadata = { title: "Eventos" };

/** Cancelados não aparecem no portal, então não entram no filtro. */
const situacoes = eventoStatus.filter((status) => status.value !== "cancelado");

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; situacao?: string }>;
}) {
  const { q = "", situacao } = await searchParams;
  const busca = q.trim();
  const filtro = situacoes.find((status) => status.value === situacao)?.value;
  const filtrando = Boolean(busca || filtro);

  const eventos = await listEventos({ busca, status: filtro });
  const destaques = filtrando ? [] : destaquesRotativos(eventos, 3);

  return (
    <>
      <Hero
        eyebrow="Encontros • feiras • celebrações"
        title="Eventos"
        description="Feiras, oficinas, encontros e celebrações do povo Terena."
        imageSrc={staticImage("feira_hero")}
      />
      <Listagem
        destaquesTitulo="Eventos em destaque"
        destaques={
          destaques.length > 0 ? (
            <CardGrid>
              {destaques.map((evento) => (
                <EventoCard key={evento.id_evento} evento={evento} />
              ))}
            </CardGrid>
          ) : undefined
        }
        titulo={filtrando ? "Resultado da consulta" : "Todos os eventos"}
        busca={
          <BuscaForm
            action="/eventos"
            q={busca}
            label="Buscar evento"
            placeholder="Nome, local ou palavra-chave"
            filtro={{
              param: "situacao",
              label: "Situação",
              value: filtro,
              allLabel: "Todas as situações",
              options: situacoes,
            }}
          />
        }
      >
        {eventos.length === 0 ? (
          <Vazio>
            {filtrando
              ? "Nenhum evento encontrado. Tente outra palavra-chave."
              : "Nenhum evento cadastrado no momento."}
          </Vazio>
        ) : (
          <CardGrid>
            {eventos.map((evento) => (
              <EventoCard key={evento.id_evento} evento={evento} />
            ))}
          </CardGrid>
        )}
      </Listagem>
    </>
  );
}
