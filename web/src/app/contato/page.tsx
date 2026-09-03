import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";

export const metadata: Metadata = { title: "Contato" };

export default function ContatoPage() {
  return (
    <>
      <Hero
        eyebrow="Estamos aqui para ouvir você"
        title="Contato"
        description="Sua opinião, sugestão ou participação é muito importante para construirmos juntos um portal cada vez mais forte para o povo Terena."
      />
      <section className="section">
        <div className="site-container">
          <div className="contact-grid">
            <div className="panel">
              <h2>Envie sua mensagem</h2>
              <p>
                Preencha o formulário e entraremos em contato o mais breve
                possível.
              </p>
              <ContactForm />
              <div className="notice">
                🛡️ <strong>Seus dados estão seguros!</strong>
                <br />
                <small>
                  Utilizamos suas informações apenas para responder sua
                  mensagem.
                </small>
              </div>
            </div>
            <div className="panel">
              <h2>Outras formas de contato</h2>
              <div className="list">
                <div className="list-item">
                  <strong>✉ E-mail geral</strong>
                  contato@portalterena.org.br
                  <br />
                  <small>Respondemos em até 48h úteis.</small>
                </div>
                <div className="list-item">
                  <strong>☎ Telefone / WhatsApp</strong>
                  (67) 99999-9999
                  <br />
                  <small>Segunda a sexta, das 8h às 17h.</small>
                </div>
                <div className="list-item">
                  <strong>⌖ Endereço</strong>
                  Campo Grande - MS
                  <br />
                  Mato Grosso do Sul - Brasil
                </div>
                <div className="list-item">
                  <strong>● Redes Sociais</strong>
                  Acompanhe nossas redes e participe da nossa comunidade.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
