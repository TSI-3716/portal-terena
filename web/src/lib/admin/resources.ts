import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { FieldDef } from "@/lib/admin/fields";
import { aldeiaHref } from "@/lib/conteudo";
import { eventoStatus, projetoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import type { EntidadeGaleria } from "@/lib/galeria";
import { situacaoProjeto, validarProjeto } from "@/lib/projetos";

export type Row = Record<string, unknown>;

export type PrepareContext = {
  supabase: SupabaseClient;
  user: User;
  data: Row;
  isNew: boolean;
};

/**
 * Descrição de um cadastro do painel. As telas genéricas em
 * app/admin/[recurso] montam listagem, formulário e gravação a partir daqui.
 */
export type ResourceDef = {
  slug: string;
  table: string;
  idColumn: string;
  title: string;
  newLabel: string;
  editLabel: string;
  fields: readonly FieldDef[];
  listSelect?: string;
  orderBy: { column: string; ascending?: boolean };
  primary: (row: Row) => string;
  secondary?: (row: Row) => string | undefined;
  badge?: (row: Row) => { label: string; highlight?: boolean } | undefined;
  publicHref?: (row: Row) => string | undefined;
  /** Pasta do bucket "assets" para as imagens enviadas. */
  imageFolder?: string;
  /** Ajustes finais antes de gravar (ex.: preencher o autor da notícia). */
  prepare?: (ctx: PrepareContext) => Promise<Row>;
  /** Mensagem quando a exclusão é barrada por chave estrangeira. */
  inUseMessage?: string;
  /** Regras entre campos, depois da validação de cada campo. */
  validate?: (data: Row) => Record<string, string>;
  /** Aceita várias imagens (galeria) além da imagem de capa. */
  galeria?: EntidadeGaleria;
};

const imagem = (description?: string): FieldDef => ({
  name: "imagem",
  label: "Imagem",
  type: "image",
  wide: true,
  description,
});

const fonte: FieldDef = {
  name: "fonte",
  label: "Fonte",
  type: "text",
  maxLength: 500,
  wide: true,
  placeholder: "https://... ou referência em texto",
  description: "Origem da informação: link ou referência (livro, entrevista, instituição).",
};

const str = (row: Row, key: string) => {
  const value = row[key];
  return value === null || value === undefined ? undefined : String(value);
};

const joined = (row: Row, relation: string, key: string) => {
  const value = row[relation];
  if (value && typeof value === "object" && key in value) {
    return String((value as Row)[key]);
  }
  return undefined;
};

const join = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(" · ") || undefined;

export const resources: readonly ResourceDef[] = [
  {
    slug: "aldeias",
    table: "aldeia",
    idColumn: "id_aldeia",
    title: "Aldeias",
    newLabel: "Nova aldeia",
    editLabel: "Editar aldeia",
    imageFolder: "aldeias",
    galeria: "aldeia",
    orderBy: { column: "nome", ascending: true },
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true, maxLength: 150 },
      {
        name: "localizacao",
        label: "Localização",
        type: "text",
        maxLength: 255,
        placeholder: "Sidrolândia - MS",
        description: "Use o padrão “Município - UF”: o valor aparece no mapa e no filtro.",
      },
      {
        name: "data_fundacao",
        label: "Data de fundação",
        type: "date",
        description: "Opcional: quando a aldeia foi fundada. A data de cadastro é gravada sozinha.",
      },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      fonte,
      imagem(),
    ],
    primary: (row) => str(row, "nome") ?? "",
    secondary: (row) => str(row, "localizacao"),
    publicHref: (row) =>
      aldeiaHref({ id_aldeia: Number(row.id_aldeia), nome: str(row, "nome") ?? "" }),
  },
  {
    slug: "contatos-aldeia",
    table: "contato_aldeia",
    idColumn: "id_contato",
    title: "Contatos das aldeias",
    newLabel: "Novo contato",
    editLabel: "Editar contato",
    listSelect: "*, aldeia(nome)",
    orderBy: { column: "id_aldeia", ascending: true },
    fields: [
      {
        name: "id_aldeia",
        label: "Aldeia",
        type: "reference",
        table: "aldeia",
        valueColumn: "id_aldeia",
        labelColumn: "nome",
        required: true,
      },
      { name: "telefone", label: "Telefone / WhatsApp", type: "tel", maxLength: 30 },
      { name: "email", label: "E-mail", type: "email", maxLength: 150 },
      { name: "endereco", label: "Endereço", type: "text", maxLength: 255 },
      {
        name: "horario_atendimento",
        label: "Horário de atendimento",
        type: "text",
        maxLength: 150,
        placeholder: "Segunda a sexta, das 8h às 17h",
      },
      { name: "observacao", label: "Observação", type: "textarea", wide: true },
    ],
    primary: (row) => joined(row, "aldeia", "nome") ?? "Aldeia",
    secondary: (row) => join(str(row, "telefone"), str(row, "email")),
  },
  {
    slug: "eventos",
    table: "evento",
    idColumn: "id_evento",
    title: "Eventos",
    newLabel: "Novo evento",
    editLabel: "Editar evento",
    imageFolder: "eventos",
    galeria: "evento",
    orderBy: { column: "data_evento", ascending: false },
    inUseMessage: "Este evento tem notícias vinculadas. Altere essas notícias antes de excluir.",
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, maxLength: 200, wide: true },
      { name: "data_evento", label: "Data", type: "date" },
      { name: "local", label: "Local", type: "text", maxLength: 200 },
      { name: "status", label: "Situação", type: "select", options: eventoStatus },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      fonte,
      imagem(),
    ],
    primary: (row) => str(row, "titulo") ?? "",
    secondary: (row) => join(formatDate(str(row, "data_evento")) || undefined, str(row, "local")),
    badge: (row) => {
      const label = statusLabel(eventoStatus, str(row, "status"));
      return label ? { label, highlight: str(row, "status") === "agendado" } : undefined;
    },
    publicHref: (row) => `/eventos/${str(row, "id_evento")}`,
  },
  {
    slug: "projetos",
    table: "projeto",
    idColumn: "id_projeto",
    title: "Projetos",
    newLabel: "Novo projeto",
    editLabel: "Editar projeto",
    imageFolder: "projetos",
    galeria: "projeto",
    orderBy: { column: "titulo", ascending: true },
    validate: validarProjeto,
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, maxLength: 200, wide: true },
      {
        name: "status",
        label: "Situação",
        type: "select",
        options: projetoStatus,
        description: "Sem data de término, o projeto aparece no portal como “Em andamento”.",
      },
      { name: "data_inicio", label: "Início", type: "date" },
      {
        name: "data_fim",
        label: "Término",
        type: "date",
        description: "Deixe vazio enquanto o projeto estiver em andamento.",
      },
      { name: "objetivo", label: "Objetivo", type: "textarea", wide: true },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      fonte,
      imagem(),
    ],
    primary: (row) => str(row, "titulo") ?? "",
    secondary: (row) => str(row, "objetivo"),
    badge: (row) => {
      const situacao = situacaoProjeto({
        status: str(row, "status") ?? null,
        data_fim: str(row, "data_fim") ?? null,
      });
      const label = statusLabel(projetoStatus, situacao);
      return label ? { label, highlight: situacao === "em_andamento" } : undefined;
    },
    publicHref: (row) => `/projetos/${str(row, "id_projeto")}`,
  },
  {
    slug: "tipos-conteudo",
    table: "tipo_conteudo",
    idColumn: "id_tipo",
    title: "Tipos de conteúdo",
    newLabel: "Novo tipo",
    editLabel: "Editar tipo",
    listSelect: "*, pai:tipo_conteudo!fk_tipo_conteudo_pai(nome)",
    orderBy: { column: "nome", ascending: true },
    inUseMessage:
      "Este tipo tem conteúdos ou subcategorias vinculados. Mova ou exclua esses itens antes.",
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true, maxLength: 100 },
      {
        name: "id_tipo_pai",
        label: "Subcategoria de",
        type: "reference",
        table: "tipo_conteudo",
        valueColumn: "id_tipo",
        labelColumn: "nome",
        description:
          "Ex.: escolha “Cultura” para criar uma nova categoria dentro de Cultura. Ela aparece no painel e no portal.",
      },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
    ],
    primary: (row) => str(row, "nome") ?? "",
    secondary: (row) =>
      join(
        joined(row, "pai", "nome") ? `Dentro de ${joined(row, "pai", "nome")}` : undefined,
        str(row, "descricao"),
      ),
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug) ?? null;
}

export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
