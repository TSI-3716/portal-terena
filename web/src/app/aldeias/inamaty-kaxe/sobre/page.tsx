import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre a Aldeia | Inamaty Kaxé" };

export default function InamatySobrePage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Sobre a Aldeia</h1>
        <p>Território, comunidade e memória.</p>
      </div>
      <section className="section">
        <div className="two-content">
          <div className="content-card">
            <h2>Um lugar de convivência e identidade</h2>
            <p>
              A história da Inamaty Kaxé é contada a partir da relação entre
              território, comunidade e cultura. O cotidiano reúne famílias,
              práticas comunitárias, educação e a transmissão de conhecimentos
              entre gerações.
            </p>
            <p>
              Este espaço apresenta informações básicas para que visitantes
              conheçam a aldeia e encontrem os conteúdos específicos nas demais
              seções do portal.
            </p>
          </div>
          <div className="content-card">
            <h2>Informações</h2>
            <div className="list">
              <div className="list-item">
                <strong>Nome</strong>Inamaty Kaxé
              </div>
              <div className="list-item">
                <strong>Povo</strong>Terena
              </div>
              <div className="list-item">
                <strong>Município</strong>Sidrolândia – MS
              </div>
              <div className="list-item">
                <strong>Localização</strong>Terra Indígena Terena
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
