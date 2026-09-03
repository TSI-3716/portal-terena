import type { Metadata } from "next";
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

export const metadata: Metadata = { title: "Contato" };

export default function ContatoPage() {
  return (
    <>
      <Hero
        eyebrow="Estamos aqui para ouvir você"
        title="Contato"
        description="Sua opinião, sugestão ou participação é muito importante para construirmos juntos um portal cada vez mais forte para o povo Terena."
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
                  <p>contato@portalterena.org.br</p>
                  <p className="text-muted-foreground">
                    Respondemos em até 48h úteis.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Telefone / WhatsApp</p>
                  <p>(67) 99999-9999</p>
                  <p className="text-muted-foreground">
                    Segunda a sexta, das 8h às 17h.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Endereço</p>
                  <p>Campo Grande - MS</p>
                  <p className="text-muted-foreground">
                    Mato Grosso do Sul - Brasil
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Share2 className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-medium text-primary">Redes sociais</p>
                  <p className="text-muted-foreground">
                    Acompanhe nossas redes e participe da nossa comunidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </>
  );
}
