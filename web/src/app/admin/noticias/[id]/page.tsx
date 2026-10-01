import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoticiaForm } from "@/app/admin/noticias/form";
import { PageHeading } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { getNoticiaAdmin } from "@/lib/noticias";

export const metadata: Metadata = { title: "Editar notícia" };

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await getNoticiaAdmin(id);
  if (!noticia) notFound();

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title="Editar notícia" />
        {noticia.status === "publicado" ? (
          <Button variant="outline" asChild>
            <Link href={`/noticias/${noticia.id_noticia}`}>Ver no portal</Link>
          </Button>
        ) : null}
      </div>
      <NoticiaForm noticia={noticia} />
    </>
  );
}
