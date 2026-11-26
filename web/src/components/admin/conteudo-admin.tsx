import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice } from "@/components/admin/admin-notice";
import { Carimbos } from "@/components/admin/carimbos";
import { ConteudoForm } from "@/components/admin/conteudo-form";
import { PageHeading } from "@/components/site-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSecao, listAldeias, tiposDaSecao, type Secao } from "@/lib/conteudo";
import { getConteudoAdmin, listConteudosAdmin } from "@/lib/conteudos-admin";
import { formatDate } from "@/lib/format";
import { listGaleria } from "@/lib/galeria";
import { noticiaStatusLabel } from "@/lib/schemas";
import { conteudoHref, secoes, type SecaoSlug } from "@/lib/secoes";
import { resolveImageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

/** Categorias que aceitam conteúdo: as subcategorias, ou a própria seção se não houver. */
function opcoesCategoria(secao: Secao) {
  const tipos = secao.categorias.length > 0 ? secao.categorias : [secao.raiz];
  return tipos.map((tipo) => ({ value: String(tipo.id_tipo), label: tipo.nome }));
}

function SecaoAusente({ slug }: { slug: SecaoSlug }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        O tipo de conteúdo “{secoes[slug].titulo}” não foi encontrado. Aplique a migration
        20261126120000_ajustes_relatorio_celeny.sql no Supabase.
      </AlertDescription>
    </Alert>
  );
}

export async function ConteudoAdminLista({
  slug,
  categoria,
  ok,
  erro,
}: {
  slug: SecaoSlug;
  categoria?: string;
  ok?: string;
  erro?: string;
}) {
  const config = secoes[slug];
  const secao = await getSecao(slug);
  if (!secao) {
    return (
      <>
        <PageHeading title={config.titulo} />
        <SecaoAusente slug={slug} />
      </>
    );
  }

  const conteudos = await listConteudosAdmin(tiposDaSecao(secao));
  const porTipo = new Map([secao.raiz, ...secao.categorias].map((tipo) => [tipo.id_tipo, tipo]));
  const ativa = secao.categorias.find((tipo) => tipo.slug === categoria);
  const visiveis = ativa ? conteudos.filter((item) => item.id_tipo === ativa.id_tipo) : conteudos;

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title={config.titulo} description={config.descricaoAdmin} />
        <Button asChild>
          <Link href={`${config.admin}/novo${ativa ? `?categoria=${ativa.slug}` : ""}`}>
            Novo conteúdo
          </Link>
        </Button>
      </div>
      <AdminNotice ok={ok} erro={erro} />

      {secao.categorias.length > 0 ? (
        <nav aria-label="Categorias" className="mb-6 flex flex-wrap gap-2">
          <Button variant={ativa ? "outline" : "default"} size="sm" asChild>
            <Link href={config.admin}>Todas ({conteudos.length})</Link>
          </Button>
          {secao.categorias.map((tipo) => {
            const total = conteudos.filter((item) => item.id_tipo === tipo.id_tipo).length;
            return (
              <Button
                key={tipo.id_tipo}
                variant={ativa?.id_tipo === tipo.id_tipo ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={`${config.admin}?categoria=${tipo.slug}`}>
                  {tipo.nome} ({total})
                </Link>
              </Button>
            );
          })}
        </nav>
      ) : null}

      {visiveis.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nada cadastrado {ativa ? `em “${ativa.nome}”` : "ainda"}. Use “Novo conteúdo” para começar.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border">
          {visiveis.map((item) => {
            const tipo = porTipo.get(item.id_tipo);
            return (
              <li key={item.id_conteudo} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary">{item.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {[tipo?.nome, formatDate(item.data_publicacao)].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Badge variant={item.status === "publicado" ? "default" : "secondary"}>
                  {noticiaStatusLabel[item.status as "publicado" | "rascunho"] ?? item.status}
                </Badge>
                <div className="flex gap-2">
                  {item.status === "publicado" ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={conteudoHref(slug, item.id_conteudo, tipo?.slug)}>Ver no portal</Link>
                    </Button>
                  ) : null}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`${config.admin}/${item.id_conteudo}`}>Editar</Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

async function aldeiaOptions() {
  const aldeias = await listAldeias();
  return aldeias.map((aldeia) => ({ value: String(aldeia.id_aldeia), label: aldeia.nome }));
}

export async function ConteudoAdminNovo({ slug, categoria }: { slug: SecaoSlug; categoria?: string }) {
  const secao = await getSecao(slug);
  if (!secao) return <SecaoAusente slug={slug} />;
  const escolhida = secao.categorias.find((tipo) => tipo.slug === categoria);

  return (
    <>
      <PageHeading title={`Novo conteúdo — ${secoes[slug].titulo}`} />
      <div className="mt-6">
        <ConteudoForm
          secao={slug}
          id={null}
          initial={escolhida ? { id_tipo: String(escolhida.id_tipo) } : undefined}
          categorias={opcoesCategoria(secao)}
          aldeias={await aldeiaOptions()}
        />
      </div>
    </>
  );
}

export async function ConteudoAdminEditar({
  slug,
  rawId,
  erro,
}: {
  slug: SecaoSlug;
  rawId: string;
  erro?: string;
}) {
  const id = Number(rawId);
  const [secao, conteudo] = await Promise.all([getSecao(slug), getConteudoAdmin(id)]);
  if (!secao) return <SecaoAusente slug={slug} />;
  if (!conteudo || !tiposDaSecao(secao).includes(conteudo.id_tipo)) notFound();

  const [galeria, aldeias] = await Promise.all([
    listGaleria("conteudo", conteudo.id_conteudo),
    aldeiaOptions(),
  ]);
  const tipo = [secao.raiz, ...secao.categorias].find((item) => item.id_tipo === conteudo.id_tipo);

  return (
    <>
      <div className="mb-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title={`Editar conteúdo — ${secoes[slug].titulo}`} description={conteudo.titulo} />
        {conteudo.status === "publicado" ? (
          <Button variant="outline" asChild>
            <Link href={conteudoHref(slug, conteudo.id_conteudo, tipo?.slug)}>Ver no portal</Link>
          </Button>
        ) : null}
      </div>
      <Carimbos criadoEm={conteudo.criado_em} atualizadoEm={conteudo.atualizado_em} />
      {erro ? (
        <Alert variant="destructive" className={cn("mb-6 max-w-3xl")}>
          <AlertDescription>Não foi possível excluir. Tente novamente.</AlertDescription>
        </Alert>
      ) : null}
      <ConteudoForm
        secao={slug}
        id={conteudo.id_conteudo}
        initial={{
          titulo: conteudo.titulo,
          id_tipo: String(conteudo.id_tipo),
          resumo: conteudo.resumo ?? "",
          descricao: conteudo.descricao ?? "",
          data_publicacao: conteudo.data_publicacao ?? "",
          status: conteudo.status,
          fonte: conteudo.fonte ?? "",
          id_aldeia: conteudo.id_aldeia ? String(conteudo.id_aldeia) : "",
          destaque: conteudo.destaque,
        }}
        categorias={opcoesCategoria(secao)}
        aldeias={aldeias}
        imageUrl={resolveImageUrl(conteudo.imagem)}
        galeria={galeria}
      />
    </>
  );
}
