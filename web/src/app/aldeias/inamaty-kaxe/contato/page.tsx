import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contato | Inamaty Kaxé" };

export default function InamatyContatoPage() {
  return (
    <>
      <div className="inamaty-title">
        <h1>Contato da Inamaty Kaxé</h1>
        <p>Fale com a comunidade e envie sua mensagem.</p>
      </div>
      <section className="section">
        <div className="contact-grid">
          <div className="content-card">
            <h2>Canais de contato</h2>
            <div className="list">
              <div className="list-item">
                <strong>Cacique</strong>Representação da comunidade
              </div>
              <div className="list-item">
                <strong>Vice-Cacique / Lideranças</strong>
                Informações e encaminhamentos
              </div>
              <div className="list-item">
                <strong>Telefone / WhatsApp</strong>A confirmar pela comunidade
              </div>
              <div className="list-item">
                <strong>E-mail</strong>inamatykaxe@portalterena.org.br
              </div>
              <div className="list-item">
                <strong>Redes sociais</strong>Perfis oficiais da comunidade
              </div>
            </div>
          </div>
          <div className="content-card">
            <h2>Envie uma mensagem</h2>
            <p>
              O formulário da aldeia será ligado depois. Por enquanto, use a
              página de <Link href="/contato">contato do portal</Link>.
            </p>
            <p className="form-note">
              Protótipo: o envio ainda não está conectado a um serviço.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
