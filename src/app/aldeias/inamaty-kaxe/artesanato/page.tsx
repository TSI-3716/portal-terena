import type { Metadata } from "next";
import { ArtesanatoCard } from "@/components/artesanato-card";
import { ContentCard, Notice } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { listArtesanato } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Produção & Artesanato | Inamaty Kaxé" };

export default async function InamatyArtesanatoPage() {
  const pecas = await listArtesanato();

  return (
    <>
      <PageHeading
        title="Produção & Artesanato"
        description="Conhecimento, criatividade e identidade."
      />
      <PageSection contained={false} className="pt-4">
        <ContentCard>
          <p>
            O artesanato reúne conhecimentos técnicos, formas, materiais e
            referências culturais transmitidos entre gerações. Além de expressão
            cultural, representa trabalho, criatividade e geração de renda.
          </p>
        </ContentCard>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        {pecas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma peça cadastrada ainda.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pecas.map((peca) => (
              <ArtesanatoCard key={peca.id_artesanato} peca={peca} />
            ))}
          </div>
        )}
        <Notice title="Valorização:">
          dados de artesãos, preços, formas de compra e contatos devem ser
          cadastrados pelos próprios produtores ou pela comunidade.
        </Notice>
      </PageSection>
    </>
  );
}
