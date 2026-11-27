import type { Metadata } from "next";
import { ArtesanatoCard } from "@/components/artesanato-card";
import { BuscaForm } from "@/components/busca-form";
import { Hero } from "@/components/hero";
import { Listagem, Vazio } from "@/components/listagem";
import { CardGrid } from "@/components/site-card";
import { listArtesanato } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";
import { destaquesRotativos } from "@/lib/text";

export const metadata: Metadata = { title: "Artesanato Terena" };

export default async function ArtesanatoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q = "", categoria = "" } = await searchParams;
  const busca = q.trim();

  // Categorias saem do que está cadastrado, para o filtro nunca ficar vazio.
  const todas = await listArtesanato();
  const categorias = [
    ...new Set(todas.map((peca) => peca.categoria?.trim()).filter((c): c is string => Boolean(c))),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const filtro = categorias.includes(categoria) ? categoria : undefined;
  const filtrando = Boolean(busca || filtro);

  const pecas = filtrando ? await listArtesanato({ busca, categoria: filtro }) : todas;
  const destaques = filtrando ? [] : destaquesRotativos(todas, 4);

  return (
    <>
      <Hero
        eyebrow="Cultura • trabalho • identidade"
        title="Artesanato Terena"
        description="Peças que carregam a história e a tradição do povo Terena, feitas por artesãs e artesãos das aldeias."
        imageSrc={staticImage("feira_hero")}
      />
      <Listagem
        destaquesTitulo="Peças em destaque"
        destaques={
          destaques.length > 0 ? (
            <CardGrid columns={4}>
              {destaques.map((peca) => (
                <ArtesanatoCard key={peca.id_artesanato} peca={peca} />
              ))}
            </CardGrid>
          ) : undefined
        }
        titulo={filtrando ? "Resultado da consulta" : "Todo o artesanato"}
        busca={
          <BuscaForm
            action="/artesanato"
            q={busca}
            label="Buscar artesanato"
            filtro={{
              param: "categoria",
              label: "Categoria",
              value: filtro,
              allLabel: "Todas as categorias",
              options: categorias.map((value) => ({ value, label: value })),
            }}
          />
        }
      >
        {pecas.length === 0 ? (
          <Vazio>
            {filtrando
              ? "Nenhuma peça encontrada. Tente outra palavra-chave."
              : "Nenhuma peça de artesanato cadastrada ainda."}
          </Vazio>
        ) : (
          <CardGrid columns={4}>
            {pecas.map((peca) => (
              <ArtesanatoCard key={peca.id_artesanato} peca={peca} />
            ))}
          </CardGrid>
        )}
      </Listagem>
    </>
  );
}
