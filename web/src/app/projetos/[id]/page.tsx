import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConteudoDetalhe, InfoLinha } from "@/components/conteudo-detalhe";
import { getProjeto } from "@/lib/conteudo";
import { projetoStatus, statusLabel } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { listGaleria } from "@/lib/galeria";
import { situacaoProjeto } from "@/lib/projetos";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projeto = await getProjeto(Number(id));
  return { title: projeto?.titulo ?? "Projeto" };
}

export default async function ProjetoPage({ params }: Props) {
  const { id } = await params;
  const projeto = await getProjeto(Number(id));
  if (!projeto) notFound();
  const galeria = await listGaleria("projeto", projeto.id_projeto);

  return (
    <ConteudoDetalhe
      categoria={statusLabel(projetoStatus, situacaoProjeto(projeto))}
      titulo={projeto.titulo}
      imagem={resolveImageUrl(projeto.imagem)}
      info={
        <div className="space-y-1">
          <InfoLinha label="Objetivo">{projeto.objetivo}</InfoLinha>
          <InfoLinha label="Início">{formatDate(projeto.data_inicio)}</InfoLinha>
          <InfoLinha label="Término">
            {formatDate(projeto.data_fim) ||
              (situacaoProjeto(projeto) === "em_andamento" ? "Sem data de término (em andamento)" : "")}
          </InfoLinha>
        </div>
      }
      galeria={galeria}
      fonte={projeto.fonte}
      voltar={{ href: "/projetos", label: "Voltar para projetos" }}
    >
      {projeto.descricao}
    </ConteudoDetalhe>
  );
}
