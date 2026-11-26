import { notFound, permanentRedirect } from "next/navigation";
import { ConteudoDetalhe } from "@/components/conteudo-detalhe";
import { getConteudo, getSecao, tiposDaSecao } from "@/lib/conteudo";
import { formatDate } from "@/lib/format";
import { listGaleria } from "@/lib/galeria";
import { conteudoHref, secoes, type SecaoSlug } from "@/lib/secoes";
import { resolveImageUrl } from "@/lib/storage";

/**
 * Detalhe de um conteúdo de Cultura/Juventude. Se o endereço não bate com a
 * categoria atual do conteúdo (ex.: categoria trocada no painel), redireciona.
 */
export async function ConteudoPublico({
  slug,
  rawId,
  categoria,
}: {
  slug: SecaoSlug;
  rawId: string;
  categoria?: string;
}) {
  const id = Number(rawId);
  const [secao, conteudo] = await Promise.all([getSecao(slug), getConteudo(id)]);
  if (!secao || !conteudo || !tiposDaSecao(secao).includes(conteudo.id_tipo)) notFound();

  const tipo = secao.categorias.find((item) => item.id_tipo === conteudo.id_tipo);
  const canonico = conteudoHref(slug, conteudo.id_conteudo, tipo?.slug);
  const atual = categoria ? `${secoes[slug].rota}/${categoria}/${rawId}` : `${secoes[slug].rota}/${rawId}`;
  if (canonico !== atual) permanentRedirect(canonico);

  const galeria = await listGaleria("conteudo", conteudo.id_conteudo);
  const voltar = tipo
    ? { href: `${secoes[slug].rota}/${tipo.slug}`, label: `Voltar para ${tipo.nome}` }
    : { href: secoes[slug].rota, label: `Voltar para ${secoes[slug].titulo}` };

  return (
    <ConteudoDetalhe
      categoria={tipo?.nome ?? secoes[slug].titulo}
      titulo={conteudo.titulo}
      resumo={conteudo.resumo}
      meta={formatDate(conteudo.data_publicacao)}
      imagem={resolveImageUrl(conteudo.imagem)}
      galeria={galeria}
      fonte={conteudo.fonte}
      voltar={voltar}
    >
      {conteudo.descricao}
    </ConteudoDetalhe>
  );
}

export async function tituloConteudo(rawId: string) {
  const conteudo = await getConteudo(Number(rawId));
  return conteudo?.titulo ?? "Conteúdo";
}
