"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ARTESANATO_IMAGE_FOLDER, isArtesanatoId } from "@/lib/artesanato";
import { describeDbError } from "@/lib/db-error";
import { listGaleria, readGaleriaFiles, removerArquivos, salvarGaleria } from "@/lib/galeria";
import { registrarErroDb } from "@/lib/log-erro";
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
    fonte: String(formData.get("fonte") ?? ""),
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
  const parsed = artesanatoSchema.safeParse(values);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Verifique os campos.");
  }

  const rawId = String(formData.get("id_artesanato") ?? "");
  const id = rawId && isArtesanatoId(rawId) ? rawId : null;
  if (rawId && !id) {
    return fail("Artesanato inválido.");
  }

  const file = readImageFile(formData);
  if (file) {
    const imageError = validateImageFile(file);
    if (imageError) return fail(imageError);
  }
  const galeria = readGaleriaFiles(formData);
  if (galeria.error) return fail(galeria.error);

  let uploaded: string | null = null;

  try {
    if (file) {
      uploaded = await uploadImage(supabase, ARTESANATO_IMAGE_FOLDER, file);
    }

    // Preço e disponibilidade saíram do cadastro; as colunas antigas não são tocadas.
    const payload = {
      ...parsed.data,
      fonte: parsed.data.fonte || null,
      ...(uploaded ? { imagem: uploaded } : {}),
    };
    let savedId: string | number;

    if (id) {
      const { data: current, error: currentError } = await supabase
        .from("artesanato")
        .select("imagem")
        .eq("id_artesanato", id)
        .maybeSingle();

      if (currentError || !current) {
        throw new Error("Artesanato não encontrado.");
      }

      const { error } = await supabase
        .from("artesanato")
        .update(payload)
        .eq("id_artesanato", id);

      if (error) throw error;

      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
      savedId = id;
    } else {
      const { data, error } = await supabase
        .from("artesanato")
        .insert(payload)
        .select("id_artesanato")
        .single();
      if (error) throw error;
      savedId = data.id_artesanato;
    }

    await salvarGaleria(supabase, "artesanato", savedId, formData, galeria.files);
  } catch (error) {
    if (uploaded) await removeImage(supabase, uploaded);
    await registrarErroDb(`salvar artesanato${id ? ` #${id}` : ""}`, error, {
      tabela: "artesanato",
      registroId: id,
    });
    return fail(describeDbError(error, "salvar o artesanato"));
  }

  revalidatePath("/", "layout");
  redirect("/admin/artesanato?ok=salvo");
}

export async function excluirArtesanato(rawId: number | string) {
  const id = String(rawId);
  if (!isArtesanatoId(id)) redirect("/admin/artesanato?erro=excluir");

  const { supabase } = await requireUser();
  const [{ data }, imagens] = await Promise.all([
    supabase.from("artesanato").select("imagem").eq("id_artesanato", id).maybeSingle(),
    listGaleria("artesanato", id, supabase),
  ]);

  const { data: apagados, error } = await supabase
    .from("artesanato")
    .delete()
    .eq("id_artesanato", id)
    .select("id_artesanato");

  if (error || !apagados?.length) {
    await registrarErroDb(
      `excluir artesanato #${id}`,
      error ?? new Error("Nenhuma linha excluída (permissão ou registro inexistente)."),
      { tabela: "artesanato", registroId: id },
    );
    redirect("/admin/artesanato?erro=excluir");
  }

  if (data?.imagem) await removeImage(supabase, data.imagem);
  await removerArquivos(supabase, imagens);

  revalidatePath("/", "layout");
  redirect("/admin/artesanato?ok=excluido");
}
