import type { Metadata } from "next";
import { ConteudoAdminEditar } from "@/components/admin/conteudo-admin";

export const metadata: Metadata = { title: "Editar conteúdo — Juventude" };

export default async function EditarJuventudePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const [{ id }, { erro }] = await Promise.all([params, searchParams]);
  return <ConteudoAdminEditar slug="juventude" rawId={id} erro={erro} />;
}
