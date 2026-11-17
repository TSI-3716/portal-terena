import { requireUser } from "@/lib/auth";

export type LogSistema = {
  id: number;
  criado_em: string;
  tipo: string;
  nivel: string;
  origem: string;
  tabela: string | null;
  registro_id: string | null;
  usuario_id: string | null;
  usuario_email: string | null;
  mensagem: string | null;
  dados_antes: Record<string, unknown> | null;
  dados_depois: Record<string, unknown> | null;
  campos_alterados: string[] | null;
  detalhes: Record<string, unknown> | null;
  rota: string | null;
};

export const TIPOS_LOG = [
  { value: "insert", label: "Inclusão" },
  { value: "update", label: "Alteração" },
  { value: "delete", label: "Exclusão" },
  { value: "erro", label: "Erro" },
  { value: "login", label: "Login" },
  { value: "login_falha", label: "Falha de login" },
  { value: "logout", label: "Logout" },
] as const;

export const NIVEIS_LOG = [
  { value: "info", label: "Informação" },
  { value: "aviso", label: "Aviso" },
  { value: "erro", label: "Erro" },
] as const;

export const TABELAS_LOG = [
  { value: "aldeia", label: "Aldeias" },
  { value: "artesanato", label: "Artesanato" },
  { value: "configuracao", label: "Configurações" },
  { value: "contato_aldeia", label: "Contatos das aldeias" },
  { value: "conteudo_aldeia", label: "Conteúdos das aldeias" },
  { value: "evento", label: "Eventos" },
  { value: "mensagem_contato", label: "Mensagens de contato" },
  { value: "noticia", label: "Notícias" },
  { value: "projeto", label: "Projetos" },
  { value: "projeto_aldeia", label: "Projetos x aldeias" },
  { value: "tipo_conteudo", label: "Tipos de conteúdo" },
] as const;

/** Valor do filtro de usuário para ações sem login (visitante ou SQL Editor). */
export const SEM_USUARIO = "sem-usuario";

/** O portal opera no horário de Mato Grosso do Sul (UTC-4, sem horário de verão). */
export const FUSO = "America/Campo_Grande";
const OFFSET = "-04:00";

export type FiltrosLog = {
  de?: string;
  ate?: string;
  tipo?: string;
  nivel?: string;
  usuario?: string;
  tabela?: string;
  registro?: string;
  pagina: number;
};

const DATA = /^\d{4}-\d{2}-\d{2}$/;
const valido = (lista: readonly { value: string }[], v?: string) =>
  v && lista.some((item) => item.value === v) ? v : undefined;

/** Lê e valida os parâmetros da URL. Valor desconhecido vira "sem filtro". */
export function parseFiltros(sp: Record<string, string | string[] | undefined>): FiltrosLog {
  const get = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };
  const pagina = Number(get("pagina") ?? "1");
  const usuario = get("usuario");
  return {
    de: DATA.test(get("de") ?? "") ? get("de") : undefined,
    ate: DATA.test(get("ate") ?? "") ? get("ate") : undefined,
    tipo: valido(TIPOS_LOG, get("tipo")),
    nivel: valido(NIVEIS_LOG, get("nivel")),
    tabela: valido(TABELAS_LOG, get("tabela")),
    usuario: usuario && usuario.length <= 254 ? usuario : undefined,
    registro: /^[\w-]{1,100}$/.test(get("registro") ?? "") ? get("registro") : undefined,
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

/** Monta a query string mantendo os filtros (para paginação e exportação). */
export function filtrosQuery(f: FiltrosLog, extra: Partial<Record<keyof FiltrosLog, string | number>> = {}) {
  const params = new URLSearchParams();
  const all = { ...f, ...extra };
  for (const [k, v] of Object.entries(all)) {
    if (v === undefined || v === "" || (k === "pagina" && Number(v) === 1)) continue;
    params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

export const POR_PAGINA = 50;

export async function listLogs(f: FiltrosLog, limite = POR_PAGINA) {
  const { supabase } = await requireUser();
  const inicio = (f.pagina - 1) * limite;
  let query = supabase.from("log_sistema").select("*", { count: "exact" });

  if (f.de) query = query.gte("criado_em", `${f.de}T00:00:00${OFFSET}`);
  if (f.ate) query = query.lte("criado_em", `${f.ate}T23:59:59.999${OFFSET}`);
  if (f.tipo) query = query.eq("tipo", f.tipo);
  if (f.nivel) query = query.eq("nivel", f.nivel);
  if (f.tabela) query = query.eq("tabela", f.tabela);
  if (f.registro) query = query.eq("registro_id", f.registro);
  if (f.usuario === SEM_USUARIO) query = query.is("usuario_email", null);
  else if (f.usuario) query = query.eq("usuario_email", f.usuario);

  const { data, error, count } = await query
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .range(inicio, inicio + limite - 1);
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as LogSistema[], total: count ?? 0 };
}

export async function getLog(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("log_sistema").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as LogSistema | null;
}

export async function listUsuariosLog() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("listar_usuarios_log");
  if (error) return [];
  return ((data ?? []) as { usuario_email: string }[]).map((r) => r.usuario_email);
}

const rotulo = (lista: readonly { value: string; label: string }[], v: string | null) =>
  (v && lista.find((item) => item.value === v)?.label) ?? v ?? "";

export const tipoLabel = (v: string) => rotulo(TIPOS_LOG, v);
export const nivelLabel = (v: string) => rotulo(NIVEIS_LOG, v);
export const tabelaLabel = (v: string | null) => rotulo(TABELAS_LOG, v);

/** Descrição curta do evento para a listagem. */
export function resumoLog(log: LogSistema) {
  if (log.origem === "banco") {
    const alvo = `${tabelaLabel(log.tabela)}${log.registro_id ? ` #${log.registro_id}` : ""}`;
    const nome =
      (log.dados_depois ?? log.dados_antes)?.nome ??
      (log.dados_depois ?? log.dados_antes)?.titulo;
    const campos = log.campos_alterados?.filter((c) => !["atualizado_em", "atualizado_por"].includes(c));
    return [
      alvo,
      typeof nome === "string" && nome !== "[oculto]" ? `“${nome}”` : null,
      log.tipo === "update" && campos?.length ? `campos: ${campos.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return log.mensagem ?? "";
}

export const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium",
  timeZone: FUSO,
});
