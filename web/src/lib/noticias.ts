import { z } from "zod";
import { requireUser } from "@/lib/auth";
import type { NoticiaInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase";
import { termoBusca } from "@/lib/text";

export const NOTICIA_IMAGE_FOLDER = "noticias";

/** A tabela atual usa id inteiro. Uma migration antiga usava uuid. */
export function isNoticiaId(id: string) {
  return z.uuid().safeParse(id).success || /^[1-9]\d*$/.test(id);
}

export type AldeiaResumo = { id_aldeia: number; nome: string };

export type Noticia = Omit<NoticiaInput, "id_aldeias" | "fonte"> & {
  id_noticia: string;
  imagem: string | null;
  fonte: string | null;
  /** Aldeias relacionadas (zero, uma ou várias). */
  aldeias: AldeiaResumo[];
  criado_em?: string;
  atualizado_em?: string;
};

export type NoticiaResumo = Omit<Noticia, "conteudo">;

const aldeiasJoin = "noticia_aldeia(aldeia(id_aldeia, nome))";
const listColumns = `id_noticia, titulo, resumo, imagem, data_publicacao, status, fonte, ${aldeiasJoin}`;

type Raw = Record<string, unknown> & {
  noticia_aldeia?: { aldeia: AldeiaResumo | AldeiaResumo[] | null }[] | null;
};

/** Achata o join noticia_aldeia -> aldeia e normaliza a data para YYYY-MM-DD. */
function normalize<T extends NoticiaResumo>(row: Raw): T {
  const { noticia_aldeia, ...rest } = row;
  const aldeias = (noticia_aldeia ?? [])
    .flatMap((link) => (Array.isArray(link.aldeia) ? link.aldeia : link.aldeia ? [link.aldeia] : []))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const data = typeof rest.data_publicacao === "string" ? rest.data_publicacao.slice(0, 10) : "";
  return { ...rest, data_publicacao: data, aldeias } as unknown as T;
}

export async function listNoticiasPublicas(
  busca = "",
  limit?: number,
  idAldeia?: number,
) {
  const supabase = await createClient();
  const columns = idAldeia
    ? `${listColumns}, filtro:noticia_aldeia!inner(id_aldeia)`
    : listColumns;
  let query = supabase
    .from("noticia")
    .select(columns)
    .eq("status", "publicado")
    .order("data_publicacao", { ascending: false, nullsFirst: false })
    .order("id_noticia", { ascending: false });

  if (idAldeia) query = query.eq("filtro.id_aldeia", idAldeia);

  const term = termoBusca(busca);
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,resumo.ilike.%${term}%,conteudo.ilike.%${term}%`);
  }
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Raw[]).map((row) => {
    delete row.filtro;
    return normalize<NoticiaResumo>(row);
  });
}

export async function getNoticiaPublica(id: string) {
  if (!isNoticiaId(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticia")
    .select(`*, ${aldeiasJoin}`)
    .eq("id_noticia", id)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalize<Noticia>(data as Raw) : null;
}

export async function listNoticiasAdmin() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("noticia")
    .select(listColumns)
    .order("data_publicacao", { ascending: false, nullsFirst: false })
    .order("id_noticia", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Raw[]).map((row) => normalize<NoticiaResumo>(row));
}

export async function getNoticiaAdmin(id: string) {
  if (!isNoticiaId(id)) return null;

  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("noticia")
    .select(`*, ${aldeiasJoin}`)
    .eq("id_noticia", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalize<Noticia>(data as Raw) : null;
}
