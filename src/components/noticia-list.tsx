import { SiteCard } from "@/components/site-card";
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
    <div
      className={
        columns === 2
          ? "grid gap-4 md:grid-cols-2"
          : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {noticias.map((noticia) => {
        const meta = [noticia.aldeia?.nome, formatDate(noticia.data_publicacao)]
          .filter(Boolean)
          .join(" • ");

        return (
          <SiteCard
            key={noticia.id_noticia}
            search={`${noticia.titulo} ${noticia.resumo ?? ""} ${noticia.aldeia?.nome ?? ""}`}
            meta={meta || undefined}
            title={noticia.titulo}
            description={noticia.resumo ?? ""}
            href={`/noticias/${noticia.id_noticia}`}
            hrefLabel="Ler notícia"
            imageSrc={resolveImageUrl(noticia.imagem)}
            imageAlt={noticia.titulo}
          />
        );
      })}
    </div>
  );
}
