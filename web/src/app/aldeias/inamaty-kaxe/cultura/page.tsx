import type { Metadata } from "next";
import { ContentCard } from "@/components/content-blocks";
import { SiteCard } from "@/components/site-card";
import { PageHeading, PageSection } from "@/components/site-layout";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Cultura e Tradições | Inamaty Kaxé" };

const temas = [
  {
    titulo: "Língua Terena",
    descricao: "A língua como patrimônio e instrumento de identidade.",
    imagem: staticImage("cultura_1"),
  },
  {
    titulo: "Artesanato",
    descricao: "Conhecimentos técnicos e expressões transmitidos entre gerações.",
    imagem: staticImage("feira_1"),
  },
  {
    titulo: "Danças e celebrações",
    descricao:
      "Momentos de expressão cultural, união e fortalecimento comunitário.",
    imagem: staticImage("cultura_2"),
  },
];

export default function InamatyCulturaPage() {
  return (
    <>
      <PageHeading
        title="Cultura e Tradições"
        description="Nossa cultura continua viva no cotidiano."
      />
      <PageSection contained={false} className="pt-4">
        <ContentCard>
          <p>
            A cultura Terena se expressa por meio da língua, das relações
            comunitárias, do artesanato, das celebrações e dos conhecimentos
            transmitidos entre gerações. Nesta área, o portal organiza os
            conteúdos culturais para facilitar o acesso e a valorização da
            identidade da comunidade.
          </p>
        </ContentCard>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {temas.map((tema) => (
            <SiteCard
              key={tema.titulo}
              search={`${tema.titulo} ${tema.descricao}`}
              title={tema.titulo}
              description={tema.descricao}
              imageSrc={tema.imagem}
              imageAlt={tema.titulo}
            />
          ))}
        </div>
      </PageSection>
    </>
  );
}
