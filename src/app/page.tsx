import Link from "next/link";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { VillageMap } from "@/components/village-map";
import { listLocalizacoes, municipio } from "@/lib/conteudo";
import { listNoticiasPublicas } from "@/lib/noticias";
import { staticImage } from "@/lib/images";

export default async function HomePage() {
  const [noticias, localizacoes] = await Promise.all([
    listNoticiasPublicas({ limit: 3 }),
    listLocalizacoes(),
  ]);
  return (
    <>
      <Hero
        eyebrow="Kó'ene! Seja bem-vindo ao Portal Terena"
        title="Nossa história, nossa identidade"
        description="Conheça a cultura, as aldeias, os projetos, as notícias e as iniciativas do povo Terena."
        imageSrc={staticImage("home_hero")}
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
        <VillageMap places={localizacoes.map(municipio)} />
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
            imageSrc={staticImage("cultura_2")}
            imageAlt="Dança do Bate-Pau"
            description="Expressão cultural que representa força, união e respeito."
            href="/cultura"
            hrefLabel="Ver mais"
          />
          <SiteCard
            search="juventude terena ação"
            title="Juventude Terena"
            imageSrc={staticImage("juventude_1")}
            imageAlt="Juventude Terena"
            description="Protagonismo, aprendizado, participação e transformação."
            href="/juventude"
            hrefLabel="Conheça"
          />
          <SiteCard
            search="artesanato terena"
            title="Feira & Artesanato"
            imageSrc={staticImage("feira_p1")}
            imageAlt="Feira & Artesanato"
            description="Valorize o trabalho das artesãs e artesãos Terena."
            href="/feira"
            hrefLabel="Conheça"
          />
        </div>
      </PageSection>
      {noticias.length > 0 ? (
        <PageSection>
          <SectionHeader
            title="Notícias"
            action={
              <Button variant="outline" asChild>
                <Link href="/noticias">Ver notícias</Link>
              </Button>
            }
          />
          <NoticiaList noticias={noticias} />
        </PageSection>
      ) : null}
    </>
  );
}
