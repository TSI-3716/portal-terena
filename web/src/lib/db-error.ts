/**
 * Tradução e registro de erros do Supabase (PostgREST, Postgres e Storage).
 * O detalhe técnico vai para o log do servidor; a pessoa vê uma mensagem
 * curta com o código, que basta para o suporte localizar a causa.
 */

type ErrorLike = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  statusCode?: unknown;
};

/** Falha no upload para o Storage, preservando o erro original. */
export class StorageUploadError extends Error {
  constructor(public readonly original: unknown) {
    super("Falha ao enviar a imagem para o Storage.");
    this.name = "StorageUploadError";
  }
}

function asErrorLike(error: unknown): ErrorLike {
  return typeof error === "object" && error !== null ? (error as ErrorLike) : {};
}

export function dbErrorCode(error: unknown) {
  const code = asErrorLike(error).code;
  return typeof code === "string" && code ? code : undefined;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

/** Coluna citada em mensagens do Postgres como `column "nome"`. */
function columnFrom(message: string) {
  return /column "([^"]+)"/i.exec(message)?.[1] ?? /'([^']+)' column/i.exec(message)?.[1];
}

/** Registra o erro completo no log do servidor (sem dados do formulário). */
export function logDbError(context: string, error: unknown) {
  const original = error instanceof StorageUploadError ? error.original : error;
  const e = asErrorLike(original);
  console.error(`[portal-terena] ${context}`, {
    code: e.code,
    statusCode: e.statusCode,
    message: e.message ?? (original instanceof Error ? original.message : String(original)),
    details: e.details,
    hint: e.hint,
  });
}

/** Mensagem para o formulário, de acordo com a causa real. */
export function describeDbError(error: unknown, acao = "salvar") {
  if (error instanceof StorageUploadError) {
    const e = asErrorLike(error.original);
    const message = text(e.message);
    const status = String(e.statusCode ?? "");
    if (/bucket not found/i.test(message) || status === "404") {
      return "A imagem não foi enviada: o bucket “assets” não existe no Storage.";
    }
    if (status === "403" || /row-level security|unauthorized/i.test(message)) {
      return "A imagem não foi enviada: o Storage recusou o upload (permissão do bucket “assets”).";
    }
    if (status === "413" || /too large|maximum allowed size/i.test(message)) {
      return "A imagem é maior do que o limite do Storage. Escolha uma foto menor.";
    }
    return "A imagem não foi enviada para o Storage. Tente outra foto ou salve sem imagem.";
  }

  const e = asErrorLike(error);
  const code = dbErrorCode(error);
  const message = text(e.message);
  const coluna = columnFrom(message);

  switch (code) {
    case "42501":
      return `Sem permissão para ${acao} neste cadastro. As políticas de acesso (RLS) da tabela não liberam a operação para o usuário logado. (código 42501)`;
    case "23505":
      return "Já existe um registro com esses dados. Se o problema continuar, a numeração da tabela precisa ser ressincronizada. (código 23505)";
    case "23502":
      return `Campo obrigatório no banco ficou vazio${coluna ? `: ${coluna}` : ""}. (código 23502)`;
    case "23503":
      return "Um registro relacionado não existe mais ou ainda está em uso. Atualize a página e tente de novo. (código 23503)";
    case "23514":
      return "Algum valor não atende às regras da tabela. (código 23514)";
    case "22001":
      return `Um dos textos passou do tamanho aceito pelo banco${coluna ? ` (${coluna})` : ""}. (código 22001)`;
    case "22007":
    case "22008":
      return `Data em formato inválido. (código ${code})`;
    case "22P02":
      return `Valor em formato inválido para o banco. (código 22P02)`;
    case "PGRST204":
      return `O formulário enviou uma coluna que não existe na tabela${coluna ? `: ${coluna}` : ""}. (código PGRST204)`;
    case "PGRST205":
    case "42P01":
      return `A tabela deste cadastro não foi encontrada no banco. (código ${code})`;
  }

  if (/fetch failed|network|ECONN|ETIMEDOUT/i.test(message)) {
    return "Não foi possível falar com o banco de dados agora. Verifique a conexão e tente de novo.";
  }

  return `Não foi possível ${acao}. Tente novamente.${code ? ` (código ${code})` : ""}`;
}
