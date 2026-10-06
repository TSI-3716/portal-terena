import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listArtesanatosAdmin } from "@/lib/artesanato";

export const metadata: Metadata = { title: "Artesanato" };

export default async function AdminArtesanatoPage() {
  const artesanatos = await listArtesanatosAdmin();

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading
          title="Artesanato"
          description="Gerencie os produtos artesanais do portal."
        />
        <Button asChild>
          <Link href="/admin/artesanato/novo">Novo artesanato</Link>
        </Button>
      </div>
      {artesanatos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum artesanato cadastrado.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border">
          {artesanatos.map((artesanato) => (
            <li
              key={artesanato.id_artesanato}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{artesanato.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {artesanato.categoria} · R$ {Number(artesanato.preco).toFixed(2).replace(".", ",")}
                </p>
              </div>
              <Badge variant={artesanato.disponivel ? "default" : "secondary"}>
                {artesanato.disponivel ? "Disponível" : "Indisponível"}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/artesanato/${artesanato.id_artesanato}`}>Editar</Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
