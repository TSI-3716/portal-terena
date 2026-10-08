import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { staticImage } from "@/lib/images";
import { listNoticiasPublicas } from "@/lib/noticias";

export const metadata: Metadata = { title: "Notícias" };

const DESTAQUES = 2;

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const busca = q.trim();
  const noticias = await listNoticiasPublicas({ busca });

  // Sem busca: as duas mais recentes ficam em destaque, como no layout original.
  const destaques = busca ? [] : noticias.slice(0, DESTAQUES);
  const demais = busca ? noticias : noticias.slice(DESTAQUES);

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
        {busca || destaques.length === 0 ? (
          <SectionHeader
            title={busca ? `Resultados para “${busca}”` : "Notícias publicadas"}
          />
        ) : null}
        <form className="mb-6 flex max-w-md items-end gap-2" role="search">
          <Field>
            <FieldLabel htmlFor="buscar-noticia">Buscar notícia</FieldLabel>
            <Input
              id="buscar-noticia"
              name="q"
              type="search"
              defaultValue={busca}
              placeholder="Palavra-chave"
            />
          </Field>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
        {busca || demais.length > 0 || destaques.length === 0 ? (
          <NoticiaList
            noticias={demais}
            empty={
              busca
                ? "Nenhuma notícia encontrada. Tente outra palavra-chave."
                : "Nenhuma notícia publicada ainda."
            }
          />
        ) : null}
      </PageSection>
    </>
  );
}
