import { cache } from "react";
import type { FieldDef } from "@/lib/admin/fields";
import { createClient } from "@/lib/supabase";

/** Linha única de public.configuracao (id = 1). */
export type Configuracao = {
  email_contato: string | null;
  telefone: string | null;
  whatsapp: string | null;
  endereco: string | null;
  cidade_uf: string | null;
  horario_atendimento: string | null;
  prazo_resposta: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  atualizado_em?: string | null;
};

/** Usado enquanto a tabela não existe ou se a leitura falhar: o rodapé nunca quebra. */
export const CONFIGURACAO_PADRAO: Configuracao = {
  email_contato: "contato@portalterena.org.br",
  telefone: null,
  whatsapp: null,
  endereco: null,
  cidade_uf: "Campo Grande - MS",
  horario_atendimento: "Segunda a sexta, das 8h às 17h",
  prazo_resposta: "Respondemos em até 48h úteis.",
  instagram_url: null,
  facebook_url: null,
  youtube_url: null,
};

export const CONFIGURACAO_CAMPOS: readonly FieldDef[] = [
  { name: "email_contato", label: "E-mail de contato", type: "email", maxLength: 254 },
  {
    name: "telefone",
    label: "Telefone",
    type: "tel",
    maxLength: 30,
    placeholder: "(67) 3333-4444",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    maxLength: 30,
    placeholder: "(67) 99999-9999",
    description: "Vira um link direto para conversa no WhatsApp.",
  },
  { name: "cidade_uf", label: "Cidade - UF", type: "text", maxLength: 120, placeholder: "Campo Grande - MS" },
  { name: "endereco", label: "Endereço", type: "text", maxLength: 255, wide: true },
  {
    name: "horario_atendimento",
    label: "Horário de atendimento",
    type: "text",
    maxLength: 150,
    placeholder: "Segunda a sexta, das 8h às 17h",
  },
  {
    name: "prazo_resposta",
    label: "Prazo de resposta",
    type: "text",
    maxLength: 150,
    placeholder: "Respondemos em até 48h úteis.",
  },
  { name: "instagram_url", label: "Instagram", type: "url", maxLength: 500, placeholder: "https://instagram.com/..." },
  { name: "facebook_url", label: "Facebook", type: "url", maxLength: 500, placeholder: "https://facebook.com/..." },
  { name: "youtube_url", label: "YouTube", type: "url", maxLength: 500, placeholder: "https://youtube.com/@..." },
];

/** Lê a configuração uma vez por requisição (rodapé e página de contato compartilham). */
export const getConfiguracao = cache(async (): Promise<Configuracao> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("configuracao")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return CONFIGURACAO_PADRAO;
    return { ...CONFIGURACAO_PADRAO, ...(data as Configuracao) };
  } catch {
    return CONFIGURACAO_PADRAO;
  }
});
