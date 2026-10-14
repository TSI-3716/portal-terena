import type { Metadata } from "next";
import { ContentCard, InfoList, WideImage } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { Card, CardContent } from "@/components/ui/card";
import { INAMATY_NOME, getInamaty } from "@/lib/conteudo";
import { formatDate } from "@/lib/format";
import { staticImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Sobre a Aldeia | Inamaty Kaxé" };

export default async function InamatySobrePage() {
  const aldeia = await getInamaty();

  const informacoes = [
    { label: "Nome", value: aldeia?.nome ?? INAMATY_NOME },
    { label: "Povo", value: "Terena" },
    { label: "Município", value: aldeia?.localizacao ?? "Sidrolândia – MS" },
    { label: "Localização", value: "Terra Indígena Terena" },
    ...(aldeia?.data_fundacao
      ? [{ label: "Fundação", value: formatDate(aldeia.data_fundacao) }]
      : []),
  ];

  return (
    <>
      <PageHeading
        title="Sobre a Aldeia"
        description="Território, comunidade e memória."
      />
      <PageSection contained={false} className="pt-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ContentCard title="Um lugar de convivência e identidade">
            {aldeia?.descricao ? (
              <p className="whitespace-pre-wrap">{aldeia.descricao}</p>
            ) : (
              <p>
                A história da Inamaty Kaxé é contada a partir da relação entre
                território, comunidade e cultura. O cotidiano reúne famílias,
                práticas comunitárias, educação e a transmissão de conhecimentos
                entre gerações.
              </p>
            )}
            <p>
              Este espaço apresenta informações básicas para que visitantes
              conheçam a aldeia e encontrem os conteúdos específicos nas demais
              seções do portal.
            </p>
          </ContentCard>
          <ContentCard title="Informações">
            <InfoList items={informacoes} />
          </ContentCard>
        </div>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <Card>
          <CardContent>
            <WideImage
              src={resolveImageUrl(aldeia?.imagem) ?? staticImage("inamaty_hero")}
              alt={INAMATY_NOME}
              className="h-[330px]"
            />
          </CardContent>
        </Card>
      </PageSection>
    </>
  );
}
