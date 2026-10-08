"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { NOTICIA_IMAGE_FOLDER } from "@/lib/noticias";
import { noticiaSchema } from "@/lib/schemas";
import { readImageFile, removeImage, uploadImage, validateImageFile } from "@/lib/storage";

export async function salvarNoticia(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const { supabase } = await requireUser();
  const parsed = noticiaSchema.safeParse({
    titulo: formData.get("titulo"),
    resumo: formData.get("resumo"),
    conteudo: formData.get("conteudo"),
    data_publicacao: formData.get("data_publicacao"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Verifique os campos." };
  }

  const rawId = String(formData.get("id_noticia") ?? "");
  const id = rawId ? z.uuid().safeParse(rawId) : null;
  if (rawId && !id?.success) {
    return { error: "Notícia inválida." };
  }

  const file = readImageFile(formData);
  if (file) {
    const imageError = validateImageFile(file);
    if (imageError) return { error: imageError };
  }

  let uploaded: string | null = null;

  try {
    if (file) {
      uploaded = await uploadImage(supabase, NOTICIA_IMAGE_FOLDER, file);
    }

    const payload = {
      ...parsed.data,
      ...(uploaded ? { imagem: uploaded } : {}),
    };

    if (id?.success) {
      const { data: current, error: currentError } = await supabase
        .from("noticia")
        .select("imagem")
        .eq("id_noticia", id.data)
        .maybeSingle();

      if (currentError || !current) {
        throw new Error("Notícia não encontrada.");
      }

      const { error } = await supabase
        .from("noticia")
        .update(payload)
        .eq("id_noticia", id.data);

      if (error) throw new Error(error.message);

      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
    } else {
      const { error } = await supabase.from("noticia").insert(payload);
      if (error) throw new Error(error.message);
    }
  } catch {
    if (uploaded) await removeImage(supabase, uploaded);
    return { error: "Não foi possível salvar a notícia." };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/noticias/[id]", "page");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function excluirNoticia(id: string) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) redirect("/admin/noticias");

  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("noticia")
    .select("imagem")
    .eq("id_noticia", parsed.data)
    .maybeSingle();

  const { error } = await supabase
    .from("noticia")
    .delete()
    .eq("id_noticia", parsed.data);

  if (error) {
    throw new Error("Não foi possível excluir a notícia.");
  }

  if (data?.imagem) {
    await removeImage(supabase, data.imagem);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/noticias/[id]", "page");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}
