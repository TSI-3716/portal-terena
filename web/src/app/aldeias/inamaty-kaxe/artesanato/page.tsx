import type { Metadata } from "next";

export const metadata: Metadata = { title: "Artesanato | Inamaty Kaxé" };

export default function InamatyArtesanatoPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Produção & Artesanato</h1>
        <p>Peças, saberes e trabalho artesanal da comunidade.</p>
      </div>
      <section className="section">
        <div className="content-card">
          <p>
            Conteúdo desta tela será preenchido na próxima etapa, a partir do
            HTML de exemplo.
          </p>
        </div>
      </section>
    </>
  );
}
