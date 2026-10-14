import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AldeiaContatos } from "@/components/aldeia-contatos";
import { ContentCard, InfoList } from "@/components/content-blocks";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  INAMATY_HREF,
  aldeiaHref,
  getAldeia,
  listContatosAldeia,
} from "@/lib/conteudo";
import { formatDate } from "@/lib/format";
import { listNoticiasPublicas } from "@/lib/noticias";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const aldeia = await getAldeia(Number(id));
  return { title: aldeia?.nome ?? "Aldeia" };
}

export default async function AldeiaPage({ params }: Props) {
  const { id } = await params;
  const aldeia = await getAldeia(Number(id));
  if (!aldeia) notFound();
  if (aldeiaHref(aldeia) === INAMATY_HREF) redirect(INAMATY_HREF);

  const [contatos, noticias] = await Promise.all([
    listContatosAldeia(aldeia.id_aldeia),
    listNoticiasPublicas({ idAldeia: aldeia.id_aldeia, limit: 6 }),
  ]);

  return (
    <>
      <Hero
        eyebrow="Aldeia"
        title={aldeia.nome}
        description={aldeia.localizacao ?? "Mato Grosso do Sul"}
        imageSrc={resolveImageUrl(aldeia.imagem)}
        imageAlt={aldeia.nome}
      />
      <PageSection>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ContentCard title="Sobre a aldeia">
            <p className="whitespace-pre-wrap">
              {aldeia.descricao || "A descrição desta aldeia ainda não foi cadastrada."}
            </p>
          </ContentCard>
          <ContentCard title="Informações">
            <InfoList
              items={[
                { label: "Nome", value: aldeia.nome },
                { label: "Povo", value: "Terena" },
                ...(aldeia.localizacao
                  ? [{ label: "Localização", value: aldeia.localizacao }]
                  : []),
                ...(aldeia.data_fundacao
                  ? [{ label: "Fundação", value: formatDate(aldeia.data_fundacao) }]
                  : []),
              ]}
            />
          </ContentCard>
        </div>
      </PageSection>
      {contatos.length > 0 ? (
        <PageSection className="pt-0">
          <SectionHeader title="Contato" />
          <AldeiaContatos contatos={contatos} />
        </PageSection>
      ) : null}
      <PageSection muted>
        <SectionHeader title={`Notícias de ${aldeia.nome}`} />
        <NoticiaList
          noticias={noticias}
          empty="Ainda não há notícias publicadas sobre esta aldeia."
        />
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/aldeias">Voltar para aldeias</Link>
        </Button>
      </PageSection>
    </>
  );
}
