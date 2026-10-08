import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { PageSection } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aldeiaHref } from "@/lib/conteudo";
import { formatDate } from "@/lib/format";
import { getNoticiaPublica } from "@/lib/noticias";
import { resolveImageUrl } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  return { title: noticia?.titulo ?? "Notícia" };
}

export default async function NoticiaPage({ params }: Props) {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  if (!noticia) notFound();

  return (
    <>
      <Hero
        eyebrow={formatDate(noticia.data_publicacao) || "Notícia"}
        title={noticia.titulo}
        description={noticia.resumo ?? ""}
        imageSrc={resolveImageUrl(noticia.imagem)}
        imageAlt={noticia.titulo}
      />
      <PageSection>
        {noticia.aldeia || noticia.evento ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {noticia.aldeia ? (
              <Badge variant="secondary" asChild>
                <Link href={aldeiaHref(noticia.aldeia)}>{noticia.aldeia.nome}</Link>
              </Badge>
            ) : null}
            {noticia.evento ? (
              <Badge variant="outline">Evento: {noticia.evento.titulo}</Badge>
            ) : null}
          </div>
        ) : null}
        <article className="max-w-3xl text-base leading-relaxed whitespace-pre-wrap">
          {noticia.conteudo || noticia.resumo}
        </article>
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/noticias">Voltar para notícias</Link>
        </Button>
      </PageSection>
    </>
  );
}
