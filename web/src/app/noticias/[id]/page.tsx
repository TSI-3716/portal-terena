import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { PageSection } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { getNoticiaPublica } from "@/lib/noticias";
import { getPublicAssetUrl } from "@/lib/storage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  return { title: noticia?.titulo ?? "Notícia" };
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await getNoticiaPublica(id);
  if (!noticia) notFound();

  return (
    <>
      <Hero
        eyebrow={formatDate(noticia.data_publicacao)}
        title={noticia.titulo}
        description={noticia.resumo}
        imageSrc={noticia.imagem ? getPublicAssetUrl(noticia.imagem) : undefined}
        imageAlt={noticia.titulo}
      />
      <PageSection>
        <article className="max-w-3xl whitespace-pre-wrap text-base leading-relaxed">
          {noticia.conteudo}
        </article>
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/noticias">Voltar para notícias</Link>
        </Button>
      </PageSection>
    </>
  );
}
