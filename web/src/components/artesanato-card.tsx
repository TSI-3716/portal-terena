import Link from "next/link";
import { SiteCard } from "@/components/site-card";
import type { Artesanato } from "@/lib/database";
import { formatCurrency } from "@/lib/format";
import { resolveImageUrl } from "@/lib/storage";

export function ArtesanatoCard({
  peca,
  metaFrom = "categoria",
}: {
  peca: Artesanato;
  /** O que mostrar no selo do card: a categoria ou o preço. */
  metaFrom?: "categoria" | "preco";
}) {
  const preco = peca.preco !== null ? formatCurrency(peca.preco) : undefined;
  const meta = metaFrom === "preco" ? preco : (peca.categoria ?? undefined);

  return (
    <SiteCard
      search={`${peca.nome} ${peca.categoria ?? ""} ${peca.descricao ?? ""} artesanato`}
      meta={meta}
      title={peca.nome}
      description={peca.descricao ?? ""}
      imageSrc={resolveImageUrl(peca.imagem)}
      imageAlt={peca.nome}
      hrefLabel="Ver produto"
      details={
        <>
          {peca.categoria ? (
            <p>
              <strong className="text-primary">Categoria:</strong> {peca.categoria}
            </p>
          ) : null}
          <p>
            <strong className="text-primary">Preço:</strong>{" "}
            {preco ?? "Consulte as artesãs e artesãos"}
          </p>
          <p>
            Para comprar, fale com a gente pela{" "}
            <Link href="/contato" className="text-primary underline underline-offset-4">
              página de contato
            </Link>
            .
          </p>
        </>
      }
    />
  );
}
