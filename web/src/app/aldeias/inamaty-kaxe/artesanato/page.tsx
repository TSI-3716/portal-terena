import type { Metadata } from "next";
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
          Nenhum artesanato cadastrado no momento.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artesanatos.map((artesanato) => (
            <SiteCard
              key={artesanato.id_artesanato}
              search={`${artesanato.nome} ${artesanato.categoria}`}
              meta={artesanato.categoria}
              title={artesanato.nome}
              href={`/artesanato/${artesanato.id_artesanato}`}
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
