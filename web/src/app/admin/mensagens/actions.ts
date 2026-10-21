"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

export async function marcarMensagemLida(id: string, lida: boolean) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) redirect("/admin/mensagens?erro=salvar");

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("mensagem_contato")
    .update({ lida })
    .eq("id_mensagem", parsed.data);

  if (error) redirect("/admin/mensagens?erro=salvar");
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
  redirect("/admin/mensagens?ok=salvo");
}

export async function excluirMensagem(id: string) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) redirect("/admin/mensagens?erro=excluir");

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("mensagem_contato")
    .delete()
    .eq("id_mensagem", parsed.data);

  if (error) redirect("/admin/mensagens?erro=excluir");
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
  redirect("/admin/mensagens?ok=excluido");
}
