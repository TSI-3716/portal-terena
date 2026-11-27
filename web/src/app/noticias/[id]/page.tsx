import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConteudoDetalhe } from "@/components/conteudo-detalhe";
import { aldeiaHref } from "@/lib/conteudo";
import { formatDate } from "@/lib/format";
import { listGaleria } from "@/lib/galeria";
import { getNoticiaPublica } from "@/lib/noticias";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  return { title: noticia?.titulo ?? "Notícia", description: noticia?.resumo };
}

export default async function NoticiaPage({ params }: Props) {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  if (!noticia) notFound();
  const galeria = await listGaleria("noticia", noticia.id_noticia);

  return (
    <ConteudoDetalhe
      categoria="Notícia"
      titulo={noticia.titulo}
      resumo={noticia.resumo}
      meta={
        <>
          {formatDate(noticia.data_publicacao)}
          {" · "}
          {noticia.aldeias.length > 0 ? (
            noticia.aldeias.map((aldeia, index) => (
              <span key={aldeia.id_aldeia}>
                {index > 0 ? ", " : null}
                <Link href={aldeiaHref(aldeia)} className="text-primary underline-offset-4 hover:underline">
                  {aldeia.nome}
                </Link>
              </span>
            ))
          ) : (
            "Povo Terena"
          )}
        </>
      }
      imagem={resolveImageUrl(noticia.imagem)}
      galeria={galeria}
      fonte={noticia.fonte}
      voltar={{ href: "/noticias", label: "Voltar para notícias" }}
    >
      {noticia.conteudo}
    </ConteudoDetalhe>
  );
}
