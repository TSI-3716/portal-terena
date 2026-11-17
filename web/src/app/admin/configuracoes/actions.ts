"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResourceFormState } from "@/lib/admin/fields";
import { parseFormData } from "@/lib/admin/parse";
import { requireUser } from "@/lib/auth";
import { CONFIGURACAO_CAMPOS } from "@/lib/configuracao";
import { describeDbError } from "@/lib/db-error";
import { registrarErroDb } from "@/lib/log-erro";

export async function salvarConfiguracao(
  prev: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const attempt = (prev?.attempt ?? 0) + 1;
  const { supabase } = await requireUser();
  const { data, errors, values } = parseFormData(CONFIGURACAO_CAMPOS, formData);

  if (Object.keys(errors).length > 0) {
    return { error: "Verifique os campos destacados.", fieldErrors: errors, values, attempt };
  }

  const { error } = await supabase.from("configuracao").update(data).eq("id", 1);
  if (error) {
    await registrarErroDb("salvar as configurações", error, { tabela: "configuracao", registroId: 1 });
    return { error: describeDbError(error, "salvar as configurações"), fieldErrors: {}, values, attempt };
  }

  // Rodapé e página de contato aparecem em todas as páginas.
  revalidatePath("/", "layout");
  redirect("/admin/configuracoes?ok=salvo");
}
