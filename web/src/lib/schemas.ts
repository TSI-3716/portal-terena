import { z } from "zod";

export const contatoSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.email("Informe um e-mail válido"),
  telefone: z.string().trim().optional(),
  assunto: z.string().min(1, "Selecione um assunto"),
  mensagem: z.string().trim().min(10, "Escreva uma mensagem com pelo menos 10 caracteres"),
  autorizacao: z.boolean().refine((value) => value === true, {
    message: "Autorize o uso dos seus dados para contato",
  }),
});

export type ContatoInput = z.infer<typeof contatoSchema>;

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
