import { cache } from "react";
import type {
  Aldeia,
  Artesanato,
  ContatoAldeia,
  Conteudo,
  Evento,
  Projeto,
  TipoConteudo,
} from "@/lib/database";
import { createClient } from "@/lib/supabase";
import { termoBusca } from "@/lib/text";

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

export async function listEventos(opts: { limit?: number; busca?: string; status?: string } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("evento")
    .select("*")
    .or("status.is.null,status.neq.cancelado")
    .order("data_evento", { ascending: false, nullsFirst: false })
    .order("id_evento", { ascending: false });
  if (opts.status) query = query.eq("status", opts.status);
  const term = termoBusca(opts.busca);
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,descricao.ilike.%${term}%,local.ilike.%${term}%`);
  }
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Evento[];
}

export async function getEvento(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evento")
    .select("*")
    .eq("id_evento", id)
    .maybeSingle();
  if (error) fail(error);
  return data as Evento | null;
}

// Projetos --------------------------------------------------------------------

/** Todos os projetos; a situação é calculada em lib/projetos (item 18). */
export async function listProjetos(busca?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("projeto")
    .select("*")
    .order("data_inicio", { ascending: false, nullsFirst: false })
    .order("titulo");
  const term = termoBusca(busca);
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,descricao.ilike.%${term}%,objetivo.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Projeto[];
}

export async function getProjeto(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projeto")
    .select("*")
    .eq("id_projeto", id)
    .maybeSingle();
  if (error) fail(error);
  return data as Projeto | null;
}

// Artesanato ------------------------------------------------------------------

export async function listArtesanato(opts: { limit?: number; busca?: string; categoria?: string } = {}) {
  const supabase = await createClient();
  let query = supabase.from("artesanato").select("*").order("nome");
  if (opts.categoria) query = query.eq("categoria", opts.categoria);
  const term = termoBusca(opts.busca);
  if (term) {
    query = query.or(`nome.ilike.%${term}%,descricao.ilike.%${term}%,categoria.ilike.%${term}%`);
  }
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Artesanato[];
}

export async function getArtesanato(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artesanato")
    .select("*")
    .eq("id_artesanato", id)
    .maybeSingle();
  if (error) fail(error);
  return data as Artesanato | null;
}

// Cultura e Juventude -----------------------------------------------------------

export type Secao = {
  raiz: TipoConteudo;
  /** Subcategorias (Cultura: Memória Viva, História...). Vazio na Juventude. */
  categorias: TipoConteudo[];
};

/** Tipo de conteúdo raiz pelo slug ("cultura", "juventude") e suas subcategorias. */
export const getSecao = cache(async (slug: string): Promise<Secao | null> => {
  const supabase = await createClient();
  const { data: raiz, error } = await supabase
    .from("tipo_conteudo")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail(error);
  if (!raiz) return null;

  const { data: filhos, error: filhosError } = await supabase
    .from("tipo_conteudo")
    .select("*")
    .eq("id_tipo_pai", raiz.id_tipo)
    .order("ordem")
    .order("nome");
  if (filhosError) fail(filhosError);

  return { raiz: raiz as TipoConteudo, categorias: (filhos ?? []) as TipoConteudo[] };
});

export function tiposDaSecao(secao: Secao) {
  return [secao.raiz.id_tipo, ...secao.categorias.map((tipo) => tipo.id_tipo)];
}

export async function listConteudos(opts: {
  tipos: number[];
  busca?: string;
  limit?: number;
}) {
  if (opts.tipos.length === 0) return [];
  const supabase = await createClient();
  let query = supabase
    .from("conteudo_aldeia")
    .select("*")
    .in("id_tipo", opts.tipos)
    .eq("status", "publicado")
    .order("destaque", { ascending: false })
    .order("data_publicacao", { ascending: false, nullsFirst: false })
    .order("id_conteudo", { ascending: false });
  const term = termoBusca(opts.busca);
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,resumo.ilike.%${term}%,descricao.ilike.%${term}%`);
  }
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) fail(error);
  return (data ?? []) as Conteudo[];
}

export async function getConteudo(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_aldeia")
    .select("*")
    .eq("id_conteudo", id)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) fail(error);
  return data as Conteudo | null;
}

/** "Sidrolândia - MS" -> "Sidrolândia" (rótulo curto para os pinos do mapa). */
export function municipio(localizacao: string) {
  return localizacao.split(" - ")[0]?.trim() || localizacao;
}
