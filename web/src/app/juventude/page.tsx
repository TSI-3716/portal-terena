import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Juventude Terena" };

export default function JuventudePage() {
  return (
    <>
      <Hero
        eyebrow="Protagonismo • aprendizado • participação"
        title="Juventude Terena"
        description="A força que mantém nossa cultura viva e constrói o futuro do nosso povo."
      />
      <section className="section">
        <div className="site-container">
          <div className="tiles">
            <Tile
              icon="👥"
              title="Protagonismo Jovem"
              description="Juventude atuando e fazendo a diferença nas aldeias."
            />
            <Tile
              icon="📖"
              title="Educação e Formação"
              description="Oportunidades de aprendizado e qualificação."
            />
            <Tile
              icon="🪶"
              title="Cultura e Identidade"
              description="Fortalecendo tradições, língua e saberes ancestrais."
            />
            <Tile
              icon="📣"
              title="Participação"
              description="Espaços de diálogo, representação e cidadania."
            />
            <Tile
              icon="🚀"
              title="Oportunidades"
              description="Bolsas, editais, cursos e outras oportunidades."
            />
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="section-head">
            <h2>Destaques da Juventude</h2>
          </div>
          <div className="grid grid-3">
            <SiteCard
              search="encontro jovens protagonismo"
              title="Encontro de Jovens Terena"
              description="Jovens de várias aldeias se reúnem para planejar ações e fortalecer a união."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="curso língua educação"
              title="Curso de Língua Terena"
              description="Aprendizado e valorização da nossa língua materna."
              hrefLabel="Ver detalhes →"
            />
            <SiteCard
              search="meio ambiente participação"
              title="Juventude e Meio Ambiente"
              description="Ações de conscientização e cuidado com os recursos naturais."
              hrefLabel="Ver detalhes →"
            />
          </div>
        </div>
      </section>
    </>
  );
}
