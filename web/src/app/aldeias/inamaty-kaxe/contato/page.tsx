import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading, PageSection } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Contato | Inamaty Kaxé" };

export default function InamatyContatoPage() {
  return (
    <>
      <PageHeading
        title="Contato da Inamaty Kaxé"
        description="Fale com a comunidade e envie sua mensagem."
      />
      <PageSection contained={false} className="pt-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Canais de contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-primary">Cacique</p>
                <p className="text-muted-foreground">
                  Representação da comunidade
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">
                  Vice-Cacique / Lideranças
                </p>
                <p className="text-muted-foreground">
                  Informações e encaminhamentos
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">Telefone / WhatsApp</p>
                <p className="text-muted-foreground">
                  A confirmar pela comunidade
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">E-mail</p>
                <p className="text-muted-foreground">
                  inamatykaxe@portalterena.org.br
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">Redes sociais</p>
                <p className="text-muted-foreground">
                  Perfis oficiais da comunidade
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Envie uma mensagem</CardTitle>
              <CardDescription>
                O formulário da aldeia será ligado depois. Por enquanto, use a
                página de contato do portal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/contato">Ir para o contato do portal</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </>
  );
}
