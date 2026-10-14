import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ContentCard } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { INAMATY_NOME, getInamaty } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Localização | Inamaty Kaxé" };

export default async function InamatyLocalizacaoPage() {
  const aldeia = await getInamaty();
  const local = aldeia?.localizacao ?? "Sidrolândia – Mato Grosso do Sul";
  const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Aldeia ${aldeia?.nome ?? INAMATY_NOME} ${local}`,
  )}`;

  return (
    <>
      <PageHeading
        title="Localização"
        description="Território e caminhos para chegar à comunidade."
      />
      <PageSection contained={false} className="pt-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <ContentCard title="Onde estamos">
            <p className="font-semibold text-foreground">
              Aldeia {aldeia?.nome ?? INAMATY_NOME}
            </p>
            <p>
              Terra Indígena Terena
              <br />
              {local}
            </p>
            <p>
              As informações de acesso e coordenadas devem ser confirmadas pela
              comunidade antes da publicação.
            </p>
            <Button asChild>
              <a href={mapaUrl} target="_blank" rel="noopener noreferrer">
                Abrir mapa
                <ExternalLink />
              </a>
            </Button>
          </ContentCard>
          <div className="relative min-h-[360px] overflow-hidden rounded-xl border bg-accent">
            <Image
              src={staticImage("home_map")}
              alt="Mapa de referência"
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
          </div>
        </div>
      </PageSection>
    </>
  );
}
