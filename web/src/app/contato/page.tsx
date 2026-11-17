import type { Metadata } from "next";
import { getConfiguracao } from "@/lib/configuracao";
import { telefoneDigitos } from "@/lib/validation";
import { Mail, MapPin, Phone, Share2, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { PageSection } from "@/components/site-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Contato" };

export default async function ContatoPage() {
  const config = await getConfiguracao();
  const redes = [
    { href: config.instagram_url, label: "Instagram" },
    { href: config.facebook_url, label: "Facebook" },
    { href: config.youtube_url, label: "YouTube" },
  ].filter((rede): rede is { href: string; label: string } => Boolean(rede.href));
  return (
    <>
      <Hero
        eyebrow="Estamos aqui para ouvir você"
        title="Contato"
        description="Sua opinião, sugestão ou participação é muito importante para construirmos juntos um portal cada vez mais forte para o povo Terena."
        imageSrc={staticImage("contato_hero")}
      />
      <PageSection>
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Envie sua mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato o mais breve
                possível.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContactForm />
              <Alert>
                <ShieldCheck />
                <AlertTitle>Seus dados estão seguros</AlertTitle>
                <AlertDescription>
                  Utilizamos suas informações apenas para responder sua
                  mensagem.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Outras formas de contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">E-mail geral</p>
                  <p>
                    {config.email_contato ? (
                      <a href={`mailto:${config.email_contato}`} className="break-all hover:underline">
                        {config.email_contato}
                      </a>
                    ) : (
                      "A definir"
                    )}
                  </p>
                  {config.prazo_resposta ? (
                    <p className="text-muted-foreground">{config.prazo_resposta}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Telefone / WhatsApp</p>
                  {config.telefone ? (
                    <p>
                      <a href={`tel:+${telefoneDigitos(config.telefone)}`} className="hover:underline">
                        {config.telefone}
                      </a>
                    </p>
                  ) : null}
                  {config.whatsapp ? (
                    <p>
                      <a
                        href={`https://wa.me/${telefoneDigitos(config.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        WhatsApp {config.whatsapp}
                      </a>
                    </p>
                  ) : null}
                  {!config.telefone && !config.whatsapp ? <p>A definir</p> : null}
                  {config.horario_atendimento ? (
                    <p className="text-muted-foreground">{config.horario_atendimento}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Endereço</p>
                  {config.endereco ? <p>{config.endereco}</p> : null}
                  <p>{config.cidade_uf ?? "Mato Grosso do Sul"}</p>
                  <p className="text-muted-foreground">Brasil</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Share2 className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Redes sociais</p>
                  <p className="text-muted-foreground">
                    Acompanhe nossas redes e participe da nossa comunidade.
                  </p>
                  {redes.length > 0 ? (
                    <p className="mt-1 flex flex-wrap gap-x-3 font-medium text-primary">
                      {redes.map((rede) => (
                        <a
                          key={rede.label}
                          href={rede.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {rede.label}
                        </a>
                      ))}
                    </p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </>
  );
}
