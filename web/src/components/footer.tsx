import Link from "next/link";
import { navLinks } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="footer">
      <div className="site-container footer-grid">
        <div>
          <h3>PORTAL TERENA</h3>
          <p>
            Nosso compromisso é valorizar a história, a cultura e o povo
            Terena, fortalecendo nossa identidade para as futuras gerações.
          </p>
        </div>
        <div>
          <h3>NAVEGAÇÃO</h3>
          <p>
            {navLinks.slice(0, 6).map((link, index) => (
              <span key={link.href}>
                {index > 0 ? <br /> : null}
                <Link href={link.href}>{link.label}</Link>
              </span>
            ))}
          </p>
        </div>
        <div>
          <h3>CULTURA</h3>
          <p>
            Memória Viva / Anciãos
            <br />
            História Terena
            <br />
            Língua Terena
            <br />
            Tradições e Saberes
            <br />
            Calendário Cultural
          </p>
        </div>
        <div>
          <h3>CONTATO</h3>
          <p>
            ✉ contato@portalterena.org.br
            <br />
            ☎ (67) 99999-9999
            <br />
            ⌖ Campo Grande - MS
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2024 Portal Terena. Todos os direitos reservados.
      </div>
    </footer>
  );
}
