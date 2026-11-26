import { describe, expect, it } from "vitest";
import { contarSituacoes, situacaoProjeto, validarProjeto } from "@/lib/projetos";

const HOJE = "2026-11-26";

describe("situacaoProjeto (item 18)", () => {
  it("sem data final é em andamento, mesmo marcado como concluído", () => {
    expect(situacaoProjeto({ status: "concluido", data_fim: null }, HOJE)).toBe("em_andamento");
    expect(situacaoProjeto({ status: null, data_fim: null }, HOJE)).toBe("em_andamento");
  });

  it("concluído quando a data final já passou", () => {
    expect(situacaoProjeto({ status: "concluido", data_fim: "2026-01-10" }, HOJE)).toBe("concluido");
    expect(situacaoProjeto({ status: "em_andamento", data_fim: HOJE }, HOJE)).toBe("concluido");
  });

  it("término no futuro continua em andamento", () => {
    expect(situacaoProjeto({ status: "concluido", data_fim: "2027-01-01" }, HOJE)).toBe("em_andamento");
  });

  it("planejado segue a regra existente", () => {
    expect(situacaoProjeto({ status: "planejado", data_fim: null }, HOJE)).toBe("planejado");
  });

  it("contagem por situação bate com o filtro", () => {
    const total = contarSituacoes(
      [
        { status: "concluido", data_fim: null },
        { status: "concluido", data_fim: "2025-12-31" },
        { status: "planejado", data_fim: null },
      ],
      HOJE,
    );
    expect(total).toEqual({ em_andamento: 1, concluido: 1, planejado: 1 });
  });
});

describe("validarProjeto", () => {
  it("concluído exige data de término", () => {
    expect(validarProjeto({ status: "concluido", data_fim: null })).toHaveProperty("data_fim");
  });
  it("término antes do início é recusado", () => {
    expect(
      validarProjeto({ status: "em_andamento", data_inicio: "2026-05-01", data_fim: "2026-01-01" }),
    ).toHaveProperty("data_fim");
  });
  it("aceita projeto em andamento sem término", () => {
    expect(validarProjeto({ status: "em_andamento", data_inicio: "2026-05-01", data_fim: null })).toEqual({});
  });
});
