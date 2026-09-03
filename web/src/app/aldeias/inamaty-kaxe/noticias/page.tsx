import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notícias | Inamaty Kaxé" };

export default function InamatyNoticiasPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Notícias da Aldeia</h1>
        <p>Acompanhe as novidades da Inamaty Kaxé.</p>
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
