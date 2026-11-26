import type { Metadata } from "next";
import { BuscaForm } from "@/components/busca-form";
import { Hero } from "@/components/hero";
import { Listagem, Vazio } from "@/components/listagem";
import { ProjetoCard } from "@/components/projeto-card";
import { CardGrid } from "@/components/site-card";
import { listProjetos } from "@/lib/conteudo";
import { projetoStatus, statusLabel } from "@/lib/database";
import { staticImage } from "@/lib/images";
import { contarSituacoes, situacaoProjeto } from "@/lib/projetos";
import { destaquesRotativos } from "@/lib/text";

export const metadata: Metadata = { title: "Projetos Terena" };

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; situacao?: string }>;
}) {
  const { q = "", situacao } = await searchParams;
  const busca = q.trim();
  const filtro = projetoStatus.find((status) => status.value === situacao)?.value;

  const encontrados = await listProjetos(busca);
  const contagem = contarSituacoes(encontrados);
  const projetos = filtro
    ? encontrados.filter((projeto) => situacaoProjeto(projeto) === filtro)
    : encontrados;
  const filtrando = Boolean(busca || filtro);
  const destaques = filtrando ? [] : destaquesRotativos(encontrados, 3);

  return (
    <>
      <Hero
        eyebrow="Iniciativas que transformam"
        title="Projetos Terena"
        description="Conheça iniciativas que fortalecem nossas aldeias, valorizam nossa cultura e promovem desenvolvimento sustentável."
        imageSrc={staticImage("projetos_hero")}
      />
      <Listagem
        destaquesTitulo="Projetos em destaque"
        destaques={
          destaques.length > 0 ? (
            <CardGrid>
              {destaques.map((projeto) => (
                <ProjetoCard key={projeto.id_projeto} projeto={projeto} />
              ))}
            </CardGrid>
          ) : undefined
        }
        titulo={filtrando ? "Resultado da consulta" : "Todos os projetos"}
        busca={
          <BuscaForm
            action="/projetos"
            q={busca}
            label="Buscar projeto"
            filtro={{
              param: "situacao",
              label: "Situação",
              value: filtro,
              allLabel: `Todas as situações (${encontrados.length})`,
              options: projetoStatus.map((status) => ({
                value: status.value,
                label: `${status.label} (${contagem[status.value]})`,
              })),
            }}
          />
        }
      >
        {projetos.length === 0 ? (
          <Vazio>
            {filtro
              ? `Nenhum projeto com a situação “${statusLabel(projetoStatus, filtro)}”.`
              : busca
                ? "Nenhum projeto encontrado. Tente outra palavra-chave."
                : "Nenhum projeto cadastrado ainda."}
          </Vazio>
        ) : (
          <CardGrid>
            {projetos.map((projeto) => (
              <ProjetoCard key={projeto.id_projeto} projeto={projeto} />
            ))}
          </CardGrid>
        )}
      </Listagem>
    </>
  );
}
