import { SiteCard } from "@/components/site-card";
import { type Projeto, projetoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { resolveImageUrl } from "@/lib/storage";

export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  const inicio = formatDate(projeto.data_inicio);
  const fim = formatDate(projeto.data_fim);
  const temDetalhes = projeto.objetivo || inicio || fim;

  return (
    <SiteCard
      search={`${projeto.titulo} ${projeto.descricao ?? ""} ${projeto.objetivo ?? ""}`}
      meta={statusLabel(projetoStatus, projeto.status)?.toUpperCase()}
      title={projeto.titulo}
      description={projeto.descricao ?? ""}
      imageSrc={resolveImageUrl(projeto.imagem)}
      imageAlt={projeto.titulo}
      hrefLabel="Ver detalhes"
      details={
        temDetalhes ? (
          <>
            {projeto.objetivo ? (
              <p>
                <strong className="text-primary">Objetivo:</strong> {projeto.objetivo}
              </p>
            ) : null}
            {inicio ? (
              <p>
                <strong className="text-primary">Início:</strong> {inicio}
              </p>
            ) : null}
            {fim ? (
              <p>
                <strong className="text-primary">Término:</strong> {fim}
              </p>
            ) : null}
          </>
        ) : undefined
      }
    />
  );
}
