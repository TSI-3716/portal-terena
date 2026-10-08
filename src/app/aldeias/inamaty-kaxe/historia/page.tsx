import type { Metadata } from "next";
import { ContentCard, Timeline } from "@/components/content-blocks";
import { PageHeading, PageSection, SectionHeader } from "@/components/site-layout";

export const metadata: Metadata = { title: "História | Inamaty Kaxé" };

const linhaDoTempo = [
  { label: "Origem", description: "Formação e organização da comunidade." },
  { label: "Memória", description: "Relatos preservados por diferentes gerações." },
  {
    label: "Transformações",
    description: "Educação, infraestrutura e novas iniciativas.",
  },
  {
    label: "Atualidade",
    description: "Continuidade cultural e participação comunitária.",
  },
] as const;

export default function InamatyHistoriaPage() {
  return (
    <>
      <PageHeading
        title="História da Inamaty Kaxé"
        description="Memória, território e continuidade entre gerações."
      />
      <PageSection contained={false} className="pt-4">
        <ContentCard title="Uma história construída pela comunidade">
          <p>
            A memória da aldeia reúne relatos sobre a formação da comunidade, a
            relação com o território e os caminhos percorridos pelas famílias
            Terena ao longo das gerações.
          </p>
          <p>
            Preservar essas histórias é também valorizar os mais velhos, a língua,
            os costumes e os conhecimentos que ajudam a orientar as novas gerações.
          </p>
        </ContentCard>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <SectionHeader
          title="Linha do tempo"
          description="Uma síntese visual da trajetória da comunidade."
        />
        <Timeline steps={linhaDoTempo} />
      </PageSection>
    </>
  );
}
