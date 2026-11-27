"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { describeDbError } from "@/lib/db-error";
import { listGaleria, readGaleriaFiles, removerArquivos, salvarGaleria } from "@/lib/galeria";
import { registrarErroDb } from "@/lib/log-erro";
import { isNoticiaId, NOTICIA_IMAGE_FOLDER } from "@/lib/noticias";
import { noticiaSchema } from "@/lib/schemas";
import { readImageFile, removeImage, uploadImage, validateImageFile } from "@/lib/storage";

export type NoticiaFormValues = {
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  status: string;
  fonte: string;
  id_aldeias: string[];
};

type NoticiaFormState = {
  error: string;
  values: NoticiaFormValues;
  attempt: number;
};

function noticiaValues(formData: FormData): NoticiaFormValues {
  return {
    titulo: String(formData.get("titulo") ?? ""),
    resumo: String(formData.get("resumo") ?? ""),
    conteudo: String(formData.get("conteudo") ?? ""),
    data_publicacao: String(formData.get("data_publicacao") ?? ""),
    status: String(formData.get("status") ?? ""),
    fonte: String(formData.get("fonte") ?? ""),
    id_aldeias: [...new Set(formData.getAll("id_aldeias").map(String).filter(Boolean))],
  };
}

/** Deixa noticia_aldeia exatamente com as aldeias escolhidas. */
async function sincronizarAldeias(
  supabase: SupabaseClient,
  idNoticia: string | number,
  aldeias: number[],
) {
  let remover = supabase.from("noticia_aldeia").delete().eq("id_noticia", idNoticia);
  if (aldeias.length > 0) remover = remover.not("id_aldeia", "in", `(${aldeias.join(",")})`);
  const { error: deleteError } = await remover;
  if (deleteError) throw deleteError;

  if (aldeias.length === 0) return;
  const { error } = await supabase.from("noticia_aldeia").upsert(
    aldeias.map((id_aldeia) => ({ id_noticia: idNoticia, id_aldeia })),
    { onConflict: "id_noticia,id_aldeia", ignoreDuplicates: true },
  );
  if (error) throw error;
}

function revalidarNoticias() {
  revalidatePath("/", "layout");
}

export async function salvarNoticia(prev: NoticiaFormState | null, formData: FormData) {
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
  const galeria = readGaleriaFiles(formData);
  if (galeria.error) return fail(galeria.error);

  let uploaded: string | null = null;

  try {
    if (file) {
      uploaded = await uploadImage(supabase, NOTICIA_IMAGE_FOLDER, file);
    }

    const { id_aldeias, fonte, ...fields } = parsed.data;
    const aldeias = id_aldeias.map(Number);
    const payload = {
      ...fields,
      fonte: fonte || null,
      // Coluna antiga, mantida por compatibilidade: primeira aldeia ou nenhuma.
      id_aldeia: aldeias[0] ?? null,
      ...(uploaded ? { imagem: uploaded } : {}),
    };

    let savedId: string | number;
    if (id) {
      const { data: current, error: currentError } = await supabase
        .from("noticia")
        .select("imagem")
        .eq("id_noticia", id)
        .maybeSingle();

      if (currentError || !current) {
        throw new Error("Notícia não encontrada.");
      }

      const { error } = await supabase.from("noticia").update(payload).eq("id_noticia", id);
      if (error) throw error;

      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
      savedId = id;
    } else {
      const { data, error } = await supabase
        .from("noticia")
        .insert({ ...payload, id_usuario: user.id })
        .select("id_noticia")
        .single();
      if (error) throw error;
      savedId = data.id_noticia;
    }

    await sincronizarAldeias(supabase, savedId, aldeias);
    await salvarGaleria(supabase, "noticia", savedId, formData, galeria.files);
  } catch (error) {
    if (uploaded) await removeImage(supabase, uploaded);
    await registrarErroDb(`salvar noticia${id ? ` #${id}` : ""}`, error, {
      tabela: "noticia",
      registroId: id,
    });
    return fail(describeDbError(error, "salvar a notícia"));
  }

  revalidarNoticias();
  redirect("/admin/noticias?ok=salvo");
}

export async function excluirNoticia(id: string) {
  if (!isNoticiaId(id)) redirect("/admin/noticias?erro=excluir");

  const { supabase } = await requireUser();
  const [{ data }, imagens] = await Promise.all([
    supabase.from("noticia").select("imagem").eq("id_noticia", id).maybeSingle(),
    listGaleria("noticia", id, supabase),
  ]);

  const { data: apagadas, error } = await supabase
    .from("noticia")
    .delete()
    .eq("id_noticia", id)
    .select("id_noticia");

  if (error || !apagadas?.length) {
    await registrarErroDb(
      `excluir noticia #${id}`,
      error ?? new Error("Nenhuma linha excluída (permissão ou registro inexistente)."),
      { tabela: "noticia", registroId: id },
    );
    redirect("/admin/noticias?erro=excluir");
  }

  if (data?.imagem) await removeImage(supabase, data.imagem);
  await removerArquivos(supabase, imagens);

  revalidarNoticias();
  redirect("/admin/noticias?ok=excluido");
}
