import type { Metadata } from "next";
import { BookOpen, CalendarDays, Feather, Landmark, Languages, UsersRound } from "lucide-react";
import { BuscaForm } from "@/components/busca-form";
import { ConteudoCard, escolherDestaques } from "@/components/conteudo-card";
import { Hero } from "@/components/hero";
import { Listagem, Vazio } from "@/components/listagem";
import { CardGrid } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { getSecao, listConteudos, tiposDaSecao } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Cultura Terena" };

const icones: Record<string, typeof BookOpen> = {
  "memoria-viva": UsersRound,
  "historia-terena": Landmark,
  "lingua-terena": Languages,
  "tradicoes-e-saberes": Feather,
  "calendario-cultural": CalendarDays,
};

export default async function CulturaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q = "", categoria = "" } = await searchParams;
  const busca = q.trim();
  const secao = await getSecao("cultura");
  const filtroTipo = secao?.categorias.find((tipo) => tipo.slug === categoria);
  const filtrando = Boolean(busca || filtroTipo);

  const conteudos = secao
    ? await listConteudos({
        tipos: filtroTipo ? [filtroTipo.id_tipo] : tiposDaSecao(secao),
        busca,
      })
    : [];
  const destaques = filtrando ? [] : escolherDestaques(conteudos, 3);

  return (
    <>
      <Hero
        eyebrow="Memória • língua • tradições"
        title="Cultura Terena"
        description="Nossa cultura é viva e se fortalece a cada geração. Conheça memória, história, língua, tradições e calendário cultural."
        imageSrc={staticImage("cultura_hero")}
      />
      <PageSection>
        <SectionHeader title="Navegue pela Cultura" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(secao?.categorias ?? []).map((tipo) => {
            const Icone = icones[tipo.slug ?? ""] ?? BookOpen;
            return (
              <Tile
                key={tipo.id_tipo}
                href={`/cultura/${tipo.slug}`}
                icon={<Icone className="size-5" />}
                title={tipo.nome}
                description={tipo.descricao ?? ""}
              />
            );
          })}
        </div>
      </PageSection>
      <Listagem
        destaquesTitulo="Destaques da Cultura"
        destaques={
          secao && destaques.length > 0 ? (
            <CardGrid>
              {destaques.map((item) => (
                <ConteudoCard key={item.id_conteudo} conteudo={item} secao={secao} slug="cultura" />
              ))}
            </CardGrid>
          ) : undefined
        }
        titulo={filtrando ? "Resultado da consulta" : "Todos os conteúdos"}
        busca={
          <BuscaForm
            action="/cultura"
            q={busca}
            label="Buscar na Cultura"
            filtro={{
              param: "categoria",
              label: "Categoria",
              value: filtroTipo?.slug ?? "",
              allLabel: "Todas as categorias",
              options: (secao?.categorias ?? []).map((tipo) => ({
                value: tipo.slug ?? "",
                label: tipo.nome,
              })),
            }}
          />
        }
      >
        {secao && conteudos.length > 0 ? (
          <CardGrid>
            {conteudos.map((item) => (
              <ConteudoCard key={item.id_conteudo} conteudo={item} secao={secao} slug="cultura" />
            ))}
          </CardGrid>
        ) : (
          <Vazio>
            {filtrando
              ? "Nenhum conteúdo encontrado. Tente outra palavra-chave."
              : "Os conteúdos da Cultura estão sendo cadastrados pela equipe. Volte em breve."}
          </Vazio>
        )}
      </Listagem>
    </>
  );
}
