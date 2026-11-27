import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import {
  removeImage,
  resolveImageUrl,
  uploadImage,
  validateImageFile,
} from "@/lib/storage";

/** Cadastros que aceitam várias imagens (a coluna "imagem" segue como capa). */
export type EntidadeGaleria =
  | "noticia"
  | "aldeia"
  | "evento"
  | "projeto"
  | "artesanato"
  | "conteudo";

export const GALERIA_CAMPO = "galeria";
export const GALERIA_REMOVER = "galeria_remover";
export const GALERIA_MAX_ENVIO = 5;

export type ImagemGaleria = {
  id: number;
  caminho: string;
  legenda: string | null;
  url: string;
};

type Row = { id: number; caminho: string; legenda: string | null };

function toImagem(row: Row): ImagemGaleria {
  return { ...row, url: resolveImageUrl(row.caminho) ?? "" };
}

export async function listGaleria(
  entidade: EntidadeGaleria,
  idRegistro: string | number,
  client?: SupabaseClient,
) {
  const supabase = client ?? (await createClient());
  const { data, error } = await supabase
    .from("imagem_galeria")
    .select("id, caminho, legenda")
    .eq("entidade", entidade)
    .eq("id_registro", String(idRegistro))
    .order("ordem")
    .order("id");

  if (error) throw new Error(error.message);
  return ((data ?? []) as Row[]).map(toImagem);
}

/** Lê e valida os arquivos novos da galeria. Retorna erro ou a lista de arquivos. */
export function readGaleriaFiles(formData: FormData) {
  const files = formData
    .getAll(GALERIA_CAMPO)
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > GALERIA_MAX_ENVIO) {
    return { error: `Envie no máximo ${GALERIA_MAX_ENVIO} imagens por vez.`, files: [] };
  }
  for (const file of files) {
    const error = validateImageFile(file);
    if (error) return { error, files: [] };
  }
  return { error: null, files };
}

/**
 * Aplica as mudanças da galeria depois que o registro foi salvo:
 * remove as imagens marcadas e envia as novas.
 */
export async function salvarGaleria(
  supabase: SupabaseClient,
  entidade: EntidadeGaleria,
  idRegistro: string | number,
  formData: FormData,
  files: File[],
) {
  const id = String(idRegistro);
  const remover = formData
    .getAll(GALERIA_REMOVER)
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (remover.length > 0) {
    const { data, error } = await supabase
      .from("imagem_galeria")
      .delete()
      .eq("entidade", entidade)
      .eq("id_registro", id)
      .in("id", remover)
      .select("caminho");
    if (error) throw error;
    for (const row of (data ?? []) as { caminho: string }[]) {
      await removeImage(supabase, row.caminho);
    }
  }

  if (files.length === 0) return;

  const { data: ultima } = await supabase
    .from("imagem_galeria")
    .select("ordem")
    .eq("entidade", entidade)
    .eq("id_registro", id)
    .order("ordem", { ascending: false })
    .limit(1)
    .maybeSingle();
  let ordem = (ultima?.ordem ?? 0) + 1;

  const enviados: string[] = [];
  try {
    for (const file of files) {
      enviados.push(await uploadImage(supabase, `galeria-${entidade}`, file));
    }
    const { error } = await supabase.from("imagem_galeria").insert(
      enviados.map((caminho) => ({ entidade, id_registro: id, caminho, ordem: ordem++ })),
    );
    if (error) throw error;
  } catch (error) {
    for (const caminho of enviados) await removeImage(supabase, caminho);
    throw error;
  }
}

/** Remove do Storage os arquivos listados antes da exclusão do registro. */
export async function removerArquivos(supabase: SupabaseClient, imagens: ImagemGaleria[]) {
  for (const imagem of imagens) await removeImage(supabase, imagem.caminho);
}
