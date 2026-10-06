import type { Metadata } from "next";
import Link from "next/link";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { SiteCard } from "@/components/site-card";
import { listArtesanatosPublicos } from "@/lib/artesanato";
import { getPublicAssetUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Artesanato | Inamaty Kaxé" };

export default async function InamatyArtesanatoPage() {
  const artesanatos = await listArtesanatosPublicos();

  return (
    <PageSection>
      <SectionHeader
        title="Produção & Artesanato"
        description="Peças, saberes e trabalho artesanal da comunidade."
      />
      {artesanatos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum artesanato disponível no momento.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artesanatos.map((artesanato) => (
            <SiteCard
              key={artesanato.id_artesanato}
              search={`${artesanato.nome} ${artesanato.categoria}`}
              meta={`${artesanato.categoria} · R$ ${Number(artesanato.preco).toFixed(2).replace(".", ",")}`}
              title={artesanato.nome}
              description={artesanato.categoria}
              imageSrc={
                artesanato.imagem
                  ? getPublicAssetUrl(artesanato.imagem)
                  : undefined
              }
              imageAlt={artesanato.nome}
            />
          ))}
        </div>
      )}
    </PageSection>
  );
}
