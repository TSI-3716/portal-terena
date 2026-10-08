import type { Metadata } from "next";
import { PageHeading, PageSection } from "@/components/site-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Sobre a Aldeia | Inamaty Kaxé" };

export default function InamatySobrePage() {
  return (
    <>
      <PageHeading
        title="Sobre a Aldeia"
        description="Território, comunidade e memória."
      />
      <PageSection contained={false} className="pt-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Um lugar de convivência e identidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                A história da Inamaty Kaxé é contada a partir da relação entre
                território, comunidade e cultura. O cotidiano reúne famílias,
                práticas comunitárias, educação e a transmissão de conhecimentos
                entre gerações.
              </p>
              <p>
                Este espaço apresenta informações básicas para que visitantes
                conheçam a aldeia e encontrem os conteúdos específicos nas demais
                seções do portal.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Informações</CardTitle>
              <CardDescription>Dados da comunidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-primary">Nome</p>
                <p className="text-muted-foreground">Inamaty Kaxé</p>
              </div>
              <div>
                <p className="font-medium text-primary">Povo</p>
                <p className="text-muted-foreground">Terena</p>
              </div>
              <div>
                <p className="font-medium text-primary">Município</p>
                <p className="text-muted-foreground">Sidrolândia – MS</p>
              </div>
              <div>
                <p className="font-medium text-primary">Localização</p>
                <p className="text-muted-foreground">Terra Indígena Terena</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </>
  );
}
