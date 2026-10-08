import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { listNoticiasPublicas } from "@/lib/noticias";
import { getPublicAssetUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Notícias" };

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const busca = q.trim();
  const noticias = await listNoticiasPublicas(busca);

  return (
    <>
      <Hero
        eyebrow="Informação e comunidade"
        title="Notícias"
        description="Acompanhe as notícias do povo Terena, informações, cultura e acontecimentos das aldeias e de Mato Grosso do Sul."
        imageSrc={getPublicAssetUrl("noticias.jpg")}
      />
      <PageSection>
        <SectionHeader title="Notícias publicadas" />
        <form className="mb-6 flex max-w-md items-end gap-2">
          <Field>
            <FieldLabel htmlFor="buscar-noticia">Buscar notícia</FieldLabel>
            <Input
              id="buscar-noticia"
              name="q"
              defaultValue={busca}
              placeholder="Palavra-chave"
            />
          </Field>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
        <NoticiaList
          noticias={noticias}
          empty={
            busca
              ? "Nenhuma notícia encontrada."
              : "Nenhuma notícia publicada."
          }
        />
      </PageSection>
    </>
  );
}
