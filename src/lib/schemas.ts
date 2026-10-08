import { z } from "zod";

export const noticiaStatuses = ["rascunho", "publicado"] as const;

export const noticiaStatusLabel = {
  rascunho: "Rascunho",
  publicado: "Publicado",
} as const;

export const noticiaSchema = z.object({
  titulo: z.string().trim().min(3, "Informe o título"),
  resumo: z
    .string()
    .trim()
    .min(10, "Escreva um resumo com pelo menos 10 caracteres"),
  conteudo: z
    .string()
    .trim()
    .min(10, "Escreva o conteúdo com pelo menos 10 caracteres"),
  data_publicacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data de publicação"),
  status: z.string().refine(
    (value): value is (typeof noticiaStatuses)[number] =>
      value === "rascunho" || value === "publicado",
    { message: "Selecione o status" },
  ),
});

export type NoticiaInput = z.infer<typeof noticiaSchema>;







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
  .max(120, "Use no máximo 120 caracteres");

const emailSchema = z.email("Informe um e-mail válido").max(254);

const mensagemSchema = z
  .string()
  .trim()
  .min(10, "Escreva uma mensagem com pelo menos 10 caracteres")
  .max(5000, "Use no máximo 5000 caracteres");

/** Formulário de contato geral do portal (/contato). */
export const contatoSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  telefone: z.string().trim().max(30, "Telefone muito longo").optional(),
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
