import type { Metadata } from "next";

export const metadata: Metadata = { title: "Eventos | Inamaty Kaxé" };

export default function InamatyEventosPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Eventos</h1>
        <p>Celebrações e encontros da Inamaty Kaxé.</p>
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
