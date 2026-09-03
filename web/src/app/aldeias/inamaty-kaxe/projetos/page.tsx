import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projetos | Inamaty Kaxé" };

export default function InamatyProjetosPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Projetos da Aldeia</h1>
        <p>Iniciativas desenvolvidas na Inamaty Kaxé.</p>
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
