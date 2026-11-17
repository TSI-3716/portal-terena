import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase";

/** Eventos que o app registra. Inserções, alterações e exclusões vêm do trigger do banco. */
export type TipoLogApp = "erro" | "login" | "login_falha" | "logout";
export type NivelLog = "info" | "aviso" | "erro";

export type EventoLog = {
  tipo: TipoLogApp;
  nivel?: NivelLog;
  mensagem?: string;
  detalhes?: Record<string, unknown>;
  tabela?: string;
  registroId?: string | number | null;
  rota?: string;
};

async function rotaAtual() {
  try {
    const h = await headers();
    const ref = h.get("referer");
    return ref ? new URL(ref).pathname : (h.get("x-invoke-path") ?? undefined);
  } catch {
    return undefined;
  }
}

/**
 * Grava um evento em public.log_sistema pela função registrar_log().
 * Nunca lança erro: falha de log não pode derrubar a operação principal.
 * Passe `cliente` quando a sessão acabou de mudar na mesma requisição (login).
 */
export async function registrarLog(evento: EventoLog, cliente?: SupabaseClient) {
  try {
    const supabase = cliente ?? (await createClient());
    const { error } = await supabase.rpc("registrar_log", {
      p_tipo: evento.tipo,
      p_nivel: evento.nivel ?? (evento.tipo === "erro" ? "erro" : "info"),
      p_mensagem: evento.mensagem ?? null,
      p_detalhes: evento.detalhes ?? null,
      p_tabela: evento.tabela ?? null,
      p_registro_id: evento.registroId == null ? null : String(evento.registroId),
      p_rota: evento.rota ?? (await rotaAtual()) ?? null,
    });
    if (error) console.error("[portal-terena] falha ao gravar log", error.message);
  } catch (error) {
    console.error("[portal-terena] falha ao gravar log", error);
  }
}
