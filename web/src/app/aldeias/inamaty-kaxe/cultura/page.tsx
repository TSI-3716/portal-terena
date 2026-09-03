import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cultura e Tradições | Inamaty Kaxé",
};

export default function InamatyCulturaPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Cultura e Tradições</h1>
        <p>Língua, dança, saberes e memória da Inamaty Kaxé.</p>
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
