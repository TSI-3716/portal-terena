import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Projetos Terena" };

export default function ProjetosPage() {
  return (
    <>
      <Hero
        eyebrow="Iniciativas que transformam"
        title="Projetos Terena"
        description="Conheça iniciativas que fortalecem nossas aldeias, valorizam nossa cultura e promovem desenvolvimento sustentável."
      />
      <section className="section">
        <div className="site-container">
          <div className="tiles tiles-4">
            <Tile
              icon="▦"
              title="Todos os Projetos"
              description="Veja todos os projetos desenvolvidos nas aldeias."
            />
            <Tile
              icon="🌱"
              title="Em Andamento"
              description="Acompanhe iniciativas que estão em execução."
            />
            <Tile
              icon="✓"
              title="Concluídos"
              description="Conheça projetos já realizados com sucesso."
            />
            <Tile
              icon="📁"
              title="Projetos"
              description="Detalhes completos de cada iniciativa."
            />
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="filters">
            <div className="field">
              <label>Aldeia</label>
              <select>
                <option>Todas as aldeias</option>
              </select>
            </div>
            <div className="field">
              <label>Município</label>
              <select>
                <option>Todos os municípios</option>
              </select>
            </div>
            <div className="field">
              <label>Situação</label>
              <select>
                <option>Todas as situações</option>
              </select>
            </div>
            <div className="field">
              <label>Área</label>
              <select>
                <option>Todas as áreas</option>
              </select>
            </div>
          </div>
          <div className="grid grid-3">
            <SiteCard
              search="nascentes meio ambiente"
              meta="MEIO AMBIENTE"
              title="Proteção das Nascentes"
              description="Recuperação de nascentes e preservação dos recursos hídricos."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="formação jovens educação"
              meta="EDUCAÇÃO"
              title="Formação de Jovens Líderes"
              description="Formação para liderança comunitária, cidadania e valorização cultural."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="artesanato renda cultura"
              meta="CULTURA & RENDA"
              title="Artesanato Terena"
              description="Capacitação de artesãos e fortalecimento da produção."
              hrefLabel="Ver detalhes →"
            />
          </div>
        </div>
      </section>
    </>
  );
}
