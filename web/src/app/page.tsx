import Link from "next/link";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Kó'ene! Seja bem-vindo ao Portal Terena"
        title="Nossa história, nossa identidade"
        description="Conheça a cultura, as aldeias, os projetos, as notícias e as iniciativas do povo Terena."
      />
      <section className="section">
        <div className="site-container">
          <div className="section-head">
            <div>
              <h2>Nossas Aldeias</h2>
              <p>Explore nossas aldeias no mapa e conheça onde estamos.</p>
            </div>
            <Link className="btn" href="/aldeias">
              Ver todas as aldeias →
            </Link>
          </div>
          <div className="map-box">
            <div className="map-fallback" />
            <div className="map-overlay">
              <span className="map-pin">● Aquidauana</span>
              <span className="map-pin">● Miranda</span>
              <span className="map-pin">● Sidrolândia</span>
              <span className="map-pin">● Campo Grande</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="section-head">
            <h2>Destaques</h2>
            <Link className="btn" href="/noticias">
              Ver notícias →
            </Link>
          </div>
          <div className="grid grid-3">
            <SiteCard
              search="dança bate pau cultura"
              title="Dança do Bate-Pau"
              description="Expressão cultural que representa força, união e respeito."
              href="/cultura"
              hrefLabel="Ver mais →"
            />
            <SiteCard
              search="juventude terena ação"
              title="Juventude Terena"
              description="Protagonismo, aprendizado, participação e transformação."
              href="/juventude"
              hrefLabel="Conheça →"
            />
            <SiteCard
              search="artesanato terena"
              title="Feira & Artesanato"
              description="Valorize o trabalho das artesãs e artesãos Terena."
              href="/feira"
              hrefLabel="Conheça →"
            />
          </div>
        </div>
      </section>
    </>
  );
}
