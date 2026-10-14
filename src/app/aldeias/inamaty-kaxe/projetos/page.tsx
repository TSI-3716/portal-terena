import type { Metadata } from "next";
import { ContentCard, Notice } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { listProjetos } from "@/lib/conteudo";
import { projetoStatus, statusLabel } from "@/lib/database";

export const metadata: Metadata = { title: "Projetos da Aldeia | Inamaty Kaxé" };

export default async function InamatyProjetosPage() {
  const projetos = await listProjetos();

  return (
    <>
      <PageHeading
        title="Projetos da Aldeia"
        description="Iniciativas que transformam o cotidiano da comunidade."
      />
      <PageSection contained={false} className="pt-4">
        {projetos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum projeto cadastrado ainda.
          </p>
        ) : (
          <div className="grid gap-4">
            {projetos.map((projeto) => {
              const situacao = statusLabel(projetoStatus, projeto.status);
              return (
                <div
                  key={projeto.id_projeto}
                  data-search={`${projeto.titulo} ${projeto.descricao ?? ""}`}
                >
                  <ContentCard title={projeto.titulo}>
                    {situacao ? <Badge variant="secondary">{situacao}</Badge> : null}
                    {projeto.descricao ? <p>{projeto.descricao}</p> : null}
                    {projeto.objetivo ? (
                      <p>
                        <strong className="text-primary">Objetivo:</strong>{" "}
                        {projeto.objetivo}
                      </p>
                    ) : null}
                  </ContentCard>
                </div>
              );
            })}
          </div>
        )}
        <Notice>
          Os projetos apresentados devem ser atualizados e validados pela
          comunidade antes da publicação definitiva.
        </Notice>
      </PageSection>
    </>
  );
}
