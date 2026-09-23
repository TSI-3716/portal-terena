import type { Metadata } from "next";
import { NoticiaForm } from "@/app/admin/noticias/form";
import { PageHeading } from "@/components/site-layout";

export const metadata: Metadata = { title: "Nova notícia" };

export default function NovaNoticiaPage() {
  return (
    <>
      <PageHeading title="Nova notícia" />
      <NoticiaForm />
    </>
  );
}
