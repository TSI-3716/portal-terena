import type { Metadata } from "next";
import Link from "next/link";
import { SiteCard } from "@/components/site-card";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Inamaty Kaxé" };

export default function InamatyHomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-fallback" />
        <div className="hero-content">
          <div className="eyebrow">Aldeia</div>
          <h1>INAMATY KAXÉ</h1>
          <p>Nossa história, território, cultura e o fortalecimento da vida Terena.</p>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Bem-vindo à Inamaty Kaxé</h2>
            <p>
              Um espaço para conhecer a comunidade, suas histórias, tradições,
              projetos e iniciativas.
            </p>
          </div>
        </div>
        <div className="tiles">
          <Tile
            href="/aldeias/inamaty-kaxe/sobre"
            icon="⌂"
            title="Sobre a Aldeia"
            description="História e território."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/cultura"
            icon="◉"
            title="Cultura e Tradições"
            description="Língua, dança, saberes e memória."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/projetos"
            icon="♧"
            title="Projetos"
            description="Iniciativas da comunidade."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/noticias"
            icon="▤"
            title="Notícias"
            description="Acompanhe as novidades."
          />
          <Tile
            href="/aldeias/inamaty-kaxe/juventude"
            icon="♧"
            title="Juventude"
            description="Protagonismo das novas gerações."
          />
        </div>
      </section>
      <section className="section">
        <div className="two-content">
          <div className="content-card">
            <h2>Sobre a comunidade</h2>
            <p>
              A Inamaty Kaxé é apresentada neste portal como um espaço de
              convivência, memória, cultura e participação comunitária. Aqui,
              diferentes gerações compartilham conhecimentos, fortalecem
              tradições e constroem iniciativas para o futuro.
            </p>
            <Link className="btn primary" href="/aldeias/inamaty-kaxe/sobre">
              Conheça nossa história →
            </Link>
          </div>
          <div className="content-card">
            <h2>Em destaque</h2>
            <p>
              <strong>Cultura</strong> · Dança do Bate-Pau
            </p>
            <p>
              <strong>Artesanato</strong> · Cestaria e produção tradicional
            </p>
            <p>
              <strong>Juventude</strong> · Educação, participação e projetos
            </p>
            <Link className="btn" href="/aldeias/inamaty-kaxe/cultura">
              Explorar conteúdos →
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <h2>Últimas novidades</h2>
            <p>Conteúdos organizados por tema para facilitar a navegação.</p>
          </div>
        </div>
        <div className="grid grid-3">
          <SiteCard
            title="Notícias da Aldeia"
            description="Registros de atividades culturais, educativas e comunitárias."
            href="/aldeias/inamaty-kaxe/noticias"
            hrefLabel="Ver notícias →"
          />
          <SiteCard
            title="Juventude Terena"
            description="Participação, aprendizagem e fortalecimento da identidade."
            href="/aldeias/inamaty-kaxe/juventude"
            hrefLabel="Conhecer →"
          />
          <SiteCard
            title="Produção & Artesanato"
            description="Peças, saberes e trabalho artesanal da comunidade."
            href="/aldeias/inamaty-kaxe/artesanato"
            hrefLabel="Conhecer →"
          />
        </div>
      </section>
    </>
  );
}
