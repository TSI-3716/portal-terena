import type { ReactNode } from "react";
import { PageSection, SectionHeader } from "@/components/site-layout";

/**
 * Estrutura padrão das páginas de listagem (notícias, projetos, eventos,
 * artesanato, cultura, juventude): destaques no topo e, abaixo, a busca com
 * todos os itens. Os destaques somem quando há busca/filtro ativo.
 */
export function Listagem({
  destaquesTitulo = "Em destaque",
  destaques,
  titulo,
  busca,
  children,
}: {
  destaquesTitulo?: string;
  destaques?: ReactNode;
  titulo: string;
  busca: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {destaques ? (
        <PageSection>
          <SectionHeader title={destaquesTitulo} />
          {destaques}
        </PageSection>
      ) : null}
      <PageSection muted={Boolean(destaques)}>
        <div id="lista" className="scroll-mt-24">
          <SectionHeader title={titulo} />
          {busca}
          {children}
        </div>
      </PageSection>
    </>
  );
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
