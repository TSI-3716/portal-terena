import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { listNoticiasAdmin } from "@/lib/noticias";
import { noticiaStatusLabel } from "@/lib/schemas";

export const metadata: Metadata = { title: "Notícias" };

export default async function AdminNoticiasPage() {
  const noticias = await listNoticiasAdmin();

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading
          title="Notícias"
          description="Rascunhos ficam só aqui. Publicadas aparecem no portal."
        />
        <Button asChild>
          <Link href="/admin/noticias/nova">Nova notícia</Link>
        </Button>
      </div>
      {noticias.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma notícia cadastrada.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border">
          {noticias.map((noticia) => (
            <li
              key={noticia.id_noticia}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{noticia.titulo}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(noticia.data_publicacao)}
                </p>
              </div>
              <Badge
                variant={noticia.status === "publicado" ? "default" : "secondary"}
              >
                {noticiaStatusLabel[noticia.status]}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/noticias/${noticia.id_noticia}`}>Editar</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
