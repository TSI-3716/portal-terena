import type { Metadata } from "next";
import Link from "next/link";
import { Home, Leaf, Newspaper, Sparkles, Users } from "lucide-react";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Inamaty Kaxé" };

export default function InamatyHomePage() {
  return (
    <>
      <Hero
        contained={false}
        eyebrow="Aldeia"
        title="INAMATY KAXÉ"
        description="Nossa história, território, cultura e o fortalecimento da vida Terena."
      />
      <PageSection contained={false}>
        <SectionHeader
          title="Bem-vindo à Inamaty Kaxé"
          description="Um espaço para conhecer a comunidade, suas histórias, tradições, projetos e iniciativas."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Tile
            href="/aldeias/inamaty-kaxe/sobre"
            icon={<Home className="size-5" />}
            title="Sobre a Aldeia"
            description="História e território."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/cultura"
            icon={<Sparkles className="size-5" />}
            title="Cultura e Tradições"
            description="Língua, dança, saberes e memória."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/projetos"
            icon={<Leaf className="size-5" />}
            title="Projetos"
            description="Iniciativas da comunidade."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/noticias"
            icon={<Newspaper className="size-5" />}
            title="Notícias"
            description="Acompanhe as novidades."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/juventude"
            icon={<Users className="size-5" />}
            title="Juventude"
            description="Protagonismo das novas gerações."
          />
        </div>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Sobre a comunidade</CardTitle>
              <CardDescription>
                A Inamaty Kaxé é apresentada neste portal como um espaço de
                convivência, memória, cultura e participação comunitária. Aqui,
                diferentes gerações compartilham conhecimentos, fortalecem
                tradições e constroem iniciativas para o futuro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/aldeias/inamaty-kaxe/sobre">
                  Conheça nossa história
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Em destaque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-primary">Cultura</span> ·
                Dança do Bate-Pau
              </p>
              <p>
                <span className="font-medium text-primary">Artesanato</span> ·
                Cestaria e produção tradicional
              </p>
              <p>
                <span className="font-medium text-primary">Juventude</span> ·
                Educação, participação e projetos
              </p>
              <Button variant="outline" asChild>
                <Link href="/aldeias/inamaty-kaxe/cultura">
                  Explorar conteúdos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>
      <PageSection contained={false} className="pt-0">
        <SectionHeader
          title="Últimas novidades"
          description="Conteúdos organizados por tema para facilitar a navegação."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            title="Notícias da Aldeia"
            description="Registros de atividades culturais, educativas e comunitárias."
            href="/aldeias/inamaty-kaxe/noticias"
            hrefLabel="Ver notícias"
          />
          <SiteCard
            title="Juventude Terena"
            description="Participação, aprendizagem e fortalecimento da identidade."
            href="/aldeias/inamaty-kaxe/juventude"
            hrefLabel="Conhecer"
          />
          <SiteCard
            title="Produção & Artesanato"
            description="Peças, saberes e trabalho artesanal da comunidade."
            href="/aldeias/inamaty-kaxe/artesanato"
            hrefLabel="Conhecer"
          />
        </div>
      </PageSection>
    </>
  );
}
