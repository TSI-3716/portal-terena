import { z } from "zod";
import { requireUser } from "@/lib/auth";
import type { NoticiaInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase";

export const NOTICIA_IMAGE_FOLDER = "noticias";

export type Noticia = NoticiaInput & {
  id_noticia: string;
  imagem: string | null;
};

const listColumns =
  "id_noticia, titulo, resumo, imagem, data_publicacao, status";

export async function listNoticiasPublicas(busca = "", limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("noticia")
    .select(listColumns)
    .eq("status", "publicado")
    .order("data_publicacao", { ascending: false });

  const term = busca.trim().replace(/[%_,.()]/g, "");
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,resumo.ilike.%${term}%`);
  }
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Omit<Noticia, "conteudo">[];
}

export async function getNoticiaPublica(id: string) {
  if (!z.uuid().safeParse(id).success) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
    .eq("id_noticia", id)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Noticia | null;
}

export async function listNoticiasAdmin() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("noticia")
    .select(listColumns)
    .order("data_publicacao", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Omit<Noticia, "conteudo">[];
}

export async function getNoticiaAdmin(id: string) {
  if (!z.uuid().safeParse(id).success) return null;

  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
    .eq("id_noticia", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Noticia | null;
}
