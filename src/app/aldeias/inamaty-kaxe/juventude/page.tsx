import type { Metadata } from "next";
import { BookOpen, Cpu, Feather, Megaphone } from "lucide-react";
import { ContentCard, WideImage } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Juventude | Inamaty Kaxé" };

export default function InamatyJuventudePage() {
  return (
    <>
      <PageHeading
        title="Juventude Terena"
        description="Protagonismo jovem e construção do futuro."
      />
      <PageSection contained={false} className="pt-4">
        <ContentCard>
          <p>
            Os jovens têm papel importante na continuidade das práticas
            culturais, na educação, na comunicação e na participação
            comunitária. Esta seção reúne iniciativas e oportunidades para
            fortalecer a voz das novas gerações.
          </p>
          <WideImage
            src={staticImage("juventude_hero")}
            alt="Jovens Terena reunidos"
            className="mt-4"
          />
        </ContentCard>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            icon={<BookOpen className="size-5" />}
            title="Educação"
            description="Aprender, compartilhar e ampliar oportunidades."
          />
          <Tile
            icon={<Feather className="size-5" />}
            title="Cultura"
            description="Fortalecer a identidade e os saberes."
          />
          <Tile
            icon={<Megaphone className="size-5" />}
            title="Participação"
            description="Jovens contribuindo para decisões e projetos."
          />
          <Tile
            icon={<Cpu className="size-5" />}
            title="Tecnologia"
            description="Novas formas de comunicar e preservar memórias."
          />
        </div>
      </PageSection>
    </>
  );
}
