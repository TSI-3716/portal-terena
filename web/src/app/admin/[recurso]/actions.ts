"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResourceFormState } from "@/lib/admin/fields";
import { parseFormData } from "@/lib/admin/parse";
import { getResource } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";
import { dbErrorCode, describeDbError } from "@/lib/db-error";
import { listGaleria, readGaleriaFiles, removerArquivos, salvarGaleria } from "@/lib/galeria";
import { registrarErroDb } from "@/lib/log-erro";
import {
  readImageFile,
  removeImage,
  uploadImage,
  validateImageFile,
} from "@/lib/storage";

export async function salvarRegistro(
  slug: string,
  id: number | null,
  prev: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const resource = getResource(slug);
  const attempt = (prev?.attempt ?? 0) + 1;
  if (!resource) {
    return { error: "Cadastro inválido.", fieldErrors: {}, values: {}, attempt };
  }

  const { supabase, user } = await requireUser();
  const { data, errors, values } = parseFormData(resource.fields, formData);

  const imageField = resource.fields.find((field) => field.type === "image");
  const file = imageField ? readImageFile(formData, imageField.name) : null;
  if (imageField && file) {
    const imageError = validateImageFile(file);
    if (imageError) errors[imageField.name] = imageError;
  }
  if (resource.validate && Object.keys(errors).length === 0) {
    Object.assign(errors, resource.validate(data));
  }
  const galeria = resource.galeria ? readGaleriaFiles(formData) : { error: null, files: [] };
  if (galeria.error) errors.galeria = galeria.error;

  if (Object.keys(errors).length > 0) {
    return { error: "Verifique os campos destacados.", fieldErrors: errors, values, attempt };
  }

  let uploaded: string | null = null;
  let savedId: number;

  try {
    let payload = resource.prepare
      ? await resource.prepare({ supabase, user, data, isNew: id === null })
      : data;

    if (imageField && file) {
      uploaded = await uploadImage(supabase, resource.imageFolder ?? slug, file);
      payload = { ...payload, [imageField.name]: uploaded };
    }

    if (id !== null) {
      const { data: current, error: currentError } = await supabase
        .from(resource.table)
        .select("*")
        .eq(resource.idColumn, id)
        .maybeSingle();
      if (currentError || !current) throw new Error("Registro não encontrado.");

      const { error } = await supabase
        .from(resource.table)
        .update(payload)
        .eq(resource.idColumn, id);
      if (error) throw error;

      const previousImage = imageField ? current[imageField.name] : null;
      if (uploaded && typeof previousImage === "string" && previousImage !== uploaded) {
        await removeImage(supabase, previousImage);
      }
      savedId = id;
    } else {
      const { data: inserted, error } = await supabase
        .from(resource.table)
        .insert(payload)
        .select(resource.idColumn)
        .single();
      if (error) throw error;
      savedId = (inserted as unknown as Record<string, number>)[resource.idColumn];
    }

    if (resource.galeria) {
      await salvarGaleria(supabase, resource.galeria, savedId, formData, galeria.files);
    }
  } catch (error) {
    if (uploaded) await removeImage(supabase, uploaded);
    await registrarErroDb(`salvar ${resource.table}${id !== null ? ` #${id}` : ""}`, error, {
      tabela: resource.table,
      registroId: id,
    });
    return { error: describeDbError(error), fieldErrors: {}, values, attempt };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${slug}?ok=salvo`);
}

export async function excluirRegistro(slug: string, id: number) {
  const resource = getResource(slug);
  if (!resource) redirect("/admin");

  const { supabase } = await requireUser();
  const imageField = resource.fields.find((field) => field.type === "image");

  const [{ data: current }, imagens] = await Promise.all([
    supabase.from(resource.table).select("*").eq(resource.idColumn, id).maybeSingle(),
    resource.galeria ? listGaleria(resource.galeria, id, supabase) : Promise.resolve([]),
  ]);

  // .select() devolve as linhas apagadas: sem linha, nada foi excluído (ex.: RLS
  // barrou em silêncio). Antes isso era tratado como sucesso e o registro
  // "voltava" nas listas (itens 06 e 12 do relatório).
  const { data: apagados, error } = await supabase
    .from(resource.table)
    .delete()
    .eq(resource.idColumn, id)
    .select(resource.idColumn);

  if (error || !apagados?.length) {
    await registrarErroDb(
      `excluir ${resource.table} #${id}`,
      error ?? new Error("Nenhuma linha excluída (permissão ou registro inexistente)."),
      { tabela: resource.table, registroId: id },
    );
    const motivo = error && dbErrorCode(error) === "23503" ? "em-uso" : "falha";
    redirect(`/admin/${slug}/${id}?erro=${motivo}`);
  }

  const image = imageField && current ? current[imageField.name] : null;
  if (typeof image === "string") await removeImage(supabase, image);
  await removerArquivos(supabase, imagens);

  revalidatePath("/", "layout");
  redirect(`/admin/${slug}?ok=excluido`);
}
