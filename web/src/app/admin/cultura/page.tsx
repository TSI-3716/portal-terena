import type { Metadata } from "next";
import { ConteudoAdminLista } from "@/components/admin/conteudo-admin";

export const metadata: Metadata = { title: "Cultura" };

export default async function AdminCulturaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ok?: string; erro?: string }>;
}) {
  const { categoria, ok, erro } = await searchParams;
  return <ConteudoAdminLista slug="cultura" categoria={categoria} ok={ok} erro={erro} />;
}
