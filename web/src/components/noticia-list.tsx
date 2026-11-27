import { CardGrid, SiteCard } from "@/components/site-card";
import { formatDate } from "@/lib/format";
import type { NoticiaResumo } from "@/lib/noticias";
import { resolveImageUrl } from "@/lib/storage";

export function NoticiaList({
  noticias,
  empty = "Nenhuma notícia publicada.",
  columns = 3,
}: {
  noticias: NoticiaResumo[];
  empty?: string;
  columns?: 2 | 3;
}) {
  if (noticias.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <CardGrid columns={columns}>
      {noticias.map((noticia) => (
        <SiteCard
          key={noticia.id_noticia}
          search={`${noticia.titulo} ${noticia.resumo}`}
          meta={formatDate(noticia.data_publicacao) || undefined}
          title={noticia.titulo}
          description={noticia.resumo}
          href={`/noticias/${noticia.id_noticia}`}
          imageSrc={resolveImageUrl(noticia.imagem)}
          imageAlt={noticia.titulo}
          details={
            noticia.aldeias.length > 0 ? (
              <p className="line-clamp-1">
                <strong className="text-primary">
                  {noticia.aldeias.length > 1 ? "Aldeias" : "Aldeia"}:
                </strong>{" "}
                {noticia.aldeias.map((aldeia) => aldeia.nome).join(", ")}
              </p>
            ) : undefined
          }
        />
      ))}
    </CardGrid>
  );
}
