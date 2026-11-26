import type { Metadata } from "next";
import { ConteudoAdminNovo } from "@/components/admin/conteudo-admin";

export const metadata: Metadata = { title: "Novo conteúdo — Cultura" };

export default async function NovoCulturaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  return <ConteudoAdminNovo slug="cultura" categoria={categoria} />;
}
