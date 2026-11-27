import type { Metadata } from "next";
import { BuscaForm } from "@/components/busca-form";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { listAldeias } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";
import { listNoticiasPublicas } from "@/lib/noticias";

export const metadata: Metadata = { title: "Notícias" };

const DESTAQUES = 2;

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; aldeia?: string }>;
}) {
  const { q = "", aldeia = "" } = await searchParams;
  const busca = q.trim();
  const aldeias = await listAldeias();
  const filtroAldeia = aldeias.find((item) => String(item.id_aldeia) === aldeia);
  const filtrando = Boolean(busca || filtroAldeia);

  const noticias = await listNoticiasPublicas(busca, undefined, filtroAldeia?.id_aldeia);
  const destaques = filtrando ? [] : noticias.slice(0, DESTAQUES);
  const demais = filtrando ? noticias : noticias.slice(DESTAQUES);

  return (
    <>
      <Hero
        eyebrow="Informação e comunidade"
        title="Notícias"
        description="Acompanhe as notícias do povo Terena, informações, cultura e acontecimentos das aldeias e de Mato Grosso do Sul."
        imageSrc={staticImage("noticias_hero")}
      />
      {destaques.length > 0 ? (
        <PageSection>
          <SectionHeader title="Últimas notícias em destaque" />
          <NoticiaList noticias={destaques} columns={2} />
        </PageSection>
      ) : null}
      <PageSection muted={destaques.length > 0}>
        <SectionHeader
          title={
            filtrando
              ? `Resultados${busca ? ` para “${busca}”` : ""}${filtroAldeia ? ` — ${filtroAldeia.nome}` : ""}`
              : destaques.length > 0
                ? "Mais notícias"
                : "Notícias publicadas"
          }
        />
        <BuscaForm
          action="/noticias"
          q={busca}
          label="Buscar notícia"
          filtro={{
            param: "aldeia",
            label: "Aldeia",
            value: filtroAldeia ? String(filtroAldeia.id_aldeia) : "",
            allLabel: "Todas as notícias",
            options: aldeias.map((item) => ({ value: String(item.id_aldeia), label: item.nome })),
          }}
        />
        <NoticiaList
          noticias={demais}
          empty={
            filtrando
              ? "Nenhuma notícia encontrada. Tente outra palavra-chave."
              : destaques.length > 0
                ? "Não há outras notícias além dos destaques."
                : "Nenhuma notícia publicada ainda."
          }
        />
      </PageSection>
    </>
  );
}
