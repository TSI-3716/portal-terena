import { requireUser } from "@/lib/auth";
import { contatoAssuntoLabel, contatoAssuntos } from "@/lib/schemas";
import { createClient } from "@/lib/supabase";

export const contatoOrigens = ["portal", "inamaty-kaxe"] as const;
export type ContatoOrigem = (typeof contatoOrigens)[number];

export const contatoOrigemLabel: Record<ContatoOrigem, string> = {
  portal: "Portal Terena",
  "inamaty-kaxe": "Inamaty Kaxé",
};

export type MensagemContato = {
  id_mensagem: string;
  origem: ContatoOrigem;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string;
  mensagem: string;
  autorizacao: boolean;
  lida: boolean;
  criado_em: string;
};

export type NovaMensagemContato = Pick<
  MensagemContato,
  "origem" | "nome" | "email" | "assunto" | "mensagem" | "autorizacao"
> & { telefone?: string | null };

const TABLE = "mensagem_contato";

/** Insere a mensagem como visitante (anon). A RLS só permite insert. */
export async function criarMensagemContato(input: NovaMensagemContato) {
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).insert({
    ...input,
    telefone: input.telefone?.trim() || null,
    lida: false,
  });

  if (error) throw new Error(error.message);
}

export async function listMensagensAdmin(filtro: "todas" | "nao-lidas" = "todas") {
  const { supabase } = await requireUser();
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("criado_em", { ascending: false });

  if (filtro === "nao-lidas") query = query.eq("lida", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as MensagemContato[];
}

export async function contarMensagensNaoLidas() {
  const { supabase } = await requireUser();
  const { count, error } = await supabase
    .from(TABLE)
    .select("id_mensagem", { count: "exact", head: true })
    .eq("lida", false);

  if (error) return 0;
  return count ?? 0;
}

export function assuntoLabel(assunto: string) {
  return (contatoAssuntos as readonly string[]).includes(assunto)
    ? contatoAssuntoLabel[assunto as (typeof contatoAssuntos)[number]]
    : assunto;
}
