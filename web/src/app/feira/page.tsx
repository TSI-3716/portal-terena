import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Feira & Artesanato" };

export default function FeiraPage() {
  return (
    <>
      <Hero
        eyebrow="Cultura • trabalho • renda"
        title="Feira & Artesanato Terena"
        description="Valorizando o trabalho das artesãs e artesãos Terena, promovendo nossa cultura, gerando renda e fortalecendo nossa identidade."
      />
      <section className="section">
        <div className="site-container">
          <div className="tiles">
            <Tile
              icon="🧺"
              title="Artesanato Terena"
              description="Peças únicas que carregam nossa história e tradição."
            />
            <Tile
              icon="🏪"
              title="Feiras e Eventos"
              description="Feiras culturais e encontros de artesanato nas aldeias."
            />
            <Tile
              icon="👥"
              title="Artesãs & Artesãos"
              description="Conheça quem cria, inspira e mantém viva nossa cultura."
            />
            <Tile
              icon="🛍️"
              title="Compre com Propósito"
              description="Adquira produtos Terena e fortaleça nossa economia."
            />
            <Tile
              icon="📚"
              title="Aprenda e Compartilhe"
              description="Oficinas, saberes e técnicas tradicionais."
            />
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="section-head">
            <h2>Feiras e eventos em destaque</h2>
          </div>
          <div className="grid grid-3">
            <SiteCard
              meta="24 a 26 de maio de 2024"
              title="Feira Cultural Terena 2024"
              description="Artesanato, apresentações culturais, culinária tradicional e muito mais."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              meta="10 a 12 de maio de 2024"
              title="Feira das Mulheres Artesãs"
              description="Valorizando o trabalho das mulheres Terena e sua força criativa."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              meta="07 a 09 de junho de 2024"
              title="Encontro de Artesãos Terena"
              description="Troca de saberes, técnicas e fortalecimento da cultura Terena."
              hrefLabel="Ver detalhes →"
            />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="section-head">
            <h2>Produtos em destaque</h2>
          </div>
          <div className="grid grid-4">
            <SiteCard
              title="Cesto Terena"
              description="Cestaria artesanal."
              hrefLabel="Ver produto →"
            />
            <SiteCard
              title="Colar de Miçangas"
              description="Artesanato tradicional."
              hrefLabel="Ver produto →"
            />
            <SiteCard
              title="Vaso Cerâmico"
              description="Cerâmica Terena."
              hrefLabel="Ver produto →"
            />
            <SiteCard
              title="Balaio Decorativo"
              description="Peça de tecelagem."
              hrefLabel="Ver produto →"
            />
          </div>
        </div>
      </section>
    </>
  );
}
