import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtesanatoForm } from "@/app/admin/artesanato/form";
import { PageHeading } from "@/components/site-layout";
import { getArtesanatoAdmin } from "@/lib/artesanato";
import { listGaleria } from "@/lib/galeria";

export const metadata: Metadata = { title: "Editar artesanato" };

export default async function EditarArtesanatoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artesanato = await getArtesanatoAdmin(id);
  if (!artesanato) notFound();
  const galeria = await listGaleria("artesanato", artesanato.id_artesanato);

  return (
    <>
      <PageHeading title="Editar artesanato" />
      <ArtesanatoForm artesanato={artesanato} galeria={galeria} />
    </>
  );
}
