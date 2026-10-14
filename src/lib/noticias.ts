import type { Noticia } from "@/lib/database";
import { createClient } from "@/lib/supabase";

export type NoticiaResumo = Pick<
  Noticia,
  "id_noticia" | "titulo" | "resumo" | "imagem" | "data_publicacao" | "status" | "id_aldeia"
> & { aldeia: { nome: string } | null };

export type NoticiaCompleta = Noticia & {
  aldeia: { id_aldeia: number; nome: string } | null;
  evento: { id_evento: number; titulo: string } | null;
};

const listColumns =
  "id_noticia, titulo, resumo, imagem, data_publicacao, status, id_aldeia, aldeia(nome)";

export function parseNoticiaId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function listNoticiasPublicas({
  busca = "",
  limit,
  idAldeia,
}: { busca?: string; limit?: number; idAldeia?: number } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("noticia")
    .select(listColumns)
    .eq("status", "publicado")
    .order("data_publicacao", { ascending: false, nullsFirst: false });

  const term = busca.trim().replace(/[%_,.()]/g, "");
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,resumo.ilike.%${term}%`);
  }
  if (idAldeia) query = query.eq("id_aldeia", idAldeia);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NoticiaResumo[];
}

export async function getNoticiaPublica(rawId: string) {
  const id = parseNoticiaId(rawId);
  if (!id) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticia")
    .select("*, aldeia(id_aldeia, nome), evento(id_evento, titulo)")
    .eq("id_noticia", id)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as unknown as NoticiaCompleta | null;
}
