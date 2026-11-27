import type { Metadata } from "next";
import { ConteudoAdminNovo } from "@/components/admin/conteudo-admin";

export const metadata: Metadata = { title: "Novo conteúdo — Juventude" };

export default async function NovoJuventudePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  return <ConteudoAdminNovo slug="juventude" categoria={categoria} />;
}
