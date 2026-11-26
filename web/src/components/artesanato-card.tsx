import { SiteCard } from "@/components/site-card";
import type { Artesanato } from "@/lib/database";
import { resolveImageUrl } from "@/lib/storage";

export function ArtesanatoCard({ peca }: { peca: Artesanato }) {
  return (
    <SiteCard
      search={`${peca.nome} ${peca.categoria ?? ""} ${peca.descricao ?? ""} artesanato`}
      meta={peca.categoria ?? undefined}
      title={peca.nome}
      description={peca.descricao}
      href={`/artesanato/${peca.id_artesanato}`}
      imageSrc={resolveImageUrl(peca.imagem)}
      imageAlt={peca.nome}
    />
  );
}
