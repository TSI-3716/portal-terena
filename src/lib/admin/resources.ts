import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { FieldDef } from "@/lib/admin/fields";
import { aldeiaHref } from "@/lib/conteudo";
import {
  eventoStatus,
  noticiaStatus,
  projetoStatus,
  statusLabel,
} from "@/lib/database";
import { formatCurrency, formatDate } from "@/lib/format";
import { getIdUsuario } from "@/lib/usuario";

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
};

const imagem = (description?: string): FieldDef => ({
  name: "imagem",
  label: "Imagem",
  type: "image",
  wide: true,
  description,
});

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
    slug: "noticias",
    table: "noticia",
    idColumn: "id_noticia",
    title: "Notícias",
    newLabel: "Nova notícia",
    editLabel: "Editar notícia",
    imageFolder: "noticias",
    listSelect: "id_noticia, titulo, status, data_publicacao, aldeia(nome)",
    orderBy: { column: "data_publicacao", ascending: false },
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, maxLength: 250, wide: true },
      { name: "resumo", label: "Resumo", type: "textarea", wide: true },
      { name: "conteudo", label: "Conteúdo", type: "textarea", wide: true },
      imagem("A foto é reduzida e convertida para WebP antes de ir para o Storage."),
      {
        name: "id_aldeia",
        label: "Aldeia",
        type: "reference",
        table: "aldeia",
        valueColumn: "id_aldeia",
        labelColumn: "nome",
        required: true,
      },
      {
        name: "id_evento",
        label: "Evento relacionado",
        type: "reference",
        table: "evento",
        valueColumn: "id_evento",
        labelColumn: "titulo",
        required: true,
      },
      {
        name: "data_publicacao",
        label: "Data de publicação",
        type: "datetime",
        description: "Se ficar vazia, a notícia publicada recebe a data de agora.",
      },
      { name: "status", label: "Status", type: "select", options: noticiaStatus, required: true },
    ],
    primary: (row) => str(row, "titulo") ?? "",
    secondary: (row) =>
      join(joined(row, "aldeia", "nome"), formatDate(str(row, "data_publicacao")) || undefined),
    badge: (row) => {
      const status = str(row, "status");
      return { label: statusLabel(noticiaStatus, status) ?? "Sem status", highlight: status === "publicado" };
    },
    publicHref: (row) =>
      str(row, "status") === "publicado" ? `/noticias/${str(row, "id_noticia")}` : undefined,
    prepare: async ({ supabase, user, data, isNew }) => {
      const next = { ...data };
      if (isNew) next.id_usuario = await getIdUsuario(supabase, user);
      if (next.status === "publicado" && !next.data_publicacao) {
        next.data_publicacao = new Date().toISOString().slice(0, 19);
      }
      return next;
    },
  },
  {
    slug: "aldeias",
    table: "aldeia",
    idColumn: "id_aldeia",
    title: "Aldeias",
    newLabel: "Nova aldeia",
    editLabel: "Editar aldeia",
    imageFolder: "aldeias",
    orderBy: { column: "nome", ascending: true },
    inUseMessage: "Esta aldeia tem notícias vinculadas. Exclua ou mova as notícias antes.",
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
      { name: "data_fundacao", label: "Data de fundação", type: "date" },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
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
    orderBy: { column: "data_evento", ascending: false },
    inUseMessage: "Este evento tem notícias vinculadas. Altere essas notícias antes de excluir.",
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, maxLength: 200, wide: true },
      { name: "data_evento", label: "Data", type: "date" },
      { name: "local", label: "Local", type: "text", maxLength: 200 },
      { name: "status", label: "Situação", type: "select", options: eventoStatus },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      imagem(),
    ],
    primary: (row) => str(row, "titulo") ?? "",
    secondary: (row) => join(formatDate(str(row, "data_evento")) || undefined, str(row, "local")),
    badge: (row) => {
      const label = statusLabel(eventoStatus, str(row, "status"));
      return label ? { label, highlight: str(row, "status") === "agendado" } : undefined;
    },
  },
  {
    slug: "projetos",
    table: "projeto",
    idColumn: "id_projeto",
    title: "Projetos",
    newLabel: "Novo projeto",
    editLabel: "Editar projeto",
    imageFolder: "projetos",
    orderBy: { column: "titulo", ascending: true },
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true, maxLength: 200, wide: true },
      { name: "status", label: "Situação", type: "select", options: projetoStatus },
      { name: "data_inicio", label: "Início", type: "date" },
      { name: "data_fim", label: "Término", type: "date" },
      { name: "objetivo", label: "Objetivo", type: "textarea", wide: true },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      imagem(),
    ],
    primary: (row) => str(row, "titulo") ?? "",
    secondary: (row) => str(row, "objetivo"),
    badge: (row) => {
      const label = statusLabel(projetoStatus, str(row, "status"));
      return label ? { label, highlight: str(row, "status") === "em_andamento" } : undefined;
    },
    publicHref: () => "/projetos",
  },
  {
    slug: "artesanato",
    table: "artesanato",
    idColumn: "id_artesanato",
    title: "Artesanato",
    newLabel: "Nova peça",
    editLabel: "Editar peça",
    imageFolder: "artesanato",
    orderBy: { column: "nome", ascending: true },
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true, maxLength: 200 },
      {
        name: "categoria",
        label: "Categoria",
        type: "text",
        maxLength: 100,
        placeholder: "Cestaria, Cerâmica, Bijuterias...",
      },
      { name: "preco", label: "Preço (R$)", type: "money", placeholder: "120,50" },
      {
        name: "disponivel",
        label: "Disponível para venda",
        type: "boolean",
        defaultValue: true,
      },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
      imagem(),
    ],
    primary: (row) => str(row, "nome") ?? "",
    secondary: (row) => {
      const preco = row.preco === null || row.preco === undefined ? undefined : formatCurrency(Number(row.preco));
      return join(str(row, "categoria"), preco);
    },
    badge: (row) =>
      row.disponivel ? { label: "Disponível", highlight: true } : { label: "Indisponível" },
    publicHref: () => "/feira",
  },
  {
    slug: "tipos-conteudo",
    table: "tipo_conteudo",
    idColumn: "id_tipo",
    title: "Tipos de conteúdo",
    newLabel: "Novo tipo",
    editLabel: "Editar tipo",
    orderBy: { column: "nome", ascending: true },
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true, maxLength: 100 },
      { name: "descricao", label: "Descrição", type: "textarea", wide: true },
    ],
    primary: (row) => str(row, "nome") ?? "",
    secondary: (row) => str(row, "descricao"),
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug) ?? null;
}

export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
