import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FooterContextColumn } from "@/components/footer-context-column";
import { Container } from "@/components/site-layout";
import { Separator } from "@/components/ui/separator";
import { getConfiguracao } from "@/lib/configuracao";
import { navLinks } from "@/lib/nav";
import { telefoneDigitos } from "@/lib/validation";

export async function Footer() {
  const config = await getConfiguracao();
  const redes = [
    { href: config.instagram_url, label: "Instagram" },
    { href: config.facebook_url, label: "Facebook" },
    { href: config.youtube_url, label: "YouTube" },
  ].filter((rede): rede is { href: string; label: string } => Boolean(rede.href));

  return (
    <footer className="mt-auto border-t-8 border-brown bg-secondary">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-primary">
            PORTAL TERENA
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nosso compromisso é valorizar a história, a cultura e o povo
            Terena, fortalecendo nossa identidade para as futuras gerações.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-primary">
            NAVEGAÇÃO
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {navLinks.slice(0, 6).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <FooterContextColumn />
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-primary">
            CONTATO
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {config.email_contato ? (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${config.email_contato}`} className="break-all hover:text-foreground">
                  {config.email_contato}
                </a>
              </li>
            ) : null}
            {config.telefone ? (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:+${telefoneDigitos(config.telefone)}`} className="hover:text-foreground">
                  {config.telefone}
                </a>
              </li>
            ) : null}
            {config.whatsapp ? (
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" />
                <a
                  href={`https://wa.me/${telefoneDigitos(config.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  WhatsApp {config.whatsapp}
                </a>
              </li>
            ) : null}
            {config.endereco || config.cidade_uf ? (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{[config.endereco, config.cidade_uf].filter(Boolean).join(" · ")}</span>
              </li>
            ) : null}
            {config.horario_atendimento ? (
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" />
                {config.horario_atendimento}
              </li>
            ) : null}
          </ul>
          {redes.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-primary">
              {redes.map((rede) => (
                <li key={rede.label}>
                  <a href={rede.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {rede.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
      <Separator />
      <div className="bg-primary py-3 text-center text-xs text-primary-foreground">
        © 2026 Portal Terena. Todos os direitos reservados.
      </div>
    </footer>
  );
}
