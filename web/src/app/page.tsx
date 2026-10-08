import Link from "next/link";
import { Hero } from "@/components/hero";
import { NoticiaList } from "@/components/noticia-list";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { VillageMap } from "@/components/village-map";
import { listNoticiasPublicas } from "@/lib/noticias";

export default async function HomePage() {
  const noticias = await listNoticiasPublicas("", 3);
  return (
    <>

      <Hero
        slides={[
          {
            eyebrow: "Portal Terena",
            title: "Povo Terena",
            description: "Conheça nossa história, cultura e território.",
            imageSrc: "/imagens/home_hero.jpg",
            imageAlt: "Povo Terena",
          },
          {
            eyebrow: "Nossa cultura",
            title: "Tradição e identidade",
            description: "Conheça a cultura e as tradições do povo Terena.",
            imageSrc: "/imagens/cultura_2.jpg",
            imageAlt: "Cultura Terena",
          },
          {
            eyebrow: "Nossas aldeias",
            title: "Território e comunidade",
            description: "Conheça as aldeias e comunidades Terena.",
            imageSrc: "/imagens/aldeias_2.jpg",
            imageAlt: "Aldeia Terena",
          },
        ]}
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
