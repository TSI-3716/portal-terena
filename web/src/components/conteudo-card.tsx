import { SiteCard } from "@/components/site-card";
import type { Secao } from "@/lib/conteudo";
import type { Conteudo } from "@/lib/database";
import { formatDate } from "@/lib/format";
import { conteudoHref, type SecaoSlug } from "@/lib/secoes";
import { resolveImageUrl } from "@/lib/storage";
import { destaquesRotativos } from "@/lib/text";

export function ConteudoCard({
  conteudo,
  secao,
  slug,
}: {
  conteudo: Conteudo;
  secao: Secao;
  slug: SecaoSlug;
}) {
  const tipo = secao.categorias.find((item) => item.id_tipo === conteudo.id_tipo);
  const data = formatDate(conteudo.data_publicacao);

  return (
    <SiteCard
      search={`${conteudo.titulo} ${conteudo.resumo ?? ""}`}
      meta={[tipo?.nome, data].filter(Boolean).join(" · ") || undefined}
      title={conteudo.titulo}
      description={conteudo.resumo || conteudo.descricao}
      href={conteudoHref(slug, conteudo.id_conteudo, tipo?.slug)}
      imageSrc={resolveImageUrl(conteudo.imagem)}
      imageAlt={conteudo.titulo}
    />
  );
}

/** Destaques: primeiro os marcados no painel; completa com rotação diária. */
export function escolherDestaques(conteudos: Conteudo[], quantidade: number) {
  const marcados = conteudos.filter((item) => item.destaque);
  if (marcados.length >= quantidade) return destaquesRotativos(marcados, quantidade);
  const resto = conteudos.filter((item) => !item.destaque);
  return [...marcados, ...destaquesRotativos(resto, quantidade - marcados.length)];
}
