import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/site-layout";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/lib/nav";

export function Footer() {
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
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-primary">
            CULTURA
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Memória Viva / Anciãos</li>
            <li>História Terena</li>
            <li>Língua Terena</li>
            <li>Tradições e Saberes</li>
            <li>Calendário Cultural</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-primary">
            CONTATO
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              contato@portalterena.org.br
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              (67) 99999-9999
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" />
              Campo Grande - MS
            </li>
          </ul>
        </div>
      </Container>
      <Separator />
      <div className="bg-primary py-3 text-center text-xs text-primary-foreground">
        © 2026 Portal Terena. Todos os direitos reservados.
      </div>
    </footer>
  );
}
