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
