import type { Metadata } from "next";

export const metadata: Metadata = { title: "História | Inamaty Kaxé" };

export default function InamatyHistoriaPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>História</h1>
        <p>Memória e trajetória da Inamaty Kaxé.</p>
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
