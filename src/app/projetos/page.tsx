import type { Metadata } from "next";
import { CircleCheck, Folder, LayoutGrid, Sprout } from "lucide-react";
import { FilterBar } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { ProjetoCard } from "@/components/projeto-card";
import { PageSection } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { UrlFilter } from "@/components/url-filter";
import { listProjetos } from "@/lib/conteudo";
import { projetoStatus, statusLabel } from "@/lib/database";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Projetos Terena" };

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ situacao?: string }>;
}) {
  const { situacao } = await searchParams;
  const filtro = projetoStatus.some((status) => status.value === situacao)
    ? situacao
    : undefined;
  const projetos = await listProjetos(filtro);

  return (
    <>
      <Hero
        eyebrow="Iniciativas que transformam"
        title="Projetos Terena"
        description="Conheça iniciativas que fortalecem nossas aldeias, valorizam nossa cultura e promovem desenvolvimento sustentável."
        imageSrc={staticImage("projetos_hero")}
      />
      <PageSection>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            href="/projetos#lista"
            icon={<LayoutGrid className="size-5" />}
            title="Todos os Projetos"
            description="Veja todos os projetos desenvolvidos nas aldeias."
          />
          <Tile
            href="/projetos?situacao=em_andamento#lista"
            icon={<Sprout className="size-5" />}
            title="Em Andamento"
            description="Acompanhe iniciativas que estão em execução."
          />
          <Tile
            href="/projetos?situacao=concluido#lista"
            icon={<CircleCheck className="size-5" />}
            title="Concluídos"
            description="Conheça projetos já realizados com sucesso."
          />
          <Tile
            href="/projetos?situacao=planejado#lista"
            icon={<Folder className="size-5" />}
            title="Planejados"
            description="Iniciativas que ainda vão começar."
          />
        </div>
      </PageSection>
      <PageSection muted>
        <div id="lista" className="scroll-mt-24">
          <FilterBar className="lg:grid-cols-4">
            <UrlFilter
              label="Situação"
              param="situacao"
              value={filtro}
              allLabel="Todas as situações"
              options={projetoStatus}
            />
          </FilterBar>
          {projetos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {filtro
                ? `Nenhum projeto com a situação “${statusLabel(projetoStatus, filtro)}”.`
                : "Nenhum projeto cadastrado ainda."}
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {projetos.map((projeto) => (
                <ProjetoCard key={projeto.id_projeto} projeto={projeto} />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </>
  );
}
