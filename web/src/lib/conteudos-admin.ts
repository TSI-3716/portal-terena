import { requireUser } from "@/lib/auth";
import type { Conteudo } from "@/lib/database";

/** Conteúdos (rascunhos e publicados) de uma seção, para o painel. */
export async function listConteudosAdmin(tipos: number[]) {
  if (tipos.length === 0) return [];
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("conteudo_aldeia")
    .select("*")
    .in("id_tipo", tipos)
    .order("data_publicacao", { ascending: false, nullsFirst: false })
    .order("id_conteudo", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Conteudo[];
}

export async function getConteudoAdmin(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("conteudo_aldeia")
    .select("*")
    .eq("id_conteudo", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Conteudo | null;
}
