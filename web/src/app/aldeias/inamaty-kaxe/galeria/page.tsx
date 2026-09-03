import type { Metadata } from "next";

export const metadata: Metadata = { title: "Galeria | Inamaty Kaxé" };

export default function InamatyGaleriaPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Galeria</h1>
        <p>Imagens da vida comunitária na Inamaty Kaxé.</p>
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
