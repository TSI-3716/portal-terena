import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConteudoDetalhe, InfoLinha } from "@/components/conteudo-detalhe";
import { getArtesanato } from "@/lib/conteudo";
import { listGaleria } from "@/lib/galeria";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const peca = await getArtesanato(Number(id));
  return { title: peca?.nome ?? "Artesanato" };
}

export default async function ArtesanatoDetalhePage({ params }: Props) {
  const { id } = await params;
  const peca = await getArtesanato(Number(id));
  if (!peca) notFound();
  const galeria = await listGaleria("artesanato", peca.id_artesanato);

  return (
    <ConteudoDetalhe
      categoria={peca.categoria ?? "Artesanato"}
      titulo={peca.nome}
      imagem={resolveImageUrl(peca.imagem)}
      info={
        <div className="space-y-1">
          <InfoLinha label="Categoria">{peca.categoria}</InfoLinha>
          <p>
            Quer saber mais sobre esta peça? Fale com a gente pela{" "}
            <Link href="/contato" className="text-primary underline underline-offset-4">
              página de contato
            </Link>
            .
          </p>
        </div>
      }
      galeria={galeria}
      fonte={peca.fonte}
      voltar={{ href: "/artesanato", label: "Voltar para artesanato" }}
    >
      {peca.descricao}
    </ConteudoDetalhe>
  );
}
