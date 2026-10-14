"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

export async function marcarMensagemLida(id: string, lida: boolean) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return;

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("mensagem_contato")
    .update({ lida })
    .eq("id_mensagem", parsed.data);

  if (error) throw new Error("Não foi possível atualizar a mensagem.");
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
}

export async function excluirMensagem(id: string) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return;

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("mensagem_contato")
    .delete()
    .eq("id_mensagem", parsed.data);

  if (error) throw new Error("Não foi possível excluir a mensagem.");
  revalidatePath("/admin/mensagens");
  revalidatePath("/admin");
}
