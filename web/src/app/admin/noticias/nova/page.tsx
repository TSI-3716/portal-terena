import type { Metadata } from "next";
import { NoticiaForm } from "@/app/admin/noticias/form";
import { PageHeading } from "@/components/site-layout";
import { listAldeias } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Nova notícia" };

export default async function NovaNoticiaPage() {
  const aldeias = await listAldeias();

  return (
    <>
      <PageHeading title="Nova notícia" />
      <NoticiaForm aldeias={aldeias} />
    </>
  );
}
