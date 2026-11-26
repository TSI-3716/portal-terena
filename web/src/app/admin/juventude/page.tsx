import type { Metadata } from "next";
import { ConteudoAdminLista } from "@/components/admin/conteudo-admin";

export const metadata: Metadata = { title: "Juventude" };

export default async function AdminJuventudePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ok?: string; erro?: string }>;
}) {
  const { categoria, ok, erro } = await searchParams;
  return <ConteudoAdminLista slug="juventude" categoria={categoria} ok={ok} erro={erro} />;
}
