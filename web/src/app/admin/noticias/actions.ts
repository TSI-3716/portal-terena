"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isNoticiaId, NOTICIA_IMAGE_FOLDER } from "@/lib/noticias";
import { noticiaSchema } from "@/lib/schemas";
import { readImageFile, removeImage, uploadImage, validateImageFile } from "@/lib/storage";

type NoticiaFormState = {
  error: string;
  values: Record<string, string>;
  attempt: number;
};

function noticiaValues(formData: FormData) {
  return {
    titulo: String(formData.get("titulo") ?? ""),
    resumo: String(formData.get("resumo") ?? ""),
    conteudo: String(formData.get("conteudo") ?? ""),
    data_publicacao: String(formData.get("data_publicacao") ?? ""),
    status: String(formData.get("status") ?? ""),
    id_aldeia: String(formData.get("id_aldeia") ?? ""),
  };
}

export async function salvarNoticia(
  prev: NoticiaFormState | null,
  formData: FormData,
) {
  const values = noticiaValues(formData);
  const attempt = (prev?.attempt ?? 0) + 1;
  const fail = (error: string) => ({ error, values, attempt });
  const { supabase, user } = await requireUser();
  const parsed = noticiaSchema.safeParse(values);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Verifique os campos.");
  }

  const rawId = String(formData.get("id_noticia") ?? "");
  const id = rawId && isNoticiaId(rawId) ? rawId : null;
  if (rawId && !id) {
    return fail("Notícia inválida.");
  }

  const file = readImageFile(formData);
  if (file) {
    const imageError = validateImageFile(file);
    if (imageError) return fail(imageError);
  }

  let uploaded: string | null = null;

  try {
    if (file) {
      uploaded = await uploadImage(supabase, NOTICIA_IMAGE_FOLDER, file);
    }

    const { id_aldeia, ...fields } = parsed.data;
    const payload = {
      ...fields,
      id_aldeia: Number(id_aldeia),
      ...(uploaded ? { imagem: uploaded } : {}),
    };

    if (id) {
      const { data: current, error: currentError } = await supabase
        .from("noticia")
        .select("imagem")
        .eq("id_noticia", id)
        .maybeSingle();

      if (currentError || !current) {
        throw new Error("Notícia não encontrada.");
      }

      const { error } = await supabase
        .from("noticia")
        .update(payload)
        .eq("id_noticia", id);

      if (error) throw new Error(error.message);

      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
    } else {
      const { error } = await supabase.from("noticia").insert({
        ...payload,
        id_usuario: user.id,
      });
      if (error) throw new Error(error.message);
    }
  } catch {
    if (uploaded) await removeImage(supabase, uploaded);
    return fail("Não foi possível salvar a notícia.");
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/noticias/[id]", "page");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias?ok=salvo");
}

export async function excluirNoticia(id: string) {
  if (!isNoticiaId(id)) redirect("/admin/noticias?erro=excluir");

  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("noticia")
    .select("imagem")
    .eq("id_noticia", id)
    .maybeSingle();

  const { error } = await supabase
    .from("noticia")
    .delete()
    .eq("id_noticia", id);

  if (error) {
    redirect("/admin/noticias?erro=excluir");
  }

  if (data?.imagem) {
    await removeImage(supabase, data.imagem);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/noticias/[id]", "page");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias?ok=excluido");
}
