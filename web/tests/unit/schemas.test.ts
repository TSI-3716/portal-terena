import { describe, expect, it } from "vitest";
import { toFormValue } from "@/lib/admin/fields";
import { artesanatoSchema, conteudoSchema, noticiaSchema } from "@/lib/schemas";

const noticiaBase = {
  titulo: "Notícia de teste",
  resumo: "Resumo com mais de dez caracteres",
  conteudo: "Conteúdo com mais de dez caracteres",
  data_publicacao: "2026-11-20",
  status: "publicado",
  fonte: "",
  id_aldeias: [] as string[],
};

describe("noticiaSchema (item 13)", () => {
  it("aceita notícia geral, sem aldeia", () => {
    expect(noticiaSchema.safeParse(noticiaBase).success).toBe(true);
  });
  it("aceita várias aldeias", () => {
    expect(noticiaSchema.safeParse({ ...noticiaBase, id_aldeias: ["1", "3"] }).success).toBe(true);
  });
  it("recusa id de aldeia inválido", () => {
    expect(noticiaSchema.safeParse({ ...noticiaBase, id_aldeias: ["abc"] }).success).toBe(false);
  });
  it("fonte tem limite de 500 caracteres", () => {
    expect(noticiaSchema.safeParse({ ...noticiaBase, fonte: "x".repeat(501) }).success).toBe(false);
  });
});

describe("artesanatoSchema (item 24)", () => {
  it("salva sem preço e disponibilidade", () => {
    const result = artesanatoSchema.safeParse({
      nome: "Cerâmica Terena",
      descricao: "Peça feita à mão na aldeia",
      categoria: "Cerâmica",
      fonte: "",
    });
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("preco");
    expect(result.data).not.toHaveProperty("disponivel");
  });
});

describe("conteudoSchema (itens 15 e 17)", () => {
  it("exige categoria e aceita aldeia vazia", () => {
    const base = {
      titulo: "Palavras em Terena",
      id_tipo: "9",
      resumo: "Resumo do conteúdo cultural",
      descricao: "Texto completo do conteúdo cultural",
      data_publicacao: "2026-11-26",
      status: "publicado",
      fonte: "Ancião da aldeia",
      id_aldeia: "",
      destaque: false,
    };
    expect(conteudoSchema.safeParse(base).success).toBe(true);
    expect(conteudoSchema.safeParse({ ...base, id_tipo: "" }).success).toBe(false);
  });
});

describe("toFormValue (item 07)", () => {
  it("timestamp do banco vira YYYY-MM-DD no campo date", () => {
    expect(toFormValue({ name: "d", label: "D", type: "date" }, "2026-11-20T00:00:00")).toBe("2026-11-20");
  });
});
