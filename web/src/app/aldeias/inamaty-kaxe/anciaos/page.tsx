import type { Metadata } from "next";
import { ContentCard, Notice } from "@/components/content-blocks";
import { SiteCard } from "@/components/site-card";
import { PageHeading, PageSection } from "@/components/site-layout";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Anciãos(ãs) | Inamaty Kaxé" };

const anciaos = [
  {
    nome: "Tio Arlindo",
    descricao: "Conhecedor de histórias e tradições.",
    imagem: staticImage("aldeias_1"),
  },
  {
    nome: "Dona Maria Kadiwéu",
    descricao: "Guardiã de saberes e memórias.",
    imagem: staticImage("aldeias_2"),
  },
  {
    nome: "Tio Sebastião",
    descricao: "Conhecedor de plantas e práticas tradicionais.",
    imagem: staticImage("aldeias_3"),
  },
];

export default function InamatyAnciaosPage() {
  return (
    <>
      <PageHeading
        title="Anciãos(ãs) da Inamaty Kaxé"
        description="Memória, experiência e saberes que atravessam gerações."
      />
      <PageSection contained={false} className="pt-4">
        <ContentCard>
          <p>
            Os anciãos e as anciãs ocupam um lugar fundamental na transmissão de
            conhecimentos, histórias, valores e experiências. Seus relatos ajudam
            a compreender a trajetória do povo Terena e a importância de preservar
            sua identidade.
          </p>
        </ContentCard>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {anciaos.map((anciao) => (
            <SiteCard
              key={anciao.nome}
              search={`${anciao.nome} ${anciao.descricao}`}
              title={anciao.nome}
              description={anciao.descricao}
              imageSrc={anciao.imagem}
              imageAlt={anciao.nome}
            />
          ))}
        </div>
        <Notice title="Importante:">
          nomes, fotografias e biografias devem ser confirmados e autorizados pela
          comunidade antes da publicação definitiva.
        </Notice>
      </PageSection>
    </>
  );
}
