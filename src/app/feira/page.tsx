import type { Metadata } from "next";
import { BookOpen, ShoppingBag, ShoppingBasket, Store, Users } from "lucide-react";
import { Hero } from "@/components/hero";
import { ArtesanatoCard } from "@/components/artesanato-card";
import { EventoCard } from "@/components/evento-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { listArtesanato, listEventos } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Feira & Artesanato" };

export default async function FeiraPage() {
  const [eventos, pecas] = await Promise.all([listEventos(3), listArtesanato(8)]);

  return (
    <>
      <Hero
        eyebrow="Cultura • trabalho • renda"
        title="Feira & Artesanato Terena"
        description="Valorizando o trabalho das artesãs e artesãos Terena, promovendo nossa cultura, gerando renda e fortalecendo nossa identidade."
        imageSrc={staticImage("feira_hero")}
      />
      <PageSection>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Tile
            icon={<ShoppingBasket className="size-5" />}
            title="Artesanato Terena"
            description="Peças únicas que carregam nossa história e tradição."
          />
          <Tile
            icon={<Store className="size-5" />}
            title="Feiras e Eventos"
            description="Feiras culturais e encontros de artesanato nas aldeias."
          />
          <Tile
            icon={<Users className="size-5" />}
            title="Artesãs & Artesãos"
            description="Conheça quem cria, inspira e mantém viva nossa cultura."
          />
          <Tile
            icon={<ShoppingBag className="size-5" />}
            title="Compre com Propósito"
            description="Adquira produtos Terena e fortaleça nossa economia."
          />
          <Tile
            icon={<BookOpen className="size-5" />}
            title="Aprenda e Compartilhe"
            description="Oficinas, saberes e técnicas tradicionais."
          />
        </div>
      </PageSection>
      <PageSection muted>
        <SectionHeader title="Feiras e eventos em destaque" />
        {eventos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum evento cadastrado no momento.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {eventos.map((evento) => (
              <EventoCard key={evento.id_evento} evento={evento} />
            ))}
          </div>
        )}
      </PageSection>
      <PageSection>
        <SectionHeader title="Produtos em destaque" />
        {pecas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma peça disponível no momento.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pecas.map((peca) => (
              <ArtesanatoCard key={peca.id_artesanato} peca={peca} metaFrom="preco" />
            ))}
          </div>
        )}
      </PageSection>
    </>
  );
}
