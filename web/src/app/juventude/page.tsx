import type { Metadata } from "next";
import { BookOpen, Feather, Megaphone, Rocket, Users } from "lucide-react";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Juventude Terena" };

export default function JuventudePage() {
  return (
    <>
      <Hero
        eyebrow="Protagonismo • aprendizado • participação"
        title="Juventude Terena"
        description="A força que mantém nossa cultura viva e constrói o futuro do nosso povo."
      />
      <PageSection>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Tile
            icon={<Users className="size-5" />}
            title="Protagonismo Jovem"
            description="Juventude atuando e fazendo a diferença nas aldeias."
          />
          <Tile
            icon={<BookOpen className="size-5" />}
            title="Educação e Formação"
            description="Oportunidades de aprendizado e qualificação."
          />
          <Tile
            icon={<Feather className="size-5" />}
            title="Cultura e Identidade"
            description="Fortalecendo tradições, língua e saberes ancestrais."
          />
          <Tile
            icon={<Megaphone className="size-5" />}
            title="Participação"
            description="Espaços de diálogo, representação e cidadania."
          />
          <Tile
            icon={<Rocket className="size-5" />}
            title="Oportunidades"
            description="Bolsas, editais, cursos e outras oportunidades."
          />
        </div>
      </PageSection>
      <PageSection muted>
        <SectionHeader title="Destaques da Juventude" />
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            search="encontro jovens protagonismo"
            title="Encontro de Jovens Terena"
            description="Jovens de várias aldeias se reúnem para planejar ações e fortalecer a união."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="curso língua educação"
            title="Curso de Língua Terena"
            description="Aprendizado e valorização da nossa língua materna."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="meio ambiente participação"
            title="Juventude e Meio Ambiente"
            description="Ações de conscientização e cuidado com os recursos naturais."
            hrefLabel="Ver detalhes"
          />
        </div>
      </PageSection>
    </>
  );
}
