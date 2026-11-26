import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoticiaForm } from "@/app/admin/noticias/form";
import { Carimbos } from "@/components/admin/carimbos";
import { PageHeading } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { listAldeias } from "@/lib/conteudo";
import { listGaleria } from "@/lib/galeria";
import { getNoticiaAdmin } from "@/lib/noticias";

export const metadata: Metadata = { title: "Editar notícia" };

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [noticia, aldeias] = await Promise.all([getNoticiaAdmin(id), listAldeias()]);
  if (!noticia) notFound();
  const galeria = await listGaleria("noticia", noticia.id_noticia);

  return (
    <>
      <div className="mb-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title="Editar notícia" />
        {noticia.status === "publicado" ? (
          <Button variant="outline" asChild>
            <Link href={`/noticias/${noticia.id_noticia}`}>Ver no portal</Link>
          </Button>
        ) : null}
      </div>
      <Carimbos criadoEm={noticia.criado_em} atualizadoEm={noticia.atualizado_em} />
      <NoticiaForm noticia={noticia} aldeias={aldeias} galeria={galeria} />
    </>
  );
}
