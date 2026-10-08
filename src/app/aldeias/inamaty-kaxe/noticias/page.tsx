import type { Metadata } from "next";
import { NoticiaList } from "@/components/noticia-list";
import { PageHeading, PageSection } from "@/components/site-layout";
import { getInamaty } from "@/lib/conteudo";
import { listNoticiasPublicas } from "@/lib/noticias";

export const metadata: Metadata = { title: "Notícias da Aldeia | Inamaty Kaxé" };

export default async function InamatyNoticiasPage() {
  const aldeia = await getInamaty();
  const noticias = aldeia
    ? await listNoticiasPublicas({ idAldeia: aldeia.id_aldeia })
    : [];

  return (
    <>
      <PageHeading
        title="Notícias da Aldeia"
        description="Acompanhe atividades e acontecimentos da comunidade."
      />
      <PageSection contained={false} className="pt-4">
        <NoticiaList
          noticias={noticias}
          empty="Ainda não há notícias publicadas sobre a Inamaty Kaxé."
        />
      </PageSection>
    </>
  );
}
