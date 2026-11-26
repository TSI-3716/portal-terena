import { z } from "zod";
import { EMAIL_REGEX, MENSAGENS, NOME_REGEX, TELEFONE_REGEX } from "@/lib/validation";

export const contatoAssuntos = ["informacoes", "parcerias", "imprensa"] as const;

export const contatoAssuntoLabel: Record<(typeof contatoAssuntos)[number], string> = {
  informacoes: "Informações",
  parcerias: "Parcerias e Projetos",
  imprensa: "Imprensa",
};

const autorizacaoSchema = z.boolean().refine((value) => value === true, {
  message: "Autorize o uso dos seus dados para contato",
});

const nomeSchema = z
  .string()
  .trim()
  .min(3, "Informe seu nome completo")
  .max(120, "Use no máximo 120 caracteres")
  .regex(NOME_REGEX, MENSAGENS.nome);

const emailSchema = z
  .string()
  .trim()
  .max(254, "E-mail muito longo")
  .regex(EMAIL_REGEX, MENSAGENS.email);

/** Telefone opcional: vazio passa; preenchido precisa seguir o padrão brasileiro. */
const telefoneOpcionalSchema = z
  .string()
  .trim()
  .max(30, "Telefone muito longo")
  .refine((value) => value === "" || TELEFONE_REGEX.test(value), MENSAGENS.telefone)
  .optional();

const mensagemSchema = z
  .string()
  .trim()
  .min(10, "Escreva uma mensagem com pelo menos 10 caracteres")
  .max(5000, "Use no máximo 5000 caracteres");

/** Formulário de contato geral do portal (/contato). */
export const contatoSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  telefone: telefoneOpcionalSchema,
  assunto: z
    .string()
    .refine(
      (value): value is (typeof contatoAssuntos)[number] =>
        (contatoAssuntos as readonly string[]).includes(value),
      { message: "Selecione um assunto" },
    ),
  mensagem: mensagemSchema,
  autorizacao: autorizacaoSchema,
});

export type ContatoInput = z.infer<typeof contatoSchema>;

/** Formulário de contato da Aldeia Inamaty Kaxé (assunto livre, sem telefone). */
export const contatoAldeiaSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  assunto: z
    .string()
    .trim()
    .min(3, "Informe o assunto")
    .max(150, "Use no máximo 150 caracteres"),
  mensagem: mensagemSchema,
  autorizacao: autorizacaoSchema,
});

export type ContatoAldeiaInput = z.infer<typeof contatoAldeiaSchema>;

/** Converte os erros do Zod em { campo: primeira mensagem }. */
export function fieldErrorsFrom(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Erros visíveis: o campo que está sendo editado, ou todos depois de um envio. */
export function liveFieldErrors(
  all: Record<string, string>,
  touched: Record<string, boolean>,
  showAll: boolean,
) {
  if (showAll) return all;
  const visible: Record<string, string> = {};
  for (const [key, message] of Object.entries(all)) {
    if (touched[key]) visible[key] = message;
  }
  return visible;
}

export const noticiaStatuses = ["rascunho", "publicado"] as const;

export const noticiaStatusLabel = {
  rascunho: "Rascunho",
  publicado: "Publicado",
} as const;

const fonteSchema = z
  .string()
  .trim()
  .max(500, "Use no máximo 500 caracteres");

const idListaSchema = z.array(z.string().regex(/^[1-9]\d*$/, "Aldeia inválida"));

const dataSchema = (mensagem: string) =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, mensagem);

export const noticiaSchema = z.object({
  titulo: z.string().trim().min(3, "Informe o título").max(250, "Use no máximo 250 caracteres"),
  resumo: z
    .string()
    .trim()
    .min(10, "Escreva um resumo com pelo menos 10 caracteres"),
  conteudo: z
    .string()
    .trim()
    .min(10, "Escreva o conteúdo com pelo menos 10 caracteres"),
  data_publicacao: dataSchema("Informe a data de publicação"),
  status: z.string().refine(
    (value): value is (typeof noticiaStatuses)[number] =>
      value === "rascunho" || value === "publicado",
    { message: "Selecione o status" },
  ),
  fonte: fonteSchema,
  /** Zero, uma ou várias aldeias. Vazio = notícia geral do povo Terena. */
  id_aldeias: idListaSchema,
});

export type NoticiaInput = z.infer<typeof noticiaSchema>;

export const artesanatoSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome do produto"),
  descricao: z
    .string()
    .trim()
    .min(10, "Escreva uma descrição com pelo menos 10 caracteres"),
  categoria: z.string().trim().min(1, "Informe a categoria"),
  fonte: fonteSchema,
});

export type ArtesanatoInput = z.infer<typeof artesanatoSchema>;

/** Conteúdos de Cultura e Juventude (tabela conteudo_aldeia). */
export const conteudoSchema = z.object({
  titulo: z.string().trim().min(3, "Informe o título").max(200, "Use no máximo 200 caracteres"),
  id_tipo: z.string().regex(/^[1-9]\d*$/, "Selecione a categoria"),
  resumo: z
    .string()
    .trim()
    .min(10, "Escreva um resumo com pelo menos 10 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(10, "Escreva o conteúdo com pelo menos 10 caracteres"),
  data_publicacao: dataSchema("Informe a data de publicação"),
  status: z.string().refine(
    (value): value is (typeof noticiaStatuses)[number] =>
      value === "rascunho" || value === "publicado",
    { message: "Selecione o status" },
  ),
  fonte: fonteSchema,
  id_aldeia: z.string().refine((value) => value === "" || /^[1-9]\d*$/.test(value), {
    message: "Aldeia inválida",
  }),
  destaque: z.boolean(),
});

export type ConteudoInput = z.infer<typeof conteudoSchema>;
