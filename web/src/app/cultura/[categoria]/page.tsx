import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuscaForm } from "@/components/busca-form";
import { ConteudoCard } from "@/components/conteudo-card";
import { ConteudoPublico } from "@/components/conteudo-publico";
import { Vazio } from "@/components/listagem";
import { CardGrid } from "@/components/site-card";
import { Container, PageHeading, PageSection } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSecao, listConteudos } from "@/lib/conteudo";

type Props = {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const secao = await getSecao("cultura");
  const tipo = secao?.categorias.find((item) => item.slug === categoria);
  return { title: tipo ? `${tipo.nome} | Cultura Terena` : "Cultura Terena" };
}

export default async function CategoriaCulturaPage({ params, searchParams }: Props) {
  const [{ categoria }, { q = "" }] = await Promise.all([params, searchParams]);

  // /cultura/12: conteúdo ligado direto a "Cultura", sem subcategoria.
  if (/^[1-9]\d*$/.test(categoria)) return <ConteudoPublico slug="cultura" rawId={categoria} />;

  const secao = await getSecao("cultura");
  const tipo = secao?.categorias.find((item) => item.slug === categoria);
  if (!secao || !tipo) notFound();

  const busca = q.trim();
  const conteudos = await listConteudos({ tipos: [tipo.id_tipo], busca });

  return (
    <>
      <Container>
        <Button variant="ghost" size="sm" asChild className="-ml-3 mt-6">
          <Link href="/cultura">← Cultura Terena</Link>
        </Button>
        <PageHeading title={tipo.nome} description={tipo.descricao ?? undefined} />
      </Container>
      <PageSection>
        <BuscaForm action={`/cultura/${tipo.slug}`} q={busca} label={`Buscar em ${tipo.nome}`} />
        {conteudos.length === 0 ? (
          <Vazio>
            {busca
              ? "Nenhum conteúdo encontrado. Tente outra palavra-chave."
              : "Ainda não há conteúdos publicados nesta categoria."}
          </Vazio>
        ) : (
          <CardGrid>
            {conteudos.map((item) => (
              <ConteudoCard key={item.id_conteudo} conteudo={item} secao={secao} slug="cultura" />
            ))}
          </CardGrid>
        )}
      </PageSection>
    </>
  );
}
