import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * A tabela public.usuario não faz parte do esquema enviado; a ligação com o
 * login do Supabase Auth é feita pelo e-mail. Se a coluna tiver outro nome,
 * ajuste aqui.
 */
const USUARIO_TABLE = "usuario";
const USUARIO_EMAIL_COLUMN = "email";

export class UsuarioNaoVinculadoError extends Error {
  constructor(email: string | undefined) {
    super(
      `O login ${email ?? ""} não tem cadastro na tabela "usuario". ` +
        "Cadastre um usuário com o mesmo e-mail para publicar notícias.",
    );
    this.name = "UsuarioNaoVinculadoError";
  }
}

export async function getIdUsuario(supabase: SupabaseClient, user: User) {
  if (!user.email) throw new UsuarioNaoVinculadoError(undefined);

  const { data, error } = await supabase
    .from(USUARIO_TABLE)
    .select("id_usuario")
    .ilike(USUARIO_EMAIL_COLUMN, escapeLike(user.email))
    .limit(1)
    .maybeSingle();

  if (error || !data) throw new UsuarioNaoVinculadoError(user.email);
  return Number(data.id_usuario);
}

/** Escapa curingas do LIKE para comparar o e-mail literalmente (sem diferenciar maiúsculas). */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
