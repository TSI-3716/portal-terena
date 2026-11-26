import { SiteCard } from "@/components/site-card";
import { type Projeto, projetoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { situacaoProjeto } from "@/lib/projetos";
import { resolveImageUrl } from "@/lib/storage";

export function ProjetoCard({ projeto }: { projeto: Projeto }) {
  const inicio = formatDate(projeto.data_inicio);
  const fim = formatDate(projeto.data_fim);

  return (
    <SiteCard
      search={`${projeto.titulo} ${projeto.descricao ?? ""} ${projeto.objetivo ?? ""}`}
      meta={statusLabel(projetoStatus, situacaoProjeto(projeto))?.toUpperCase()}
      title={projeto.titulo}
      description={projeto.descricao || projeto.objetivo}
      href={`/projetos/${projeto.id_projeto}`}
      imageSrc={resolveImageUrl(projeto.imagem)}
      imageAlt={projeto.titulo}
      details={
        inicio || fim ? (
          <p>
            {inicio ? <>Início: {inicio}</> : null}
            {inicio && fim ? " · " : null}
            {fim ? <>Término: {fim}</> : null}
          </p>
        ) : undefined
      }
    />
  );
}
