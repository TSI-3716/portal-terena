import type { Metadata } from "next";
import { contatoItems } from "@/components/aldeia-contatos";
import { ContactForm } from "@/components/contact-form";
import { InfoList } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInamaty, listContatosAldeia } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Contato | Inamaty Kaxé" };

/** Exibido enquanto a comunidade não cadastra seus contatos no painel. */
const canaisPadrao = [
  { label: "Cacique", value: "Representação da comunidade" },
  { label: "Vice-Cacique / Lideranças", value: "Informações e encaminhamentos" },
  { label: "Telefone / WhatsApp", value: "A confirmar pela comunidade" },
  {
    label: "E-mail",
    value: (
      <a
        href="mailto:inamatykaxe@portalterena.org.br"
        className="underline-offset-4 hover:underline"
      >
        inamatykaxe@portalterena.org.br
      </a>
    ),
  },
  { label: "Redes sociais", value: "Perfis oficiais da comunidade" },
];

export default async function InamatyContatoPage() {
  const aldeia = await getInamaty();
  const contatos = aldeia ? await listContatosAldeia(aldeia.id_aldeia) : [];
  const canais = contatos.length > 0 ? contatos.flatMap(contatoItems) : canaisPadrao;

  return (
    <>
      <PageHeading
        title="Contato da Inamaty Kaxé"
        description="Fale com a comunidade e envie sua mensagem."
      />
      <PageSection contained={false} className="pt-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Canais de contato</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoList items={canais} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Envie uma mensagem</CardTitle>
              <CardDescription>
                Sua mensagem é encaminhada às lideranças da comunidade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm variant="aldeia" className="mt-0" />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </>
  );
}
