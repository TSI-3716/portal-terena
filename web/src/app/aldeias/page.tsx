import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";

export const metadata: Metadata = { title: "Nossas Aldeias" };

export default function AldeiasPage() {
  return (
    <>
      <Hero
        eyebrow="Território e comunidade"
        title="Nossas Aldeias"
        description="O povo Terena vive em diferentes aldeias localizadas em Mato Grosso do Sul. Conheça onde estamos."
      />
      <section className="section">
        <div className="site-container">
          <div className="two-col">
            <div className="map-box">
              <div className="map-fallback" />
              <div className="map-overlay">
                <span className="map-pin">● Aquidauana</span>
                <span className="map-pin">● Miranda</span>
                <span className="map-pin">● Nioaque</span>
                <span className="map-pin">● Campo Grande</span>
              </div>
            </div>
            <div className="panel">
              <h2>Filtre no mapa</h2>
              <p>Explore as localidades e encontre informações sobre as aldeias.</p>
              <div className="field">
                <select>
                <option>Todos os municípios</option>
                <option>Aquidauana</option>
                <option>Miranda</option>
                <option>Nioaque</option>
                <option>Sidrolândia</option>
                </select>
              </div>
              <div className="quote">
                + de 30 aldeias espalhadas pelo estado de Mato Grosso do Sul.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="section-head">
            <h2>Destaques das Aldeias</h2>
          </div>
          <div className="grid grid-3">
            <SiteCard
              search="bananal sidrolandia"
              meta="⌖ Sidrolândia - MS"
              title="Aldeia Bananal"
              description="Tradição cultural, atividades comunitárias e valorização das tradições ancestrais."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="buriti aquidauana"
              meta="⌖ Aquidauana - MS"
              title="Aldeia Buriti"
              description="Conhecida pela produção de artesanato e preservação da língua e costumes Terena."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="lagoinha nioaque"
              meta="⌖ Nioaque - MS"
              title="Aldeia Lagoinha"
              description="Aldeia com forte ligação com a natureza e celebrações culturais."
              hrefLabel="Ver detalhes →"
            />
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#f7f4ec" }}>
        <div className="site-container">
          <div className="section-head">
            <div>
              <h2>Aldeia Inamaty Kaxé</h2>
              <p>
                Conheça a área dedicada à história, cultura, juventude,
                projetos, eventos, localização, galeria e contato da aldeia.
              </p>
            </div>
            <Link className="btn primary" href="/aldeias/inamaty-kaxe">
              Conhecer Inamaty Kaxé →
            </Link>
          </div>
          <article className="card">
            <div className="card-img" style={{ height: 220 }} />
            <div className="card-body">
              <h3>Portal da Aldeia Inamaty Kaxé</h3>
              <p>Seção interna do Portal Terena, com as telas da aldeia.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
