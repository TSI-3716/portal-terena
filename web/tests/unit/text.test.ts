import { describe, expect, it } from "vitest";
import { destaquesRotativos, fonteHref, resumir, termoBusca } from "@/lib/text";

describe("resumir (itens 05 e 11)", () => {
  it("mantém texto curto sem alteração", () => {
    expect(resumir("Encontro de jovens.")).toBe("Encontro de jovens.");
  });

  it("corta no fim de palavra, com reticências, sem passar do limite", () => {
    const texto = "palavra ".repeat(60);
    const resultado = resumir(texto, 50);
    expect(resultado.endsWith("…")).toBe(true);
    expect(resultado.length).toBeLessThanOrEqual(51);
    expect(resultado).not.toMatch(/\s…$/);
  });

  it("junta quebras de linha e espaços repetidos", () => {
    expect(resumir("linha 1\n\n  linha 2")).toBe("linha 1 linha 2");
  });

  it("aceita nulo", () => {
    expect(resumir(null)).toBe("");
  });
});

describe("termoBusca", () => {
  it("remove caracteres que quebram o filtro do PostgREST", () => {
    expect(termoBusca("terena, (aldeia) 100%")).toBe("terena aldeia 100");
  });
});

describe("fonteHref (item 08)", () => {
  it("transforma URL http/https em link", () => {
    expect(fonteHref("https://acritica.net/politica/x")).toBe("https://acritica.net/politica/x");
  });
  it("texto livre e javascript: não viram link", () => {
    expect(fonteHref("Entrevista com o cacique")).toBeNull();
    expect(fonteHref("javascript:alert(1)")).toBeNull();
  });
});

describe("destaquesRotativos (itens 20, 22, 23)", () => {
  const itens = ["a", "b", "c", "d", "e"];

  it("devolve tudo quando há poucos itens", () => {
    expect(destaquesRotativos(["a", "b"], 3)).toEqual(["a", "b"]);
  });

  it("é estável no mesmo dia e muda no dia seguinte", () => {
    const hoje = new Date("2026-11-26T15:00:00Z");
    const maisTarde = new Date("2026-11-26T20:00:00Z");
    const amanha = new Date("2026-11-27T15:00:00Z");
    expect(destaquesRotativos(itens, 3, hoje)).toEqual(destaquesRotativos(itens, 3, maisTarde));
    expect(destaquesRotativos(itens, 3, hoje)).not.toEqual(destaquesRotativos(itens, 3, amanha));
  });

  it("não repete itens", () => {
    const escolhidos = destaquesRotativos(itens, 3, new Date("2026-11-26T12:00:00Z"));
    expect(new Set(escolhidos).size).toBe(3);
  });
});
