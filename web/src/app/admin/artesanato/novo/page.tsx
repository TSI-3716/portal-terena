import type { Metadata } from "next";
import { ArtesanatoForm } from "@/app/admin/artesanato/form";
import { PageHeading } from "@/components/site-layout";

export const metadata: Metadata = { title: "Novo artesanato" };

export default function NovoArtesanatoPage() {
  return (
    <>
      <PageHeading title="Novo artesanato" />
      <ArtesanatoForm />
    </>
  );
}
