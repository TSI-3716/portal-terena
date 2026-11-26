"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getSecao, tiposDaSecao } from "@/lib/conteudo";
import { describeDbError } from "@/lib/db-error";
import { listGaleria, readGaleriaFiles, removerArquivos, salvarGaleria } from "@/lib/galeria";
import { registrarErroDb } from "@/lib/log-erro";
import { conteudoSchema } from "@/lib/schemas";
import { isSecaoSlug, secoes, type SecaoSlug } from "@/lib/secoes";
import { readImageFile, removeImage, uploadImage, validateImageFile } from "@/lib/storage";

export type ConteudoFormValues = {
  titulo: string;
  id_tipo: string;
  resumo: string;
  descricao: string;
  data_publicacao: string;
  status: string;
  fonte: string;
  id_aldeia: string;
  destaque: boolean;
};

export type ConteudoFormState = {
  error: string;
  values: ConteudoFormValues;
  attempt: number;
} | null;

function conteudoValues(formData: FormData): ConteudoFormValues {
  const text = (name: string) => String(formData.get(name) ?? "");
  return {
    titulo: text("titulo"),
    id_tipo: text("id_tipo"),
    resumo: text("resumo"),
    descricao: text("descricao"),
    data_publicacao: text("data_publicacao"),
    status: text("status"),
    fonte: text("fonte"),
    id_aldeia: text("id_aldeia"),
    destaque: formData.get("destaque") === "on",
  };
}

export async function salvarConteudo(
  secaoSlug: SecaoSlug,
  id: number | null,
  prev: ConteudoFormState,
  formData: FormData,
): Promise<ConteudoFormState> {
  const values = conteudoValues(formData);
  const attempt = (prev?.attempt ?? 0) + 1;
  const fail = (error: string) => ({ error, values, attempt });
  if (!isSecaoSlug(secaoSlug)) return fail("Seção inválida.");

  const { supabase } = await requireUser();
  const parsed = conteudoSchema.safeParse(values);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Verifique os campos.");
  }

  // A categoria precisa ser desta seção (evita gravar Cultura dentro de Juventude).
  const secao = await getSecao(secaoSlug);
  if (!secao) return fail(`O tipo de conteúdo “${secoes[secaoSlug].titulo}” não existe no banco.`);
  if (!tiposDaSecao(secao).includes(Number(parsed.data.id_tipo))) {
    return fail("Selecione a categoria");
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
    if (file) uploaded = await uploadImage(supabase, `conteudo-${secaoSlug}`, file);

    const payload = {
      titulo: parsed.data.titulo,
      id_tipo: Number(parsed.data.id_tipo),
      resumo: parsed.data.resumo,
      descricao: parsed.data.descricao,
      data_publicacao: parsed.data.data_publicacao,
      status: parsed.data.status,
      fonte: parsed.data.fonte || null,
      id_aldeia: parsed.data.id_aldeia ? Number(parsed.data.id_aldeia) : null,
      destaque: parsed.data.destaque,
      tipo: secoes[secaoSlug].titulo,
      ...(uploaded ? { imagem: uploaded } : {}),
    };

    let savedId: number;
    if (id) {
      const { data: current, error: currentError } = await supabase
        .from("conteudo_aldeia")
        .select("imagem")
        .eq("id_conteudo", id)
        .maybeSingle();
      if (currentError || !current) throw new Error("Conteúdo não encontrado.");

      const { error } = await supabase.from("conteudo_aldeia").update(payload).eq("id_conteudo", id);
      if (error) throw error;
      if (uploaded && current.imagem && current.imagem !== uploaded) {
        await removeImage(supabase, current.imagem);
      }
      savedId = id;
    } else {
      const { data, error } = await supabase
        .from("conteudo_aldeia")
        .insert(payload)
        .select("id_conteudo")
        .single();
      if (error) throw error;
      savedId = data.id_conteudo;
    }

    await salvarGaleria(supabase, "conteudo", savedId, formData, galeria.files);
  } catch (error) {
    if (uploaded) await removeImage(supabase, uploaded);
    await registrarErroDb(`salvar conteudo_aldeia${id ? ` #${id}` : ""}`, error, {
      tabela: "conteudo_aldeia",
      registroId: id,
    });
    return fail(describeDbError(error, "salvar o conteúdo"));
  }

  revalidatePath("/", "layout");
  redirect(`${secoes[secaoSlug].admin}?ok=salvo`);
}

export async function excluirConteudo(secaoSlug: SecaoSlug, id: number) {
  const destino = isSecaoSlug(secaoSlug) ? secoes[secaoSlug].admin : "/admin";
  const { supabase } = await requireUser();

  const [{ data }, imagens] = await Promise.all([
    supabase.from("conteudo_aldeia").select("imagem").eq("id_conteudo", id).maybeSingle(),
    listGaleria("conteudo", id, supabase),
  ]);

  const { data: apagados, error } = await supabase
    .from("conteudo_aldeia")
    .delete()
    .eq("id_conteudo", id)
    .select("id_conteudo");

  if (error || !apagados?.length) {
    await registrarErroDb(
      `excluir conteudo_aldeia #${id}`,
      error ?? new Error("Nenhuma linha excluída (permissão ou registro inexistente)."),
      { tabela: "conteudo_aldeia", registroId: id },
    );
    redirect(`${destino}?erro=excluir`);
  }

  if (data?.imagem) await removeImage(supabase, data.imagem);
  await removerArquivos(supabase, imagens);

  revalidatePath("/", "layout");
  redirect(`${destino}?ok=excluido`);
}
