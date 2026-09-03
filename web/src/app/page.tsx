import Link from "next/link";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { VillageMap } from "@/components/village-map";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Kó'ene! Seja bem-vindo ao Portal Terena"
        title="Nossa história, nossa identidade"
        description="Conheça a cultura, as aldeias, os projetos, as notícias e as iniciativas do povo Terena."
      />
      <PageSection>
        <SectionHeader
          title="Nossas Aldeias"
          description="Explore nossas aldeias no mapa e conheça onde estamos."
          action={
            <Button variant="outline" asChild>
              <Link href="/aldeias">Ver todas as aldeias</Link>
            </Button>
          }
        />
        <VillageMap
          places={["Aquidauana", "Miranda", "Sidrolândia", "Campo Grande"]}
        />
      </PageSection>
      <PageSection muted>
        <SectionHeader
          title="Destaques"
          action={
            <Button variant="outline" asChild>
              <Link href="/noticias">Ver notícias</Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            search="dança bate pau cultura"
            title="Dança do Bate-Pau"
            description="Expressão cultural que representa força, união e respeito."
            href="/cultura"
            hrefLabel="Ver mais"
          />
          <SiteCard
            search="juventude terena ação"
            title="Juventude Terena"
            description="Protagonismo, aprendizado, participação e transformação."
            href="/juventude"
            hrefLabel="Conheça"
          />
          <SiteCard
            search="artesanato terena"
            title="Feira & Artesanato"
            description="Valorize o trabalho das artesãs e artesãos Terena."
            href="/feira"
            hrefLabel="Conheça"
          />
        </div>
      </PageSection>
    </>
  );
}
