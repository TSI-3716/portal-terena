"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { ARTESANATO_IMAGE_FOLDER } from "@/lib/artesanato";
import { artesanatoSchema } from "@/lib/schemas";
import { readImageFile, removeImage, uploadImage, validateImageFile } from "@/lib/storage";

type ArtesanatoFormState = {
  error: string;
  values: Record<string, string>;
  attempt: number;
};

function artesanatoValues(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    categoria: String(formData.get("categoria") ?? ""),
    preco: String(formData.get("preco") ?? ""),
    disponivel: String(formData.get("disponivel") ?? ""),
  };
}

export async function salvarArtesanato(
  prev: ArtesanatoFormState | null,
  formData: FormData,
) {
  const values = artesanatoValues(formData);
  const attempt = (prev?.attempt ?? 0) + 1;
  const fail = (error: string) => ({ error, values, attempt });
  const { supabase } = await requireUser();
  const parsed = artesanatoSchema.safeParse({
    nome: values.nome,
    descricao: values.descricao,
    categoria: values.categoria,
    preco: values.preco,
    disponivel: values.disponivel === "true",
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Verifique os campos.");
  }

  const rawId = String(formData.get("id_artesanato") ?? "");
  const id = rawId ? z.uuid().safeParse(rawId) : null;
  if (rawId && !id?.success) {
    return fail("Artesanato inválido.");
  }

  const file = readImageFile(formData);
  if (file) {
    const imageError = validateImageFile(file);
    if (imageError) return fail(imageError);
  }

  let uploaded: string | null = null;

  try {
    if (file) {
      uploaded = await uploadImage(supabase, ARTESANATO_IMAGE_FOLDER, file);
    }

    const payload = {
      ...parsed.data,
      ...(uploaded ? { imagem: uploaded } : {}),
    };

    if (id?.success) {
      const { data: current, error: currentError } = await supabase
        .from("artesanato")
        .select("imagem")
        .eq("id_artesanato", id.data)
        .maybeSingle();

      if (currentError || !current) {
        throw new Error("Artesanato não encontrado.");
      }

      const { error } = await supabase
        .from("artesanato")
        .update(payload)
        .eq("id_artesanato", id.data);

      if (error) throw new Error(error.message);

      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
    } else {
      const { error } = await supabase.from("artesanato").insert(payload);
      if (error) throw new Error(error.message);
    }
  } catch {
    if (uploaded) await removeImage(supabase, uploaded);
    return fail("Não foi possível salvar o artesanato.");
  }

  revalidatePath("/artesanato");
  revalidatePath("/artesanato/[id]", "page");
  revalidatePath("/admin/artesanato");
  redirect("/admin/artesanato?ok=salvo");
}

export async function excluirArtesanato(id: string) {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) redirect("/admin/artesanato?erro=excluir");

  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("artesanato")
    .select("imagem")
    .eq("id_artesanato", parsed.data)
    .maybeSingle();

  const { error } = await supabase
    .from("artesanato")
    .delete()
    .eq("id_artesanato", parsed.data);

  if (error) {
    redirect("/admin/artesanato?erro=excluir");
  }

  if (data?.imagem) {
    await removeImage(supabase, data.imagem);
  }

  revalidatePath("/artesanato");
  revalidatePath("/artesanato/[id]", "page");
  revalidatePath("/admin/artesanato");
  redirect("/admin/artesanato?ok=excluido");
}
