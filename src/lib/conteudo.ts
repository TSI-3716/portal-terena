import { cache } from "react";
import type {
  Aldeia,
  Artesanato,
  ContatoAldeia,
  Evento,
  Projeto,
} from "@/lib/database";
import { createClient } from "@/lib/supabase";

/**
 * Repositório de leitura do conteúdo público (aldeias, eventos, projetos,
 * artesanato). As páginas só falam com estas funções, nunca direto com o banco.
 */

export const INAMATY_NOME = "Inamaty Kaxé";
export const INAMATY_HREF = "/aldeias/inamaty-kaxe";

function fail(error: { message: string }): never {
  throw new Error(error.message);
}

/** Link da página de uma aldeia (a Inamaty Kaxé tem seção própria). */
export function aldeiaHref(aldeia: Pick<Aldeia, "id_aldeia" | "nome">) {
  return aldeia.nome.toLowerCase().startsWith("inamaty")
    ? INAMATY_HREF
    : `/aldeias/${aldeia.id_aldeia}`;
}

// Aldeias ---------------------------------------------------------------------

export async function listAldeias(localizacao?: string) {
  const supabase = await createClient();
  let query = supabase.from("aldeia").select("*").order("nome");
  if (localizacao) query = query.eq("localizacao", localizacao);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Aldeia[];
}

/** Municípios distintos cadastrados, para o mapa e o filtro. */
export async function listLocalizacoes() {
  const aldeias = await listAldeias();
  return [
    ...new Set(
      aldeias
        .map((aldeia) => aldeia.localizacao?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getAldeia(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("aldeia")
    .select("*")
    .eq("id_aldeia", id)
    .maybeSingle();

  if (error) fail(error);
  return data as Aldeia | null;
}

/** Registro da Inamaty Kaxé. `cache` evita consultas repetidas na mesma requisição. */
export const getInamaty = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("aldeia")
    .select("*")
    .ilike("nome", "inamaty%")
    .order("id_aldeia")
    .limit(1)
    .maybeSingle();

  if (error) fail(error);
  return data as Aldeia | null;
});

export async function listContatosAldeia(idAldeia: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contato_aldeia")
    .select("*")
    .eq("id_aldeia", idAldeia)
    .order("id_contato");

  if (error) fail(error);
  return (data ?? []) as ContatoAldeia[];
}

// Eventos ---------------------------------------------------------------------

export async function listEventos(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("evento")
    .select("*")
    .or("status.is.null,status.neq.cancelado")
    .order("data_evento", { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Evento[];
}

// Projetos --------------------------------------------------------------------

export async function listProjetos(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("projeto")
    .select("*")
    .order("data_inicio", { ascending: false, nullsFirst: false })
    .order("titulo");
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Projeto[];
}

// Artesanato ------------------------------------------------------------------

export async function listArtesanato(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("artesanato")
    .select("*")
    .eq("disponivel", true)
    .order("nome");
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Artesanato[];
}

/** "Sidrolândia - MS" -> "Sidrolândia" (rótulo curto para os pinos do mapa). */
export function municipio(localizacao: string) {
  return localizacao.split(" - ")[0]?.trim() || localizacao;
}
