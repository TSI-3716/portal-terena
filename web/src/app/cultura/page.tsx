import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Cultura Terena" };

export default function CulturaPage() {
  return (
    <>
      <Hero
        eyebrow="Memória • língua • tradições"
        title="Cultura Terena"
        description="Nossa cultura é viva e se fortalece a cada geração. Conheça memória, história, língua, tradições e calendário cultural."
      />
      <section className="section">
        <div className="site-container">
          <div className="section-head">
            <h2>Navegue pela Cultura</h2>
          </div>
          <div className="tiles">
            <Tile
              icon="👴"
              title="Memória Viva / Anciãos"
              description="Sabedoria e ensinamentos dos guardiões da memória Terena."
            />
            <Tile
              icon="🏺"
              title="História Terena"
              description="Origens, trajetória e marcos históricos do povo Terena."
            />
            <Tile
              icon="💬"
              title="Língua Terena"
              description="Palavras, expressões e fortalecimento da nossa língua."
            />
            <Tile
              icon="🪶"
              title="Tradições e Saberes"
              description="Costumes, rituais, danças, cantos e conhecimentos tradicionais."
            />
            <Tile
              icon="📅"
              title="Calendário Cultural"
              description="Eventos e celebrações que marcam o ciclo cultural Terena."
            />
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "#fbfaf6" }}>
        <div className="site-container">
          <div className="section-head">
            <h2>Destaques da Cultura</h2>
          </div>
          <div className="grid grid-3">
            <SiteCard
              title="Ancião Kadiwéu"
              description="Guardião das histórias e da sabedoria do povo."
            />
            <SiteCard
              title="Dança do Bate-Pau"
              description="Expressão cultural que representa força, união e respeito."
            />
            <SiteCard
              title="Aprenda Terena"
              description="Palavras e expressões para fortalecer nossa língua."
            />
          </div>
        </div>
      </section>
    </>
  );
}
