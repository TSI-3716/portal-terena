import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";

export const metadata: Metadata = { title: "Notícias" };

export default function NoticiasPage() {
  return (
    <>
      <Hero
        eyebrow="Informação e comunidade"
        title="Notícias"
        description="Acompanhe as notícias do povo Terena, informações, cultura e acontecimentos das aldeias e de Mato Grosso do Sul."
      />
      <section className="section">
        <div className="site-container">
          <div className="section-head">
            <h2>Últimas notícias em destaque</h2>
          </div>
          <div className="grid grid-2">
            <SiteCard
              search="kopenoti festa cultura"
              meta="CULTURA • 20 de maio de 2024"
              title="Festa do Kopenoti reúne aldeias Terena"
              description="Evento marca o início do novo ciclo e fortalece os laços entre as comunidades."
              hrefLabel="Ler notícia →"
            />
            <SiteCard
              search="nascente meio ambiente projeto"
              meta="MEIO AMBIENTE • 18 de maio de 2024"
              title="Projeto de proteção de nascentes avança nas aldeias"
              description="Iniciativa preserva recursos hídricos e promove educação ambiental entre os jovens."
              hrefLabel="Ler notícia →"
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
              <label>Ordenar</label>
              <select>
                <option>Mais recentes</option>
              </select>
            </div>
            <div className="field">
              <label>Buscar notícia</label>
              <input placeholder="Palavra-chave" />
            </div>
          </div>
          <div className="grid grid-3">
            <SiteCard
              search="jovens comunicação mídias digitais"
              meta="JUVENTUDE • 17 de maio de 2024"
              title="Jovens Terena participam de oficina"
              description="Atividade fortalece a comunicação comunitária e valoriza as vozes da juventude."
              hrefLabel="Ler notícia →"
            />
            <SiteCard
              search="artesanato feira"
              meta="ARTESANATO • 15 de maio de 2024"
              title="Artesãs Terena expõem trabalhos na feira"
              description="Peças de cerâmica, bijuterias e cestaria encantam o público."
              hrefLabel="Ler notícia →"
            />
            <SiteCard
              search="escola educação natureza"
              meta="EDUCAÇÃO • 14 de maio de 2024"
              title="Escola da Aldeia desenvolve horta escolar"
              description="Projeto integra alimentação saudável e cuidados com a natureza."
              hrefLabel="Ler notícia →"
            />
          </div>
        </div>
      </section>
    </>
  );
}
